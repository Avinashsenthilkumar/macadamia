import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { SectionNav } from "@/components/content/section-nav";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { GrowingSapling, NutGlyph } from "@/components/motion/decor";
import { JsonLd } from "@/components/seo/json-ld";
import { cultivationDisclaimer, quickFacts, whyMacadamiaSections } from "@/content/macadamia";
import { getPublishedFaqs } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Why Macadamia? Origin, Tree, Nuts & Plantation Planning",
  description:
    "Learn what macadamia is, where it comes from, how the tree grows, how the nuts are used and what to consider before planning a macadamia plantation in India.",
  path: "/why-macadamia",
});

const ill = "Illustrative image";
const images: Record<string, { src: string; alt: string; note?: string }> = {
  "what-is-macadamia": { src: "/images/orchard/macadamia-nuts-on-tree.webp", alt: "Green macadamia nuts in their husks on the tree", note: ill },
  origin: { src: "/images/orchard/macadamia-orchard-rows.webp", alt: "Rows of macadamia trees in an orchard", note: ill },
  tree: { src: "/images/orchard/macadamia-tree-orchard.webp", alt: "A mature, evergreen macadamia tree", note: ill },
  applications: { src: "/images/gallery/macadamia-nuts-board.webp", alt: "Macadamia nuts in shell with shelled kernels on a wooden spoon", note: ill },
  "kernel-shell": { src: "/images/gallery/macadamia-nuts-cracked.webp", alt: "Cracked macadamia shells showing cream kernels", note: ill },
  considerations: { src: "/images/orchard/macadamia-flowers.webp", alt: "Macadamia flower racemes", note: ill },
  planning: { src: "/images/gallery/macadamia-sapling-nursery.webp", alt: "Young macadamia sapling in a grow bag at the nursery" },
};

export default async function WhyMacadamiaPage() {
  const [settings, allFaqs] = await Promise.all([getSiteSettings(), getPublishedFaqs()]);
  const faqs = allFaqs.filter((f) => f.category === "Macadamia basics");
  const navSections = [...whyMacadamiaSections.map((s) => ({ id: s.id, title: s.title })), ...(faqs.length ? [{ id: "faq", title: "Frequently asked questions" }] : [])];

  return (
    <>
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <PageHero
        eyebrow="Why Macadamia?"
        title="Getting to know the queen of nuts."
        description="An honest introduction to macadamia — the tree, the nut and what it takes to grow it well."
        image="/images/orchard/macadamia-flower-racemes.webp"
        imageAlt="Macadamia flowers on the tree (illustrative)"
        crumbs={[{ name: "Why Macadamia?", path: "/why-macadamia" }]}
      />

      {/* Quick facts */}
      <section className="relative -mt-2 py-16">
        <div className="container-x">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {quickFacts.map((f) => (
              <StaggerItem key={f.label} className="group flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <NutGlyph className="h-10 w-10 shrink-0 transition-transform duration-700 group-hover:rotate-180" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf">{f.label}</p>
                  <p className="mt-0.5 font-semibold text-deep">{f.value}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32">
              <SectionNav sections={navSections} />
              <GrowingSapling className="mt-10 h-56 w-auto" />
            </div>
          </aside>
          <div className="space-y-20 lg:col-span-9">
            {whyMacadamiaSections.map((s, i) => (
              <article key={s.id} id={s.id} className="scroll-mt-32">
                <div className={images[s.id] ? "grid items-center gap-10 md:grid-cols-2" : ""}>
                  <div className={images[s.id] && i % 2 ? "md:order-2" : ""}>
                    <Reveal>
                      <p className="font-display text-sm text-nut">{String(i + 1).padStart(2, "0")}</p>
                      <h2 className="mt-2 font-display text-3xl leading-tight text-forest sm:text-4xl">{s.title}</h2>
                    </Reveal>
                    <Reveal delay={0.1} className="mt-5 space-y-4 text-lg leading-relaxed text-ink/75">
                      {s.body.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                      ))}
                    </Reveal>
                  </div>
                  {images[s.id] ? (
                    <figure>
                      <ImageReveal className="relative aspect-[4/3] rounded-[2rem] shadow-lift" direction={i % 2 ? "left" : "right"}>
                        <Image src={images[s.id]!.src} alt={images[s.id]!.alt} fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover" />
                      </ImageReveal>
                      {images[s.id]!.note ? <figcaption className="mt-2 text-xs text-ink/50">{images[s.id]!.note}</figcaption> : null}
                    </figure>
                  ) : null}
                </div>
              </article>
            ))}

            <Reveal className="rounded-3xl border-l-4 border-nut bg-cream p-6 text-ink/80">
              <p className="font-semibold text-deep">Please note</p>
              <p className="mt-1 leading-relaxed">{cultivationDisclaimer}</p>
            </Reveal>

            {faqs.length ? (
              <div id="faq" className="scroll-mt-32">
                <Reveal>
                  <h2 className="mb-8 font-display text-3xl text-forest sm:text-4xl">Frequently asked questions</h2>
                </Reveal>
                <FaqAccordion faqs={faqs} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <CtaBand whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
