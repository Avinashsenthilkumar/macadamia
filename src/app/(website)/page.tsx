import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HeartHandshake, Leaf, Package, Sprout, Truck, Users } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { GrowthScroll } from "@/components/home/growth-scroll";
import { ProcessSteps } from "@/components/home/process-steps";
import { GalleryStrip } from "@/components/home/gallery-strip";
import { Testimonials } from "@/components/home/testimonials";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { ProductCard } from "@/components/products/product-card";
import { Counter, ImageReveal, Magnetic, Marquee, Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { FloatingNature, KenBurnsBackdrop } from "@/components/motion/decor";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { cultivationHighlights } from "@/content/macadamia";
import { pics } from "@/content/images";
import { getGalleryImages, getPublishedFaqs, getPublishedProducts, getPublishedTestimonials } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { defaultSiteSettings } from "@/config/site";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: defaultSiteSettings.seo.defaultTitle,
  description: defaultSiteSettings.seo.defaultDescription,
  path: "/",
});

const whyChoose = [
  { Icon: Leaf, pic: pics.nurseryBeds, title: "Nursery experience", text: "A nursery business established in 1980, raising timber and plantation saplings for decades." },
  { Icon: Sprout, pic: pics.motherTree, title: "Plant selection expertise", text: "Seed sourcing from selected mother trees and careful raising of planting material." },
  { Icon: Users, pic: pics.inspection, title: "Customer guidance", text: "Straight answers to your questions before you buy — and after you plant." },
  { Icon: HeartHandshake, pic: pics.pondPlanting, title: "Plantation support", text: "Practical support as you plan and establish your plantation." },
  { Icon: Package, pic: pics.truck, title: "Bulk enquiry support", text: "Requirements for larger plantations handled by our team directly." },
  { Icon: Truck, pic: pics.crates, title: "Delivery assistance", text: "Help arranging delivery of plants, where available for your location." },
];

export default async function HomePage() {
  const [settings, featured, gallery, testimonials, faqs] = await Promise.all([
    getSiteSettings(),
    getPublishedProducts({ take: 3 }),
    getGalleryImages(10),
    getPublishedTestimonials(),
    getPublishedFaqs(5),
  ]);
  const years = new Date().getFullYear() - settings.established;

  return (
    <>
      <Hero heroImage={settings.heroImage} heroImageAlt={settings.heroImageAlt} established={settings.established} />

      <GrowthScroll />

      <div className="border-y border-white/10 bg-forest py-5 font-display text-xl text-ivory/90 sm:text-2xl">
        <Marquee items={["Macadamia Saplings", "Plantation Guidance", "Bulk Sapling Enquiries", `Nursery Experience Since ${settings.established}`, "Thanjavur · Pudukkottai", "Customer Support"]} />
      </div>

      {/* About introduction */}
      <section id="about" className="relative overflow-hidden py-24 sm:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <ImageReveal className="relative aspect-[4/5] w-full max-w-md rounded-[2.5rem] shadow-lift" direction="up">
              <Image src="/images/gallery/nursery-sapling-inspection.webp" alt="A nursery team member inspecting a young sapling" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </ImageReveal>
            <Parallax offset={50} className="absolute -bottom-10 right-0 w-48 sm:right-8 sm:w-60">
              <ImageReveal className="relative aspect-square rounded-[2rem] border-8 border-ivory shadow-lift" direction="left">
                <Image src="/images/gallery/sapling-dispatch-crates.webp" alt="Saplings packed in crates for dispatch" fill sizes="240px" className="object-cover" />
              </ImageReveal>
            </Parallax>
            <Reveal delay={0.5} className="absolute -left-2 top-10 rounded-3xl bg-nut px-5 py-4 text-ivory shadow-lift sm:-left-6">
              <p className="font-display text-4xl leading-none"><Counter to={settings.established} duration={2.4} /></p>
              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ivory/80">Established</p>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="About Ganesh Nursery" title="Rooted in decades of nursery experience." />
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg leading-relaxed text-ink/75">
                Ganesh Nursery is an established nursery business from Thanjavur, Tamil Nadu. Since {settings.established}, our work has centred on raising quality
                timber and plantation saplings — from seed sourcing and plant selection to nursery cultivation, customer guidance and delivery.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                Today we bring that experience to growers exploring macadamia, helping them understand the crop, choose planting material and plan with care.
              </p>
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-3 gap-4 border-t border-forest/10 pt-8">
              <StaggerItem>
                <p className="font-display text-4xl text-forest sm:text-5xl"><Counter to={years} suffix="+" /></p>
                <p className="mt-1 text-sm text-ink/60">Years in the nursery business</p>
              </StaggerItem>
              <StaggerItem>
                <p className="font-display text-4xl text-forest sm:text-5xl"><Counter to={settings.addresses.length} /></p>
                <p className="mt-1 text-sm text-ink/60">Locations in Tamil Nadu</p>
              </StaggerItem>
              <StaggerItem>
                <p className="font-display text-4xl text-forest sm:text-5xl">Seed</p>
                <p className="mt-1 text-sm text-ink/60">Sourced from selected mother trees</p>
              </StaggerItem>
            </Stagger>
            <Reveal delay={0.2}>
              <Link href="/about" className={buttonClasses({ variant: "secondary", className: "mt-10" })}>
                Our story <ArrowSlide />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why macadamia */}
      <section className="relative overflow-hidden bg-cream py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Why Macadamia?" title="The buttery nut with a long-term horizon." description="Macadamia is an evergreen nut tree native to the subtropical rainforests of eastern Australia, valued for its creamy kernels and long productive life." />
            <Reveal delay={0.25}>
              <Link href="/why-macadamia" className={buttonClasses({ className: "mt-8" })}>
                Learn about macadamia <ArrowSlide />
              </Link>
            </Reveal>
          </div>
          <div className="relative lg:col-span-3">
            <ImageReveal className="relative mx-auto aspect-[3/4] w-full max-w-xs rounded-[2rem] shadow-lift">
              <Image src="/images/orchard/macadamia-flowers.webp" alt="Macadamia flower racemes on the tree (illustrative)" fill sizes="(min-width:1024px) 25vw, 80vw" className="object-cover" />
            </ImageReveal>
            <Parallax offset={30} className="absolute -bottom-6 -left-4 w-32 sm:w-40">
              <ImageReveal className="relative aspect-square rounded-3xl border-[6px] border-cream shadow-lift" direction="left">
                <Image src="/images/orchard/macadamia-nuts-on-tree.webp" alt="Green macadamia nuts on the tree (illustrative)" fill sizes="160px" className="object-cover" />
              </ImageReveal>
            </Parallax>
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {[
              ["Introduction", "An evergreen tree of the Proteaceae family, grown for its edible seed."],
              ["Nut applications", "Snacks, confectionery, bakery, spreads, and oil for cooking and personal care."],
              ["Tree characteristics", "Glossy leaves, long hanging flower racemes and brittle wood that needs wind shelter."],
              ["Planting material matters", "Commercial orchards rely mainly on grafted trees of known varieties."],
            ].map(([t, d]) => (
              <StaggerItem key={t} className="group rounded-3xl bg-ivory p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <h3 className="font-display text-xl text-forest">{t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Macadamia Plants" title="Planting material for your orchard." description="Specifications are published only once confirmed by our nursery team. Ask us for current availability." />
            <Reveal delay={0.2}>
              <Link href="/macadamia-plants" className={buttonClasses({ variant: "secondary" })}>
                View all plants <ArrowSlide />
              </Link>
            </Reveal>
          </div>
          {featured.length ? (
            <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} showPrices={settings.showPrices} whatsappNumber={settings.whatsappNumber} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Reveal className="mt-14 flex flex-col items-start gap-6 rounded-[2rem] bg-forest p-10 text-ivory sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-3xl">Macadamia plant enquiry</h3>
                <p className="mt-2 max-w-xl text-ivory/75">Tell us your requirement and our team will share current availability, plant details and pricing.</p>
              </div>
              <a href={whatsappLink(settings.whatsappNumber, whatsappMessages.plant)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", size: "lg" })}>
                <WhatsAppIcon className="h-5 w-5" /> Enquire on WhatsApp
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {/* Cultivation highlights */}
      <section className="grain relative overflow-hidden bg-forest py-24 text-ivory sm:py-32">
        <FloatingNature tone="dark" />
        <div className="container-x relative">
          <SectionHeading tone="light" align="center" eyebrow="Cultivation Highlights" title="What macadamia needs to thrive." description="General reference points to start your research. Every site is different — always evaluate your own land." />
          <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
            {cultivationHighlights.map((h, i) => (
              <StaggerItem key={h.title} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                <div className={`group relative isolate flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-3xl border border-white/10 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-sage/50 hover:shadow-2xl ${i === 0 ? "min-h-80 lg:p-10" : ""}`}>
                  <Image src={h.image} alt={h.alt} fill sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"} className="-z-10 object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-deep/90 via-deep/45 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ivory/15 text-ivory backdrop-blur-md transition-all duration-500 group-hover:rotate-[-10deg] group-hover:scale-110 group-hover:bg-sage group-hover:text-deep">
                    <Icon name={h.icon} className="h-6 w-6" />
                  </span>
                  <h3 className={`mt-4 font-display drop-shadow ${i === 0 ? "text-4xl" : "text-2xl"}`}>{h.title}</h3>
                  <p className="mt-2 leading-relaxed text-ivory/85 drop-shadow">{h.text}</p>
                  <span aria-hidden className="absolute right-5 top-4 font-display text-5xl text-white/25">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </StaggerItem>
            ))}
            <StaggerItem className="sm:col-span-2">
              <Link href="/cultivation-guide" className="group relative isolate flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-3xl p-7 text-ivory transition-all duration-500 hover:-translate-y-1">
                <Image src="/images/orchard/macadamia-nuts-on-tree.webp" alt="Macadamia nuts on the tree" fill sizes="(min-width:1024px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/85 via-deep/50 to-transparent" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Full guide</span>
                <span className="mt-6 flex items-end justify-between gap-6 font-display text-3xl">
                  <span className="max-w-xs">Read the complete cultivation guide</span>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sage text-deep transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
                </span>
              </Link>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Process */}
      {settings.showPlantationProcess ? (
        <section className="relative bg-deep py-24 text-ivory sm:py-32">
          <div className="container-x grid gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading tone="light" eyebrow="Our Plantation Process" title="From first conversation to first planting." description="A clear, four-step way of working together. The exact services we provide are confirmed with you during your enquiry." />
              <Reveal delay={0.3}>
                <Link href="/plantation-services" className={buttonClasses({ variant: "light", className: "mt-8" })}>
                  Plantation services <ArrowSlide />
                </Link>
              </Reveal>
            </div>
            <ProcessSteps />
          </div>
        </section>
      ) : null}

      {/* Why choose */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Why Choose Ganesh Nursery?" title="Experience you can talk to." />
          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map(({ Icon: I, pic, title, text }) => (
              <StaggerItem key={title}>
                <div className="group relative h-full overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={pic.src} alt={pic.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent" />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-leaf to-nut transition-transform duration-700 group-hover:scale-x-100" />
                  <div className="relative p-7 pt-0">
                    <span className="-mt-7 grid h-14 w-14 place-items-center rounded-2xl bg-forest text-ivory shadow-lift ring-4 ring-white transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-nut">
                      <I className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl text-forest">{title}</h3>
                    <p className="mt-2 leading-relaxed text-ink/70">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <GalleryStrip images={gallery} />

      {testimonials.length ? (
        <section className="bg-cream py-24 sm:py-32">
          <div className="container-x">
            <Reveal>
              <Testimonials items={testimonials} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* FAQ preview */}
      {faqs.length ? (
        <section className="py-24 sm:py-32">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="FAQ" title="Questions growers ask us." description="Quick answers to common questions about macadamia and working with us." />
              <Reveal delay={0.2}>
                <Link href="/faq" className={buttonClasses({ variant: "secondary", className: "mt-8" })}>
                  All questions <ArrowSlide />
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <FaqAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="grain relative isolate overflow-hidden py-28 text-ivory sm:py-40">
        <KenBurnsBackdrop src="/images/orchard/macadamia-orchard-rows.webp" alt="Macadamia orchard (illustrative)" overlayClassName="bg-gradient-to-br from-deep/95 via-forest/80 to-deep/70" />
        <FloatingNature />
        <div className="container-x relative text-center">
          <SectionHeading tone="light" align="center" eyebrow="Start the conversation" title="Planning Your Macadamia Plantation?" description="Share your land details and requirements. Our team will get back to you with guidance and current plant availability." />
          <Reveal delay={0.3} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Link href="/contact#enquiry" className={buttonClasses({ variant: "light", size: "lg" })}>
                Discuss Your Requirements <ArrowSlide />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={whatsappLink(settings.whatsappNumber, whatsappMessages.consultation)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", size: "lg" })}>
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp us
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
