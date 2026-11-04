"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { createSession, destroySession, getSessionUser, requireUser } from "@/lib/auth";
import { hashPassword, isStrongPassword, verifyPassword } from "@/lib/password";
import { isLoginBlocked, recordLoginAttempt } from "@/lib/rate-limit";
import { getClientIpHash } from "@/lib/request";
import { runAction, type ActionState } from "@/lib/admin-action";
import { loginSchema, passwordChangeSchema } from "@/lib/validations/admin";

// Hash of a random value, compared against for unknown emails so response timing stays similar
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword(randomUUID()));

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and password." };
  const { email, password } = parsed.data;

  let success = false;
  try {
    const ipHash = await getClientIpHash();
    if (await isLoginBlocked(email, ipHash)) {
      return { ok: false, message: "Too many failed attempts. Please wait 15 minutes and try again." };
    }
    const user = await db.adminUser.findUnique({ where: { email } });
    const valid = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
    success = Boolean(user && user.isActive && valid);
    await recordLoginAttempt(email, ipHash, success);
    if (!success || !user) return { ok: false, message: "Incorrect email or password." };

    await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession({ id: user.id, role: user.role, sessionVersion: user.sessionVersion });
    await audit({ id: user.id, email: user.email, name: user.name, role: user.role }, "login", "AdminUser", user.id);
  } catch (error) {
    console.error("[login]", error instanceof Error ? error.message : error);
    return { ok: false, message: "Sign-in is temporarily unavailable. Please try again." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const user = await getSessionUser();
  if (user) await audit(user, "logout", "AdminUser", user.id);
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const session = await requireUser();
    const data = passwordChangeSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });
    if (!isStrongPassword(data.newPassword)) {
      return { ok: false, message: "Use at least 10 characters with upper-case, lower-case letters and a number.", errors: { newPassword: "Password is too weak" } };
    }
    const user = await db.adminUser.findUniqueOrThrow({ where: { id: session.id } });
    if (!(await verifyPassword(data.currentPassword, user.passwordHash))) {
      return { ok: false, message: "Current password is incorrect.", errors: { currentPassword: "Incorrect password" } };
    }
    const updated = await db.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(data.newPassword), sessionVersion: { increment: 1 } },
    });
    // Other sessions are now invalid; issue a fresh one for this browser
    await createSession({ id: updated.id, role: updated.role, sessionVersion: updated.sessionVersion });
    await audit(session, "password_change", "AdminUser", user.id);
    return { ok: true, message: "Password updated. Other devices have been signed out." };
  });
}
