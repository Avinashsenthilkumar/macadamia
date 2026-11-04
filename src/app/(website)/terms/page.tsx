import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { cultivationDisclaimer } from "@/content/macadamia";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms of use for the Ganesh Nursery website, including the agricultural information disclaimer.",
  path: "/terms",
});

export default async function TermsPage() {
  const s = await getSiteSettings();
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="November 2026">
      <p>By using this website you agree to these terms. This is a general template — please have it reviewed for your business before publishing.</p>
      <h2>Information on this website</h2>
      <p>
        Educational content about macadamia is general information drawn from published references. It is not professional agricultural, financial or
        legal advice and is not validated for any specific location.
      </p>
      <blockquote>{cultivationDisclaimer}</blockquote>
      <h2>No guarantees of yield or returns</h2>
      <p>
        {s.businessName} does not guarantee crop establishment, yields, prices, market demand or financial returns. Results depend on many factors outside our
        control, including climate, soil, water, management and market conditions.
      </p>
      <h2>Products, prices and availability</h2>
      <p>
        Plant specifications, availability and prices shown on the website may change and are confirmed only in a written quotation from our team. An
        enquiry submitted through the website is not an order.
      </p>
      <h2>Photographs</h2>
      <p>Company photographs show our nursery operations. Images marked as illustrative are reference images and do not depict our own farm or customers.</p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${s.email}`}>{s.email}</a>.
      </p>
    </LegalPage>
  );
}
