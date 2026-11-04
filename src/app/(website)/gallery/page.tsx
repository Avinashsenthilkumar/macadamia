import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Reveal } from "@/components/motion/primitives";
import { getGalleryImages } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Gallery — Nursery, Saplings & Plantation Photos",
  description: "Photographs from Ganesh Nursery: nursery beds, macadamia saplings, plantation work and farm activities.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([getSiteSettings(), getGalleryImages()]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the nursery and the field."
        description="Company photographs are shown as they are. Reference images used for illustration are clearly labelled."
        image="/images/gallery/sapling-dispatch-crates.webp"
        imageAlt="Saplings packed in crates ready for dispatch"
        crumbs={[{ name: "Gallery", path: "/gallery" }]}
      />
      <section className="py-20 sm:py-28">
        <div className="container-x">
          {images.length ? (
            <GalleryGrid images={images} />
          ) : (
            <Reveal className="rounded-[2rem] bg-cream p-12 text-center text-ink/70">Photographs will be added soon.</Reveal>
          )}
        </div>
      </section>
      <CtaBand whatsappNumber={settings.whatsappNumber} title="Want to visit the nursery?" description="Get in touch to arrange a visit or ask about current plant availability." />
    </>
  );
}
