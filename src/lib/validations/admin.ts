import { z } from "zod";
import {
  availabilities,
  enquiryStatuses,
  galleryCategories,
  priceTypes,
  propagations,
  type AvailabilityKey,
  type EnquiryStatusKey,
  type GalleryCategoryKey,
  type PriceTypeKey,
  type PropagationKey,
} from "@/lib/labels";

// ─── FormData helpers ───────────────────────────────────────────────────

const trimOrUndef = (v: unknown) => {
  if (typeof v !== "string") return v ?? undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
};

export const optStr = (max: number) => z.preprocess(trimOrUndef, z.string().max(max).optional());
export const reqStr = (min: number, max: number, label: string) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : v),
    z.string({ required_error: `${label} is required` }).min(min, `${label} must be at least ${min} characters`).max(max, `${label} must be at most ${max} characters`),
  );
export const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
export const optInt = (min = 0, max = 10_000_000) =>
  z.preprocess(trimOrUndef, z.coerce.number().int("Must be a whole number").min(min).max(max).optional());
export const int = (min = 0, max = 100_000) =>
  z.preprocess((v) => (trimOrUndef(v) === undefined ? 0 : v), z.coerce.number().int().min(min).max(max));
const slugStr = z.preprocess(
  trimOrUndef,
  z
    .string()
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only")
    .optional(),
);

export function formToObject(formData: FormData): Record<string, FormDataEntryValue> {
  const obj: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    obj[key] = value;
  }
  return obj;
}

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ─── Schemas ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(150),
  password: z.string().min(1, "Enter your password").max(200),
});

export const productSchema = z
  .object({
    name: reqStr(2, 120, "Product name"),
    slug: slugStr,
    scientificName: optStr(120),
    variety: optStr(120),
    shortDescription: optStr(240),
    description: reqStr(20, 10_000, "Description"),
    growingInfo: optStr(10_000),
    propagation: z.enum(propagations as [PropagationKey, ...PropagationKey[]]),
    propagationMethod: optStr(160),
    plantAge: optStr(60),
    plantHeight: optStr(60),
    containerSize: optStr(60),
    priceType: z.enum(priceTypes as [PriceTypeKey, ...PriceTypeKey[]]),
    price: z.preprocess(trimOrUndef, z.coerce.number().min(0).max(10_000_000).optional()),
    priceUnit: optStr(40),
    showPrice: checkbox,
    availability: z.enum(availabilities as [AvailabilityKey, ...AvailabilityKey[]]),
    stockQuantity: optInt(0),
    isFeatured: checkbox,
    isPublished: checkbox,
    sortOrder: int(0, 10_000),
    seoTitle: optStr(70),
    seoDescription: optStr(170),
  })
  .refine((v) => v.priceType !== "FIXED" || v.price !== undefined, {
    message: "Enter a price for fixed-price products",
    path: ["price"],
  });

export const enquiryUpdateSchema = z.object({
  status: z.enum(enquiryStatuses as [EnquiryStatusKey, ...EnquiryStatusKey[]]),
  followUpAt: z.preprocess(trimOrUndef, z.coerce.date().optional()),
  followUpDone: checkbox,
});

export const noteSchema = z.object({ body: reqStr(1, 4000, "Note") });

export const blogPostSchema = z.object({
  title: reqStr(5, 160, "Title"),
  slug: slugStr,
  excerpt: reqStr(20, 400, "Excerpt"),
  content: reqStr(50, 100_000, "Content"),
  categoryId: optStr(40),
  authorName: optStr(80),
  coverAlt: optStr(200),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: optStr(70),
  seoDescription: optStr(170),
});

export const blogCategorySchema = z.object({
  name: reqStr(2, 60, "Category name"),
  description: optStr(240),
});

export const galleryImageSchema = z.object({
  alt: reqStr(5, 200, "Alt text"),
  caption: optStr(240),
  category: z.enum(galleryCategories as [GalleryCategoryKey, ...GalleryCategoryKey[]]),
  isCompanyPhoto: checkbox,
  isPublished: checkbox,
  sortOrder: int(0, 10_000),
});

export const faqSchema = z.object({
  question: reqStr(5, 240, "Question"),
  answer: reqStr(5, 4000, "Answer"),
  category: z.preprocess((v) => trimOrUndef(v) ?? "General", z.string().max(60)),
  isPublished: checkbox,
  sortOrder: int(0, 10_000),
});

export const serviceSchema = z.object({
  title: reqStr(3, 120, "Title"),
  slug: slugStr,
  summary: reqStr(10, 300, "Summary"),
  description: reqStr(10, 5000, "Description"),
  icon: z.preprocess((v) => trimOrUndef(v) ?? "sprout", z.string().max(30)),
  isAvailable: checkbox,
  isPublished: checkbox,
  sortOrder: int(0, 10_000),
});

export const testimonialSchema = z.object({
  name: reqStr(2, 80, "Name"),
  location: optStr(80),
  quote: reqStr(10, 1500, "Testimonial"),
  isPublished: checkbox,
  confirmGenuine: checkbox,
  sortOrder: int(0, 10_000),
});

export const userCreateSchema = z.object({
  name: reqStr(2, 80, "Name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(150),
  role: z.enum(["ADMIN", "EDITOR"]),
  password: z.string().min(10, "At least 10 characters").max(200),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(10, "At least 10 characters").max(200),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

const optUrl = z.preprocess(
  trimOrUndef,
  z
    .string()
    .max(300)
    .refine((v) => /^https:\/\//.test(v), "Must start with https://")
    .optional(),
);

export const settingsSchema = z.object({
  businessName: reqStr(2, 80, "Business name"),
  tagline: reqStr(5, 160, "Tagline"),
  announcement: optStr(200),
  heroImageAlt: optStr(200),
  established: z.coerce.number().int().min(1900).max(2100),
  experienceLabel: reqStr(1, 20, "Experience label"),
  phonePrimary: reqStr(8, 20, "Primary phone"),
  phoneSecondary: optStr(20),
  phoneAdditional: optStr(20),
  whatsappNumber: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/\D/g, "") : v),
    z.string().regex(/^\d{10,15}$/, "Digits only, including country code (e.g. 919943119955)"),
  ),
  email: z.string().trim().email(),
  address1Label: optStr(40),
  address1Line1: optStr(120),
  address1Line2: optStr(120),
  address1City: optStr(60),
  address1State: optStr(60),
  address1Postal: optStr(12),
  address2Label: optStr(40),
  address2Line1: optStr(120),
  address2Line2: optStr(120),
  address2City: optStr(60),
  address2State: optStr(60),
  address2Postal: optStr(12),
  businessHours: optStr(600),
  facebook: optUrl,
  instagram: optUrl,
  youtube: optUrl,
  linkedin: optUrl,
  seoDefaultTitle: reqStr(10, 80, "Default SEO title"),
  seoDefaultDescription: reqStr(50, 180, "Default SEO description"),
  seoKeywords: optStr(600),
  showPrices: checkbox,
  showPlantationProcess: checkbox,
});
