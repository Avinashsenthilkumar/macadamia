import "server-only";
import { db } from "@/lib/db";

const LOGIN_WINDOW_MIN = 15;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 20;

const ENQUIRY_WINDOW_MIN = 60;
const MAX_ENQUIRIES_PER_IP = 5;

/** Database-backed so limits hold across serverless instances */
export async function isLoginBlocked(email: string, ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_WINDOW_MIN * 60_000);
  const [byEmail, byIp] = await Promise.all([
    db.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    db.loginAttempt.count({ where: { ipHash, success: false, createdAt: { gte: since } } }),
  ]);
  return byEmail >= MAX_FAILS_PER_EMAIL || byIp >= MAX_FAILS_PER_IP;
}

export async function recordLoginAttempt(email: string, ipHash: string, success: boolean) {
  await db.loginAttempt.create({ data: { email, ipHash, success } });
  // Opportunistic cleanup of old rows
  if (Math.random() < 0.05) {
    await db.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 7 * 86_400_000) } } });
  }
}

export async function isEnquiryRateLimited(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - ENQUIRY_WINDOW_MIN * 60_000);
  const count = await db.enquiry.count({ where: { ipHash, createdAt: { gte: since } } });
  return count >= MAX_ENQUIRIES_PER_IP;
}
