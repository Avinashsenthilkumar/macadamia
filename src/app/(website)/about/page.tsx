import Image from "next/image";
import type { Metadata } from "next";
import { HeartHandshake, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { Counter, ImageReveal, Parallax, Reveal, SplitText, Stagger, StaggerItem } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/ui/section-heading";
import { MapEmbed, mapsLink } from "@/components/ui/map-embed";
import { getSiteSettings } from "@/lib/settings";
import { pics } from "@/content/images";
import Link from "next/link";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "About Ganesh Nursery — Nursery Experience Since 1980",
  description:
    "Ganesh Nursery, Thanjavur: an established nursery since 1980 with experience in timber and plantation saplings, seed sourcing from selected mother trees, and customer guidance.",
  path: "/about",
});

const selectionSteps = [
  { img: "/images/gallery/mother-tree-grove.webp", alt: "A tall mature tree in a grove", title: "Selected mother trees", text: "Seed is sourced from selected mother trees as the starting point for healthy planting material." },
  { img: "/images/gallery/nursery-bed-saplings.webp", alt: "Young saplings growing in nursery bags", title: "Nursery cultivation", text: "Saplings are raised in the nursery with attention to vigour, foliage and root health." },
  { img: "/images/gallery/nursery-sapling-inspection.webp", alt: "Team member checking a sapling", title: "Inspection", text: "Plants are checked before they leave the nursery." },
  { img: "/images/gallery/sapling-packing.webp", alt: "Saplings being wrapped for transport", title: "Careful packing", text: "Saplings are wrapped and packed to travel safely." },
  { img: "/images/gallery/sapling-dispatch-truck.webp", alt: "Saplings loaded onto a truck for delivery", title: "Dispatch & delivery", text: "Delivery assistance is arranged where available for your location." },
];

export default async function AboutPage() {
  const s = await getSiteSettings();
  const years = new Date().getFullYear() - s.established;

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A nursery built on patience, since 1980."
        description="Decades of raising saplings have taught us that good plantations begin long before planting day — with the right material and honest guidance."
        image="/images/gallery/nursery-tall-sapling.webp"
        imageAlt="A tall healthy sapling at a plantation site"
        crumbs={[{ name: "About", path: "/about" }]}
      />

      {/* Introduction */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Company introduction" title="Ganesh Nursery, Thanjavur." />
            <Reveal delay={0.15} className="mt-6 space-y-4 text-lg leading-relaxed text-ink/75">
              <p>
                Ganesh Nursery is a nursery business based in Natchathira Nagar, Thanjavur, with a nursery at Gandharvakottai, Pudukkottai. Our company profile
                records our establishment in {s.established}.
              </p>
              <p>
                Over the years we have built experience in timber and plantation sapling supply — sourcing seed, raising nursery plants, guiding customers and
                helping deliver plants to their land. We now share that experience with growers interested in macadamia.
              </p>
            </Reveal>
          </div>
          <div className="relative">
            <ImageReveal className="relative aspect-[5/4] rounded-[2.5rem] shadow-lift">
              <Image src="/images/gallery/macadamia-sapling-visit.webp" alt="Holding a macadamia sapling at a shade-net nursery" fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover" />
            </ImageReveal>
            <Parallax offset={40} className="absolute -bottom-8 -left-4 rounded-3xl bg-forest px-7 py-6 text-ivory shadow-lift sm:-left-8">
              <p className="font-display text-5xl leading-none"><Counter to={years} suffix="+" /></p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-sage">Years of nursery experience</p>
            </Parallax>
          </div>
        </div>
      </section>

      {/* The person behind it */}
      <section className="relative overflow-hidden bg-[#0c1a13] py-24 text-ivory sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <ImageReveal className="relative aspect-[3/4] w-full max-w-md shadow-2xl">
              <Image src="/images/team/ganesh-nursery-person.webp" alt="The person behind Ganesh Nursery" fill sizes="(min-width:1024px) 36vw, 90vw" className="object-cover" />
            </ImageReveal>
            <span aria-hidden className="absolute -bottom-5 -right-2 hidden h-28 w-28 border-b-2 border-r-2 border-nut/60 lg:block" />
          </div>
          <div className="lg:col-span-7 lg:pl-10">
            <Reveal y={12}>
              <span className="eyebrow text-[#c9a46a]">The person behind it</span>
            </Reveal>
            <SplitText as="h2" text="Someone has to think in decades." className="mt-5 max-w-xl font-display text-[2.6rem] leading-[1.05] sm:text-6xl" />
            <Reveal delay={0.2}>
              <blockquote className="mt-8 max-w-2xl border-l-2 border-[#c9a46a] pl-6 font-display text-xl italic leading-relaxed text-ivory/90 sm:text-2xl">
                “A nursery can sell you a plant in an afternoon. Macadamia asks you to care about what that plant becomes decades from now, long after the
                sale is done. That is the part I take seriously.”
              </blockquote>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-xl leading-relaxed text-ivory/70">
                Ganesh Nursery has been putting plants into Tamil Nadu soil since {s.established}. Our macadamia work is what happens when that habit is pointed at
                a tree that rewards patience.
              </p>
              <Link href="/contact" className={buttonClasses({ variant: "outline-light", className: "mt-10 rounded-none px-7 tracking-[0.18em] uppercase text-sm" })}>
                Talk to us <ArrowSlide />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="grain relative overflow-hidden bg-deep py-24 text-ivory sm:py-32">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow="Our journey" title={`From ${s.established} to today.`} />
          <ol className="relative mt-16 grid gap-6 md:grid-cols-3">
            <span aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-sage/0 via-sage/60 to-sage/0 md:block" />
            {[
              { year: String(s.established), title: "Established", text: "Ganesh Nursery begins its nursery work in Thanjavur.", pic: pics.motherTree },
              { year: "Decades", title: "Timber & plantation saplings", text: "Experience grows in raising and supplying timber and plantation saplings, with bulk supply and delivery support.", pic: pics.truck },
              { year: "Today", title: "Exploring macadamia", text: "We help growers learn about macadamia, its requirements and how to plan a plantation.", pic: pics.saplingNursery },
            ].map((m, i) => (
              <Reveal key={m.title} delay={i * 0.15} className="group relative">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-sage font-display text-deep ring-8 ring-deep">{i + 1}</span>
                <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-3xl">
                  <Image src={m.pic.src} alt={m.pic.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                </div>
                <p className="mt-6 font-display text-3xl text-sage">{m.year}</p>
                <h3 className="mt-2 font-display text-2xl">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-ivory/70">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Plant selection process */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Nursery experience" title="Our plant selection process." description="Photographs from Ganesh Nursery's nursery operations." />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {selectionSteps.map((step, i) => (
              <StaggerItem key={step.title}>
                <figure className="group h-full overflow-hidden rounded-3xl bg-white shadow-soft">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={step.img} alt={step.alt} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 font-display text-forest">{i + 1}</span>
                  </div>
                  <figcaption className="p-5">
                    <h3 className="font-display text-xl text-forest">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">{step.text}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Quality, support, commitment */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="container-x">
          <Stagger className="grid gap-6 lg:grid-cols-3">
            {[
              { Icon: ShieldCheck, title: "Our approach to plant quality", text: "We focus on healthy, vigorous plants and tell you clearly what we can and cannot confirm about the material you are buying.", pic: pics.inspection },
              { Icon: Sprout, title: "Plantation support", text: "We help you think through site, water, layout and planting so you can make informed decisions with your local experts.", pic: pics.pondPlanting },
              { Icon: HeartHandshake, title: "Customer commitment", text: "No inflated promises. We do not guarantee yields or returns — we offer honest information and responsive support.", pic: pics.saplingHandover },
            ].map(({ Icon, title, text, pic }) => (
              <StaggerItem key={title}>
                <div className="group h-full overflow-hidden rounded-[2rem] bg-ivory shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={pic.src} alt={pic.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  </div>
                  <div className="p-9">
                  <Icon className="h-9 w-9 text-leaf transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-8deg]" />
                  <h3 className="mt-6 font-display text-2xl text-forest">{title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/70">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Our location" title="Visit us in Thanjavur & Pudukkottai." />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {s.addresses.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.15} className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
                <div className="h-72">
                  <MapEmbed query={a.mapsQuery} title={`Map of ${a.label}`} className="h-full w-full border-0" />
                </div>
                <div className="flex items-start justify-between gap-4 p-7">
                  <p className="flex gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-leaf" />
                    <span>
                      <strong className="block font-display text-xl text-forest">{a.label}</strong>
                      <span className="text-ink/70">{[a.line1, a.line2, a.city].filter(Boolean).join(", ")}, {a.state} – {a.postalCode}</span>
                    </span>
                  </p>
                  <a href={mapsLink(a.mapsQuery)} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-semibold text-leaf underline underline-offset-4">
                    Directions
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand whatsappNumber={s.whatsappNumber} title="Let's talk about your plantation." />
    </>
  );
}
