import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { GalleryCarousel } from "@/components/gallery/gallery-carousel";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/ui/section-heading";
import { galleryCategoryLabels, galleryCategories } from "@/lib/labels";
import { getGalleryImages } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Gallery — Nursery, Saplings & Macadamia Photos",
  description: "Photographs from Ganesh Nursery: nursery beds, macadamia saplings, plantation work, dispatch and macadamia trees, flowers and nuts.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([getSiteSettings(), getGalleryImages()]);
  const counts = galleryCategories
    .map((c) => ({ key: c, label: galleryCategoryLabels[c], count: images.filter((i) => i.category === c).length }))
    .filter((c) => c.count > 0);

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

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <Reveal>
            <GalleryCarousel images={images} />
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {counts.map((c) => (
              <StaggerItem key={c.key} className="rounded-3xl bg-white p-5 text-center shadow-soft">
                <p className="font-display text-4xl text-forest"><Counter to={c.count} /></p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/55">{c.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Browse by category" title="Every photograph, in one place." description="Filter by category and tap any photo to open it full screen." />
          <div className="mt-12">
            <GalleryGrid images={images} />
          </div>
        </div>
      </section>

      <CtaBand whatsappNumber={settings.whatsappNumber} title="Want to visit the nursery?" description="Get in touch to arrange a visit or ask about current plant availability." />
    </>
  );
}
