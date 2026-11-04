"use server";

import { randomInt } from "crypto";
import { db } from "@/lib/db";
import { emailLayout, escapeHtml, sendEmail } from "@/lib/email";
import { enquiryTypeLabels } from "@/lib/labels";
import { isEnquiryRateLimited } from "@/lib/rate-limit";
import { getClientIpHash } from "@/lib/request";
import { getSiteSettings } from "@/lib/settings";
import { absoluteUrl } from "@/lib/utils";
import { enquiryServerSchema, type EnquiryFormValues } from "@/lib/validations/enquiry";

export type EnquiryResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const MIN_FILL_MS = 3000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const suffix = Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `GN-${ymd}-${suffix}`;
}

export async function submitEnquiry(input: EnquiryFormValues): Promise<EnquiryResult> {
  // Spam protection: honeypot filled → pretend success, store nothing, reveal nothing
  if (input && typeof input.website === "string" && input.website.trim() !== "") {
    return { ok: true, reference: makeReference() };
  }
  const parsed = enquiryServerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please correct the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // Spam protection: submitted impossibly fast after the form appeared
  if (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS) {
    return { ok: false, error: "That was quick! Please review your details and submit again." };
  }

  try {
    const ipHash = await getClientIpHash();
    if (await isEnquiryRateLimited(ipHash)) {
      return {
        ok: false,
        error: "We have received several enquiries from your connection recently. Please call or WhatsApp us instead.",
      };
    }

    // Only link to products / services that really exist
    const [product, service] = await Promise.all([
      data.productId ? db.product.findUnique({ where: { id: data.productId }, select: { id: true, name: true } }) : null,
      data.serviceId ? db.service.findUnique({ where: { id: data.serviceId }, select: { id: true, title: true } }) : null,
    ]);

    let reference = makeReference();
    for (let i = 0; i < 3; i++) {
      const exists = await db.enquiry.findUnique({ where: { reference }, select: { id: true } });
      if (!exists) break;
      reference = makeReference();
    }

    const enquiry = await db.enquiry.create({
      data: {
        reference,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        state: data.state,
        district: data.district,
        location: data.location,
        landArea: data.landArea,
        plantsRequired: data.plantsRequired,
        enquiryType: data.enquiryType,
        message: data.message,
        source: data.source,
        productId: product?.id ?? null,
        serviceId: service?.id ?? null,
        ipHash,
      },
    });

    // Notifications are best-effort — the enquiry is already safely stored
    const settings = await getSiteSettings();
    const rows: [string, string | number | null][] = [
      ["Reference", enquiry.reference],
      ["Name", enquiry.fullName],
      ["Phone", enquiry.phone],
      ["Email", enquiry.email],
      ["Enquiry type", enquiryTypeLabels[enquiry.enquiryType]],
      ["Product", product?.name ?? null],
      ["Service", service?.title ?? null],
      ["State / District", [enquiry.state, enquiry.district].filter(Boolean).join(" / ") || null],
      ["Location", enquiry.location],
      ["Land area", enquiry.landArea],
      ["Plants required", enquiry.plantsRequired],
    ];
    const table = rows
      .filter(([, v]) => v !== null && v !== "")
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b5f57">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(String(v))}</strong></td></tr>`)
      .join("");

    await Promise.all([
      sendEmail({
        to: process.env.CONTACT_EMAIL || settings.email,
        replyTo: enquiry.email ?? undefined,
        subject: `New enquiry ${enquiry.reference} — ${enquiryTypeLabels[enquiry.enquiryType]}`,
        html: emailLayout(
          "New website enquiry",
          `<table>${table}</table><p style="margin-top:16px;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p><p><a href="${absoluteUrl(`/admin/enquiries/${enquiry.id}`)}" style="color:#426B45">Open in admin dashboard →</a></p>`,
        ),
        text: `${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${enquiry.message}`,
      }),
      enquiry.email
        ? sendEmail({
            to: enquiry.email,
            subject: `We received your enquiry (${enquiry.reference}) — ${settings.businessName}`,
            html: emailLayout(
              `Thank you, ${enquiry.fullName}`,
              `<p>We have received your enquiry and our team will contact you soon.</p><p>Your reference number is <strong>${enquiry.reference}</strong>.</p><p>For anything urgent, call us on <strong>${escapeHtml(settings.phones.primary)}</strong> or message us on WhatsApp.</p>`,
            ),
            text: `Thank you, ${enquiry.fullName}. We have received your enquiry (reference ${enquiry.reference}). Our team will contact you soon. Phone: ${settings.phones.primary}`,
          })
        : Promise.resolve(false),
    ]);

    return { ok: true, reference: enquiry.reference };
  } catch (error) {
    console.error("[enquiry] failed:", error instanceof Error ? error.message : error);
    return {
      ok: false,
      error: "Sorry, we couldn't send your enquiry right now. Please try again, or call / WhatsApp us directly.",
    };
  }
}
