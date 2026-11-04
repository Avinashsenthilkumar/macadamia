import { z } from "zod";
import { enquiryTypes, type EnquiryTypeKey } from "@/lib/labels";

/** Normalises Indian mobile numbers to +91XXXXXXXXXX, or returns null if invalid */
export function normaliseIndianMobile(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, "");
  const m = compact.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return m ? `+91${m[1]}` : null;
}

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters`).optional().or(z.literal(""));

/**
 * Form-level schema: every field is a string so the same schema works with
 * React Hook Form on the client and with plain objects on the server.
 */
export const enquiryFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number")
    .refine((v) => normaliseIndianMobile(v) !== null, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .trim()
    .max(150)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address")
    .optional()
    .or(z.literal("")),
  state: optionalText(60, "State"),
  district: optionalText(60, "District"),
  location: optionalText(120, "Location"),
  landArea: optionalText(60, "Land area"),
  plantsRequired: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) > 0 && Number(v) <= 1_000_000), "Enter a whole number")
    .optional()
    .or(z.literal("")),
  enquiryType: z.enum(enquiryTypes as [EnquiryTypeKey, ...EnquiryTypeKey[]], {
    errorMap: () => ({ message: "Please choose an enquiry type" }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters)")
    .max(3000, "Message is too long"),
  productId: z.string().max(40).optional().or(z.literal("")),
  serviceId: z.string().max(40).optional().or(z.literal("")),
  source: z.string().max(40).optional().or(z.literal("")),
  /** Honeypot — real visitors never see or fill this field */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Time the form was rendered (ms since epoch) — used to reject instant bot submissions */
  startedAt: z.string().optional().or(z.literal("")),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

const emptyToNull = (v: string | undefined) => (v && v.trim() !== "" ? v.trim() : null);

/** Server-side: validates and converts into database-ready values */
export const enquiryServerSchema = enquiryFormSchema.transform((v) => ({
  fullName: v.fullName,
  phone: normaliseIndianMobile(v.phone)!,
  email: emptyToNull(v.email)?.toLowerCase() ?? null,
  state: emptyToNull(v.state),
  district: emptyToNull(v.district),
  location: emptyToNull(v.location),
  landArea: emptyToNull(v.landArea),
  plantsRequired: v.plantsRequired ? Number(v.plantsRequired) : null,
  enquiryType: v.enquiryType,
  message: v.message,
  productId: emptyToNull(v.productId),
  serviceId: emptyToNull(v.serviceId),
  source: emptyToNull(v.source) ?? "contact",
  honeypot: v.website ?? "",
  startedAt: v.startedAt ? Number(v.startedAt) : null,
}));
