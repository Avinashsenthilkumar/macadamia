"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { runAction, type ActionState } from "@/lib/admin-action";
import { hashPassword, isStrongPassword } from "@/lib/password";
import { getSiteSettings, SITE_SETTINGS_KEY } from "@/lib/settings";
import { optionalImage } from "@/lib/upload";
import { formToObject, settingsSchema, userCreateSchema } from "@/lib/validations/admin";
import type { SiteSettings } from "@/config/site";

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser("ADMIN");
    const v = settingsSchema.parse(formToObject(formData));
    const current = await getSiteSettings();
    const [logo, hero] = await Promise.all([optionalImage(formData, "logo", "site"), optionalImage(formData, "heroImage", "site")]);

    const address = (n: 1 | 2, fallback: SiteSettings["addresses"][number] | undefined) => {
      const g = (k: string) => v[`address${n}${k}` as keyof typeof v] as string | undefined;
      if (!g("Line1") && !g("City")) return null;
      const line1 = g("Line1") ?? "";
      const city = g("City") ?? "";
      const state = g("State") ?? "Tamil Nadu";
      const postalCode = g("Postal") ?? "";
      return {
        label: g("Label") ?? fallback?.label ?? (n === 1 ? "Main office" : "Nursery"),
        line1,
        line2: g("Line2"),
        city,
        state,
        postalCode,
        mapsQuery: `${v.businessName}, ${[line1, g("Line2"), city, state, postalCode].filter(Boolean).join(", ")}`,
      };
    };

    const next: SiteSettings = {
      ...current,
      businessName: v.businessName,
      shortName: v.businessName,
      tagline: v.tagline,
      announcement: v.announcement ?? "",
      logoUrl: logo ?? current.logoUrl,
      heroImage: hero ?? current.heroImage,
      heroImageAlt: v.heroImageAlt ?? current.heroImageAlt,
      established: v.established,
      experienceLabel: v.experienceLabel,
      phones: { primary: v.phonePrimary, secondary: v.phoneSecondary ?? "", additional: v.phoneAdditional ?? "" },
      whatsappNumber: v.whatsappNumber,
      email: v.email,
      addresses: [address(1, current.addresses[0]), address(2, current.addresses[1])].filter((a): a is NonNullable<typeof a> => a !== null),
      businessHours: (v.businessHours ?? "").split("\n").map((l) => l.trim()).filter(Boolean),
      social: { facebook: v.facebook ?? "", instagram: v.instagram ?? "", youtube: v.youtube ?? "", linkedin: v.linkedin ?? "" },
      seo: {
        ...current.seo,
        defaultTitle: v.seoDefaultTitle,
        defaultDescription: v.seoDefaultDescription,
        keywords: (v.seoKeywords ?? "").split(",").map((k) => k.trim()).filter(Boolean),
      },
      showPrices: v.showPrices,
      showPlantationProcess: v.showPlantationProcess,
    };

    const value = next as unknown as Prisma.InputJsonValue;
    await db.websiteSetting.upsert({ where: { key: SITE_SETTINGS_KEY }, create: { key: SITE_SETTINGS_KEY, value }, update: { value } });
    await audit(user, "update", "WebsiteSetting", SITE_SETTINGS_KEY);
    revalidatePath("/", "layout");
    return { ok: true, message: "Settings saved. The website has been updated." };
  });
}

// ─── Users (administrators only) ────────────────────────────────────────

export async function createAdminUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const actor = await requireUser("ADMIN");
    const v = userCreateSchema.parse(formToObject(formData));
    if (!isStrongPassword(v.password)) {
      return { ok: false, message: "Use at least 10 characters with upper-case, lower-case letters and a number.", errors: { password: "Password is too weak" } };
    }
    const u = await db.adminUser.create({ data: { name: v.name, email: v.email, role: v.role, passwordHash: await hashPassword(v.password) } });
    await audit(actor, "create", "AdminUser", u.id, { email: u.email, role: u.role });
    revalidatePath("/admin/users");
    return { ok: true, message: `${u.name} can now sign in.` };
  });
}

export async function toggleUserActive(id: string): Promise<ActionState> {
  return runAction(async () => {
    const actor = await requireUser("ADMIN");
    if (id === actor.id) return { ok: false, message: "You cannot deactivate your own account." };
    const u = await db.adminUser.findUniqueOrThrow({ where: { id } });
    if (u.isActive && u.role === "ADMIN") {
      const activeAdmins = await db.adminUser.count({ where: { role: "ADMIN", isActive: true } });
      if (activeAdmins <= 1) return { ok: false, message: "At least one active administrator is required." };
    }
    await db.adminUser.update({ where: { id }, data: { isActive: !u.isActive, sessionVersion: { increment: 1 } } });
    await audit(actor, u.isActive ? "deactivate" : "activate", "AdminUser", id);
    revalidatePath("/admin/users");
    return { ok: true, message: u.isActive ? "User deactivated and signed out." : "User reactivated." };
  });
}

export async function signOutEverywhere(id: string): Promise<ActionState> {
  return runAction(async () => {
    const actor = await requireUser("ADMIN");
    await db.adminUser.update({ where: { id }, data: { sessionVersion: { increment: 1 } } });
    await audit(actor, "revoke_sessions", "AdminUser", id);
    revalidatePath("/admin/users");
    return { ok: true, message: "All sessions for this user have been signed out." };
  });
}
