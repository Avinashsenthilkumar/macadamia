import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { ImageReveal, Reveal } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedFaqs } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { pics } from "@/content/images";

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
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32 grid gap-4">
              <ImageReveal className="relative aspect-[4/5] rounded-[2rem] shadow-lift">
                <Image src={pics.flowers.src} alt={pics.flowers.alt} fill sizes="30vw" className="object-cover" />
              </ImageReveal>
              <div className="grid grid-cols-2 gap-4">
                <ImageReveal className="relative aspect-square rounded-3xl shadow-lift" direction="left">
                  <Image src={pics.nutsOnTree.src} alt={pics.nutsOnTree.alt} fill sizes="15vw" className="object-cover" />
                </ImageReveal>
                <ImageReveal className="relative aspect-square rounded-3xl shadow-lift" direction="right">
                  <Image src={pics.saplingNursery.src} alt={pics.saplingNursery.alt} fill sizes="15vw" className="object-cover" />
                </ImageReveal>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8">
            {faqs.length ? (
              <FaqAccordion faqs={faqs} searchable grouped />
            ) : (
              <Reveal className="rounded-[2rem] bg-cream p-12 text-center text-ink/70">Questions and answers will be published soon.</Reveal>
            )}
          </div>
        </div>
      </section>
      <CtaBand whatsappNumber={settings.whatsappNumber} preset="general" title="Didn't find your answer?" description="Send us your question and our team will reply." />
    </>
  );
}
