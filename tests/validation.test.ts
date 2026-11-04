import { test } from "node:test";
import assert from "node:assert/strict";
import { enquiryFormSchema, enquiryServerSchema, normaliseIndianMobile } from "../src/lib/validations/enquiry";
import { productSchema, settingsSchema, loginSchema, testimonialSchema } from "../src/lib/validations/admin";

const validEnquiry = {
  fullName: "Ravi Kumar",
  phone: "98765 43210",
  email: "",
  state: "Tamil Nadu",
  district: "Thanjavur",
  location: "",
  landArea: "2 acres",
  plantsRequired: "200",
  enquiryType: "BULK_SAPLING" as const,
  message: "Need macadamia saplings for 2 acres.",
  productId: "",
  serviceId: "",
  source: "contact",
  website: "",
  startedAt: "",
};

test("Indian mobile numbers are normalised to +91XXXXXXXXXX", () => {
  assert.equal(normaliseIndianMobile("98765 43210"), "+919876543210");
  assert.equal(normaliseIndianMobile("+91 98765-43210"), "+919876543210");
  assert.equal(normaliseIndianMobile("09876543210"), "+919876543210");
  assert.equal(normaliseIndianMobile("919876543210"), "+919876543210");
});

test("invalid Indian mobile numbers are rejected", () => {
  for (const bad of ["12345", "5876543210", "98765432", "abcdefghij", "+1 415 555 0100", ""]) {
    assert.equal(normaliseIndianMobile(bad), null, bad);
  }
});

test("a complete enquiry passes and is converted for the database", () => {
  const r = enquiryServerSchema.safeParse(validEnquiry);
  assert.ok(r.success);
  assert.equal(r.data.phone, "+919876543210");
  assert.equal(r.data.plantsRequired, 200);
  assert.equal(r.data.email, null);
  assert.equal(r.data.location, null);
  assert.equal(r.data.source, "contact");
});

test("required fields are enforced", () => {
  const r = enquiryFormSchema.safeParse({ ...validEnquiry, fullName: "", phone: "", message: "short" });
  assert.equal(r.success, false);
  const fields = new Set(r.error!.issues.map((i) => i.path[0]));
  assert.ok(fields.has("fullName"));
  assert.ok(fields.has("phone"));
  assert.ok(fields.has("message"));
});

test("invalid email and non-numeric plant count are rejected", () => {
  assert.equal(enquiryFormSchema.safeParse({ ...validEnquiry, email: "not-an-email" }).success, false);
  assert.equal(enquiryFormSchema.safeParse({ ...validEnquiry, plantsRequired: "lots" }).success, false);
  assert.equal(enquiryFormSchema.safeParse({ ...validEnquiry, plantsRequired: "0" }).success, false);
});

test("unknown enquiry types are rejected", () => {
  assert.equal(enquiryFormSchema.safeParse({ ...validEnquiry, enquiryType: "HACK" }).success, false);
});

test("honeypot value is carried through so the server can drop spam", () => {
  const r = enquiryServerSchema.safeParse({ ...validEnquiry, website: "" });
  assert.ok(r.success);
  assert.equal(r.data.honeypot, "");
  // a bot that fills the hidden field fails validation (max length 0)
  assert.equal(enquiryServerSchema.safeParse({ ...validEnquiry, website: "http://spam" }).success, false);
});

test("product schema: checkboxes, blanks and fixed-price rule", () => {
  const base = {
    name: "Macadamia Plant",
    description: "A healthy macadamia sapling raised in our nursery.",
    propagation: "UNSPECIFIED",
    priceType: "QUOTATION",
    availability: "ON_ENQUIRY",
    sortOrder: "",
    scientificName: "   ",
  };
  const ok = productSchema.safeParse(base);
  assert.ok(ok.success);
  assert.equal(ok.data.isPublished, false);
  assert.equal(ok.data.scientificName, undefined, "blank strings become undefined");
  assert.equal(ok.data.sortOrder, 0);

  const fixedNoPrice = productSchema.safeParse({ ...base, priceType: "FIXED" });
  assert.equal(fixedNoPrice.success, false);
  const fixed = productSchema.safeParse({ ...base, priceType: "FIXED", price: "150", isPublished: "on" });
  assert.ok(fixed.success);
  assert.equal(fixed.data.price, 150);
  assert.equal(fixed.data.isPublished, true);

  assert.equal(productSchema.safeParse({ ...base, slug: "Bad Slug!" }).success, false);
});

test("settings schema normalises the WhatsApp number to digits", () => {
  const r = settingsSchema.safeParse({
    businessName: "Ganesh Nursery",
    tagline: "Grow Today. Harvest Tomorrow.",
    established: "1980",
    experienceLabel: "45+",
    phonePrimary: "+91 99431 19955",
    whatsappNumber: "+91 99431 19955",
    email: "care@ganeshnursery.com",
    seoDefaultTitle: "Macadamia Plants in India | Ganesh Nursery",
    seoDefaultDescription: "Ganesh Nursery, Thanjavur — macadamia plants, saplings and plantation guidance for growers across India.",
    facebook: "http://insecure.example.com",
  });
  assert.equal(r.success, false, "non-https social URLs are rejected");
  const r2 = settingsSchema.safeParse({ ...(r as { data?: object }).data, businessName: "Ganesh Nursery", tagline: "Grow Today. Harvest Tomorrow.", established: "1980", experienceLabel: "45+", phonePrimary: "+91 99431 19955", whatsappNumber: "+91 99431 19955", email: "care@ganeshnursery.com", seoDefaultTitle: "Macadamia Plants in India | Ganesh Nursery", seoDefaultDescription: "Ganesh Nursery, Thanjavur — macadamia plants, saplings and plantation guidance for growers across India." });
  assert.ok(r2.success);
  assert.equal(r2.data.whatsappNumber, "919943119955");
  assert.equal(r2.data.showPrices, false);
});

test("login schema lower-cases email", () => {
  const r = loginSchema.safeParse({ email: "  Care@GaneshNursery.com ", password: "x" });
  assert.ok(r.success);
  assert.equal(r.data.email, "care@ganeshnursery.com");
});

test("testimonial schema exposes the genuine-confirmation flag", () => {
  const r = testimonialSchema.safeParse({ name: "A Farmer", quote: "Healthy plants and good guidance.", isPublished: "on" });
  assert.ok(r.success);
  assert.equal(r.data.isPublished, true);
  assert.equal(r.data.confirmGenuine, false);
});
