import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Ganesh Nursery collects, uses and protects the information you share through this website.",
  path: "/privacy-policy",
});

export default async function PrivacyPage() {
  const s = await getSiteSettings();
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy" updated="November 2026">
      <p>
        This policy explains how {s.businessName} (“we”, “us”) handles information submitted through this website. This is a general template — please
        have it reviewed for your business before publishing.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Details you enter in our enquiry forms: name, mobile number, email, location, land area, plant requirements and your message.</li>
        <li>A one-way hashed (non-reversible) version of your IP address, used only to prevent spam and abuse.</li>
        <li>Standard technical information collected by our hosting provider, such as browser type and pages visited.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry by phone, WhatsApp or email.</li>
        <li>To prepare quotations and follow up on your requirement.</li>
        <li>To protect the website from spam and misuse.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h2>WhatsApp</h2>
      <p>When you choose to contact us on WhatsApp, your conversation is handled by WhatsApp under its own privacy policy.</p>
      <h2>Retention</h2>
      <p>We keep enquiry records only as long as needed to respond and for reasonable business record-keeping, after which they are deleted.</p>
      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete your enquiry information by writing to <a href={`mailto:${s.email}`}>{s.email}</a> or calling {s.phones.primary}.
      </p>
      <h2>Contact</h2>
      <p>
        {s.businessName}, {s.addresses[0]?.line1}, {s.addresses[0]?.city}, {s.addresses[0]?.state} – {s.addresses[0]?.postalCode}.
      </p>
    </LegalPage>
  );
}
