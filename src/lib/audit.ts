import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { SessionUser } from "@/lib/auth";

export async function audit(
  actor: SessionUser | null,
  action: string,
  entity: string,
  entityId?: string | null,
  details?: Prisma.InputJsonValue,
) {
  try {
    await db.auditLog.create({
      data: {
        actorId: actor?.id ?? null,
        actorEmail: actor?.email ?? "system",
        action,
        entity,
        entityId: entityId ?? null,
        details: details ?? undefined,
      },
    });
  } catch (error) {
    console.error("[audit] failed to write log:", error instanceof Error ? error.message : error);
  }
}
