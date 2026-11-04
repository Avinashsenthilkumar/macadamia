import type { Prisma } from "@prisma/client";
import { enquiryStatuses, enquiryTypes, type EnquiryStatusKey, type EnquiryTypeKey } from "@/lib/labels";

export type EnquiryFilterInput = { q?: string; status?: string; type?: string; from?: string; to?: string };

/** Builds a safe Prisma filter from untrusted query-string values */
export function buildEnquiryWhere(f: EnquiryFilterInput): Prisma.EnquiryWhereInput {
  const where: Prisma.EnquiryWhereInput = {};
  if (f.status && (enquiryStatuses as string[]).includes(f.status)) where.status = f.status as EnquiryStatusKey;
  if (f.type && (enquiryTypes as string[]).includes(f.type)) where.enquiryType = f.type as EnquiryTypeKey;

  const from = f.from && /^\d{4}-\d{2}-\d{2}$/.test(f.from) ? new Date(`${f.from}T00:00:00`) : null;
  const to = f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.to) ? new Date(`${f.to}T23:59:59.999`) : null;
  if (from || to) where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

  const q = f.q?.trim().slice(0, 80);
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q.replace(/\s/g, "") } },
      { email: { contains: q, mode: "insensitive" } },
      { reference: { contains: q, mode: "insensitive" } },
      { district: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}
