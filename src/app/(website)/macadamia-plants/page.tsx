import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { ProductCard } from "@/components/products/product-card";
import { ProductCatalogue } from "@/components/products/product-catalogue";
import { Reveal } from "@/components/motion/primitives";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getPublishedProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Macadamia Plants & Saplings for Sale in India",
  description:
    "Explore macadamia nut plants and saplings from Ganesh Nursery, Thanjavur. Check availability, plant details and request a quotation for individual or bulk orders.",
  path: "/macadamia-plants",
});

export default async function MacadamiaPlantsPage() {
  const [settings, products] = await Promise.all([getSiteSettings(), getPublishedProducts()]);

  return (
    <>
      <PageHero
        eyebrow="Macadamia Plants"
        title="Macadamia saplings, raised with care."
        description="Browse our macadamia planting material. Specifications shown are those confirmed by our nursery team — ask us for anything you don't see."
        image="/images/gallery/macadamia-sapling-nursery.webp"
        imageAlt="Macadamia sapling growing in a black grow bag under shade net"
        crumbs={[{ name: "Macadamia Plants", path: "/macadamia-plants" }]}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="mb-12 flex gap-4 rounded-3xl border border-nut/20 bg-cream/70 p-5 text-sm leading-relaxed text-ink/75 sm:p-6">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-nut" />
            <p>
              Varieties, plant age, height and pricing change with nursery stock. Where a detail isn&apos;t listed, it hasn&apos;t been confirmed yet —
              please enquire and our team will share current information.
            </p>
          </Reveal>

          {products.length ? (
            <ProductCatalogue
              items={products.map((p) => ({
                id: p.id,
                availability: p.availability,
                propagation: p.propagation,
                node: <ProductCard product={p} showPrices={settings.showPrices} whatsappNumber={settings.whatsappNumber} />,
              }))}
            />
          ) : (
            <div className="grid gap-12 lg:grid-cols-2">
              <Reveal>
                <h2 className="font-display text-4xl text-forest">General macadamia plant enquiry</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/70">
                  Our catalogue is being updated. Share your requirement and we&apos;ll tell you what planting material is currently available.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-10">
                <EnquiryForm whatsappNumber={settings.whatsappNumber} defaultType="INDIVIDUAL_PURCHASE" source="catalogue" compact />
              </Reveal>
            </div>
          )}
        </div>
      </section>

      <CtaBand whatsappNumber={settings.whatsappNumber} preset="bulk" title="Need plants in bulk?" description="Planning a larger plantation? Send us your land area and plant count for a bulk quotation." />
    </>
  );
}
