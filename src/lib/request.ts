import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

/** One-way hash so raw IP addresses are never stored */
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? "dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function getClientIpHash(): Promise<string> {
  return hashIp(await getClientIp());
}
