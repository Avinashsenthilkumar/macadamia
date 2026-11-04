"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { idFrom, runAction, type ActionState } from "@/lib/admin-action";
import { enquiryUpdateSchema, formToObject, noteSchema } from "@/lib/validations/admin";

export async function updateEnquiry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    if (!id) return { ok: false, message: "Missing enquiry." };
    const v = enquiryUpdateSchema.parse(formToObject(formData));
    const before = await db.enquiry.findUniqueOrThrow({ where: { id }, select: { status: true } });
    await db.enquiry.update({
      where: { id },
      data: { status: v.status, followUpAt: v.followUpAt ?? null, followUpDone: v.followUpDone },
    });
    await audit(user, "update", "Enquiry", id, { from: before.status, to: v.status });
    revalidatePath(`/admin/enquiries/${id}`);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { ok: true, message: "Enquiry updated." };
  });
}

export async function addEnquiryNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    if (!id) return { ok: false, message: "Missing enquiry." };
    const v = noteSchema.parse(formToObject(formData));
    await db.enquiryNote.create({ data: { enquiryId: id, authorId: user.id, body: v.body } });
    await audit(user, "add_note", "Enquiry", id);
    revalidatePath(`/admin/enquiries/${id}`);
    return { ok: true, message: "Note added." };
  });
}

export async function quickSetStatus(id: string, status: "CONTACTED" | "CLOSED"): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    await db.enquiry.update({ where: { id }, data: { status } });
    await audit(user, "update", "Enquiry", id, { to: status });
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${id}`);
    return { ok: true, message: "Status updated." };
  });
}

export async function deleteEnquiry(id: string): Promise<ActionState> {
  const result = await runAction(async () => {
    const user = await requireUser("ADMIN");
    const e = await db.enquiry.delete({ where: { id } });
    await audit(user, "delete", "Enquiry", id, { reference: e.reference });
    revalidatePath("/admin/enquiries");
    return { ok: true, message: "Enquiry deleted.", redirectTo: "/admin/enquiries" };
  });
  if (result?.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}
