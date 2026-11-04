import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Runs a read query and returns a fallback if the database is unreachable,
 * so public pages degrade gracefully instead of crashing (and builds don't fail
 * when the database is temporarily unavailable).
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T, label = "query"): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[db] ${label} failed:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}
