import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { MapEmbed, mapsLink } from "@/components/ui/map-embed";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { buttonClasses } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/settings";
import Image from "next/image";
import { pics } from "@/content/images";
import { pageMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Contact Ganesh Nursery — Macadamia Plant Enquiries, Thanjavur",
  description: "Contact Ganesh Nursery in Thanjavur for macadamia plant enquiries, bulk sapling quotations and plantation consultation. Call, WhatsApp or send an enquiry.",
  path: "/contact",
});

export default async function ContactPage() {
  const s = await getSiteSettings();
  const phones = [s.phones.primary, s.phones.secondary, s.phones.additional].filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's grow something together."
        description="Call, WhatsApp or send an enquiry — our team will get back to you."
        image="/images/gallery/macadamia-sapling-visit.webp"
        imageAlt="Holding a macadamia sapling at a nursery"
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem className="group rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <Phone className="h-7 w-7 text-leaf transition-transform duration-500 group-hover:rotate-12" />
              <h2 className="mt-5 font-display text-xl text-forest">Call us</h2>
              <ul className="mt-2 space-y-1">
                {phones.map((p) => (
                  <li key={p}>
                    <a href={telHref(p)} className="font-semibold text-deep hover:text-leaf">{p}</a>
                  </li>
                ))}
              </ul>
            </StaggerItem>
            <StaggerItem className="group rounded-3xl bg-[#1f9d55] p-7 text-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <WhatsAppIcon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
              <h2 className="mt-5 font-display text-xl">WhatsApp</h2>
              <a href={whatsappLink(s.whatsappNumber, whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold underline underline-offset-4">
                Start a chat
              </a>
            </StaggerItem>
            <StaggerItem className="group rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <Mail className="h-7 w-7 text-leaf transition-transform duration-500 group-hover:-rotate-12" />
              <h2 className="mt-5 font-display text-xl text-forest">Email</h2>
              <a href={`mailto:${s.email}`} className="mt-2 inline-block break-all font-semibold text-deep hover:text-leaf">{s.email}</a>
            </StaggerItem>
            <StaggerItem className="group rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
              <Clock className="h-7 w-7 text-leaf transition-transform duration-500 group-hover:rotate-45" />
              <h2 className="mt-5 font-display text-xl text-forest">Business hours</h2>
              <ul className="mt-2 space-y-1 text-sm text-ink/75">
                {s.businessHours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-28 bg-cream py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <span className="eyebrow">Enquiry form</span>
            <h2 className="mt-4 font-display text-4xl leading-tight text-forest sm:text-5xl">Tell us about your requirement.</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              The more we know about your land and plans, the more useful our reply. Fields marked <span className="text-nut">*</span> are required.
            </p>
            <ul className="mt-8 space-y-3 text-ink/75">
              {["Individual plant purchases", "Bulk sapling enquiries", "Plantation consultation", "Agricultural guidance"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-leaf" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <ImageReveal className="relative aspect-[3/4] rounded-3xl shadow-lift">
                <Image src={pics.saplingHandover.src} alt={pics.saplingHandover.alt} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
              </ImageReveal>
              <div className="grid gap-4">
                <ImageReveal className="relative aspect-square rounded-3xl shadow-lift" direction="left">
                  <Image src={pics.nurseryBeds.src} alt={pics.nurseryBeds.alt} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
                </ImageReveal>
                <ImageReveal className="relative aspect-square rounded-3xl shadow-lift" direction="right">
                  <Image src={pics.truck.src} alt={pics.truck.alt} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
                </ImageReveal>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 shadow-lift sm:p-10 lg:col-span-3">
            <EnquiryForm whatsappNumber={s.whatsappNumber} source="contact" />
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          {s.addresses.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.12} className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
              <div className="h-80">
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
                <a href={mapsLink(a.mapsQuery)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "secondary", size: "sm", className: "shrink-0" })}>
                  Directions
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
