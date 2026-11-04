// Human-readable labels for database enums. Kept free of Prisma imports so it can be
// used from client components.

export const enquiryTypeLabels = {
  INDIVIDUAL_PURCHASE: "Individual plant purchase",
  BULK_SAPLING: "Bulk sapling enquiry",
  PLANTATION_CONSULTATION: "Plantation consultation",
  AGRICULTURAL_GUIDANCE: "Agricultural guidance",
  GENERAL: "General enquiry",
} as const;
export type EnquiryTypeKey = keyof typeof enquiryTypeLabels;
export const enquiryTypes = Object.keys(enquiryTypeLabels) as EnquiryTypeKey[];

export const enquiryStatusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  QUOTATION_SENT: "Quotation Sent",
  CONVERTED: "Converted",
  CLOSED: "Closed",
} as const;
export type EnquiryStatusKey = keyof typeof enquiryStatusLabels;
export const enquiryStatuses = Object.keys(enquiryStatusLabels) as EnquiryStatusKey[];

export const enquiryStatusTone: Record<EnquiryStatusKey, string> = {
  NEW: "bg-amber-100 text-amber-900",
  CONTACTED: "bg-sky-100 text-sky-900",
  INTERESTED: "bg-violet-100 text-violet-900",
  QUOTATION_SENT: "bg-indigo-100 text-indigo-900",
  CONVERTED: "bg-emerald-100 text-emerald-900",
  CLOSED: "bg-stone-200 text-stone-700",
};

export const availabilityLabels = {
  IN_STOCK: "Available",
  LIMITED: "Limited availability",
  OUT_OF_STOCK: "Currently unavailable",
  PRE_ORDER: "Taking advance orders",
  ON_ENQUIRY: "Availability on enquiry",
} as const;
export type AvailabilityKey = keyof typeof availabilityLabels;
export const availabilities = Object.keys(availabilityLabels) as AvailabilityKey[];

export const propagationLabels = {
  GRAFTED: "Grafted",
  SEEDLING: "Seed-grown",
  CUTTING: "Cutting",
  AIR_LAYERED: "Air-layered",
  OTHER: "Other",
  UNSPECIFIED: "To be confirmed",
} as const;
export type PropagationKey = keyof typeof propagationLabels;
export const propagations = Object.keys(propagationLabels) as PropagationKey[];

export const priceTypeLabels = {
  FIXED: "Fixed price",
  ON_REQUEST: "Price on request",
  QUOTATION: "Contact for quotation",
} as const;
export type PriceTypeKey = keyof typeof priceTypeLabels;
export const priceTypes = Object.keys(priceTypeLabels) as PriceTypeKey[];

export const galleryCategoryLabels = {
  NURSERY: "Nursery",
  SAPLINGS: "Macadamia Saplings",
  TREES: "Macadamia Trees",
  NUTS: "Macadamia Nuts",
  PLANTATION: "Plantation",
  FARM_ACTIVITIES: "Farm Activities",
} as const;
export type GalleryCategoryKey = keyof typeof galleryCategoryLabels;
export const galleryCategories = Object.keys(galleryCategoryLabels) as GalleryCategoryKey[];

export const roleLabels = { ADMIN: "Administrator", EDITOR: "Editor" } as const;
export type RoleKey = keyof typeof roleLabels;

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;
