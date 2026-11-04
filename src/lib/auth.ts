import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import type { RoleKey } from "@/lib/labels";

export const SESSION_COOKIE = "gn_admin_session";
const SESSION_HOURS = 8;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: { id: string; role: RoleKey; sessionVersion: number }) {
  const token = await new SignJWT({ role: user.role, ver: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .setAudience("gn-admin")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Returns the signed-in admin, or null. Re-validates against the database on every request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { audience: "gn-admin", algorithms: ["HS256"] });
    if (!payload.sub) return null;
    const user = await db.adminUser.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive || user.sessionVersion !== payload.ver) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
});

/** For pages/layouts: redirects to the login page when not authorised */
export async function requirePageUser(role?: RoleKey): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (role === "ADMIN" && user.role !== "ADMIN") redirect("/admin?denied=1");
  return user;
}

export class AuthError extends Error {
  constructor(message = "You are not authorised to perform this action.") {
    super(message);
    this.name = "AuthError";
  }
}

/** For server actions and route handlers: throws when not authorised */
export async function requireUser(role?: RoleKey): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError("Your session has expired. Please sign in again.");
  if (role === "ADMIN" && user.role !== "ADMIN") throw new AuthError();
  return user;
}
