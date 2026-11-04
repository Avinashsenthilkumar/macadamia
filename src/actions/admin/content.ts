"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { idFrom, revalidatePublic, runAction, type ActionState } from "@/lib/admin-action";
import { storeImage } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { faqSchema, formToObject, galleryImageSchema, serviceSchema, testimonialSchema } from "@/lib/validations/admin";

// ─── Gallery ────────────────────────────────────────────────────────────

export async function uploadGalleryImages(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const v = galleryImageSchema.parse(formToObject(formData));
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) return { ok: false, message: "Choose at least one image.", errors: { files: "Choose at least one image" } };
    if (files.length > 12) return { ok: false, message: "Upload at most 12 images at a time." };
    const urls: string[] = [];
    for (const f of files) urls.push(await storeImage(f, "gallery"));
    await db.galleryImage.createMany({
      data: urls.map((url, i) => ({
        url,
        alt: files.length > 1 ? `${v.alt} (${i + 1})` : v.alt,
        caption: v.caption ?? null,
        category: v.category,
        isCompanyPhoto: v.isCompanyPhoto,
        isPublished: v.isPublished,
        sortOrder: v.sortOrder + i,
      })),
    });
    await audit(user, "upload", "GalleryImage", null, { count: urls.length, category: v.category });
    revalidatePath("/admin/gallery");
    revalidatePublic("/gallery");
    return { ok: true, message: `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded.` };
  });
}

export async function updateGalleryImage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    if (!id) return { ok: false, message: "Missing image." };
    const v = galleryImageSchema.parse(formToObject(formData));
    await db.galleryImage.update({ where: { id }, data: { ...v, caption: v.caption ?? null } });
    await audit(user, "update", "GalleryImage", id);
    revalidatePath("/admin/gallery");
    revalidatePublic("/gallery");
    return { ok: true, message: "Image updated." };
  });
}

export async function deleteGalleryImage(id: string): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    await db.galleryImage.delete({ where: { id } });
    await audit(user, "delete", "GalleryImage", id);
    revalidatePath("/admin/gallery");
    revalidatePublic("/gallery");
    return { ok: true, message: "Image deleted." };
  });
}

// ─── FAQ ────────────────────────────────────────────────────────────────

export async function saveFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    const v = faqSchema.parse(formToObject(formData));
    const faq = id ? await db.faq.update({ where: { id }, data: v }) : await db.faq.create({ data: v });
    await audit(user, id ? "update" : "create", "Faq", faq.id);
    revalidatePath("/admin/faqs");
    revalidatePublic("/faq", "/why-macadamia");
    return { ok: true, message: id ? "FAQ updated." : "FAQ added." };
  });
}

export async function deleteFaq(id: string): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    await db.faq.delete({ where: { id } });
    await audit(user, "delete", "Faq", id);
    revalidatePath("/admin/faqs");
    revalidatePublic("/faq", "/why-macadamia");
    return { ok: true, message: "FAQ deleted." };
  });
}

/** Swaps sort order with the neighbouring FAQ */
export async function moveFaq(id: string, direction: "up" | "down"): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const all = await db.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true } });
    const idx = all.findIndex((f) => f.id === id);
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= all.length) return { ok: true, message: "Already at the edge." };
    const order = all.map((f) => f.id);
    [order[idx], order[swap]] = [order[swap]!, order[idx]!];
    await db.$transaction(order.map((fid, i) => db.faq.update({ where: { id: fid }, data: { sortOrder: i * 10 } })));
    await audit(user, "reorder", "Faq", id, { direction });
    revalidatePath("/admin/faqs");
    revalidatePublic("/faq", "/why-macadamia");
    return { ok: true, message: "Order updated." };
  });
}

// ─── Services ───────────────────────────────────────────────────────────

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    const v = serviceSchema.parse(formToObject(formData));
    const data = { ...v, slug: v.slug ?? slugify(v.title) };
    const svc = id ? await db.service.update({ where: { id }, data }) : await db.service.create({ data });
    await audit(user, id ? "update" : "create", "Service", svc.id, { available: svc.isAvailable, published: svc.isPublished });
    revalidatePath("/admin/services");
    revalidatePublic("/plantation-services");
    return { ok: true, message: id ? "Service updated." : "Service added." };
  });
}

export async function deleteService(id: string): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser("ADMIN");
    await db.service.delete({ where: { id } });
    await audit(user, "delete", "Service", id);
    revalidatePath("/admin/services");
    revalidatePublic("/plantation-services");
    return { ok: true, message: "Service deleted." };
  });
}

// ─── Testimonials ───────────────────────────────────────────────────────

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    const v = testimonialSchema.parse(formToObject(formData));
    if (v.isPublished && !v.confirmGenuine) {
      return {
        ok: false,
        message: "Please confirm this is a genuine customer testimonial before publishing.",
        errors: { confirmGenuine: "Confirmation required to publish" },
      };
    }
    const data = { name: v.name, location: v.location ?? null, quote: v.quote, isPublished: v.isPublished, sortOrder: v.sortOrder };
    const t = id ? await db.testimonial.update({ where: { id }, data }) : await db.testimonial.create({ data });
    await audit(user, id ? "update" : "create", "Testimonial", t.id, { published: t.isPublished, confirmedGenuine: v.confirmGenuine });
    revalidatePath("/admin/testimonials");
    revalidatePublic();
    return { ok: true, message: "Testimonial saved." };
  });
}

export async function deleteTestimonial(id: string): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    await db.testimonial.delete({ where: { id } });
    await audit(user, "delete", "Testimonial", id);
    revalidatePath("/admin/testimonials");
    revalidatePublic();
    return { ok: true, message: "Testimonial deleted." };
  });
}
