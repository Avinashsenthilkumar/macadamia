import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Reveal } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedFaqs } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Macadamia Plants FAQ — Varieties, Orders, Delivery & Cultivation",
  description: "Answers to common questions about macadamia plants, grafted saplings, bulk orders, delivery, soil, irrigation and plantation planning with Ganesh Nursery.",
  path: "/faq",
});

export default async function FaqPage() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getPublishedFaqs()]);

  return (
    <>
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <PageHero
        eyebrow="FAQ"
        title="Your questions, answered."
        description="Search below, or ask us directly on WhatsApp — we're happy to help."
        image="/images/gallery/rootstock-roots.webp"
        imageAlt="A grower holding healthy plant roots"
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      />
      <section className="py-20 sm:py-28">
        <div className="container-x max-w-4xl">
          {faqs.length ? (
            <FaqAccordion faqs={faqs} searchable grouped />
          ) : (
            <Reveal className="rounded-[2rem] bg-cream p-12 text-center text-ink/70">Questions and answers will be published soon.</Reveal>
          )}
        </div>
      </section>
      <CtaBand whatsappNumber={settings.whatsappNumber} preset="general" title="Didn't find your answer?" description="Send us your question and our team will reply." />
    </>
  );
}
