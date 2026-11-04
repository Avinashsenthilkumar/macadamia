import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Reveal } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import { getPublishedServices } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Macadamia Plantation Services — Planning, Saplings & Bulk Supply",
  description:
    "Plantation support from Ganesh Nursery: sapling selection, plantation planning guidance, bulk sapling supply and delivery assistance for macadamia growers.",
  path: "/plantation-services",
});

// Sticky offsets for the stacked-card effect (Tailwind needs literal class names)
const stickyTops = ["lg:top-28", "lg:top-32", "lg:top-36", "lg:top-40", "lg:top-44", "lg:top-48", "lg:top-52", "lg:top-56", "lg:top-60", "lg:top-64"];

export default async function PlantationServicesPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublishedServices()]);

  return (
    <>
      <PageHero
        eyebrow="Plantation Services"
        title="Support from planning to planting."
        description="Practical help for growers exploring macadamia. Service availability is confirmed by our team for each enquiry."
        image="/images/orchard/orchard-young-tree.webp"
        imageAlt="A young macadamia tree in a planted orchard (illustrative)"
        crumbs={[{ name: "Plantation Services", path: "/plantation-services" }]}
      />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="What we offer" title="Services for macadamia growers." description="Choose what you need — we'll tell you clearly what we can provide for your location." />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-8">
            {services.length === 0 ? (
              <Reveal className="rounded-[2rem] bg-cream p-10 text-ink/70">Our service list is being updated. Please contact us to discuss your requirements.</Reveal>
            ) : null}
            {services.map((s, i) => (
              <div key={s.id} className={cn("lg:sticky", stickyTops[i % stickyTops.length])}>
                <Reveal className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-lift ring-1 ring-forest/5 sm:p-10">
                  <span aria-hidden className="absolute -right-4 -top-10 font-display text-[9rem] leading-none text-forest/[0.04] transition-transform duration-700 group-hover:-translate-x-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex flex-col gap-6 sm:flex-row">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-forest text-ivory transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-nut">
                      <Icon name={s.icon} className="h-7 w-7" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-2xl text-forest sm:text-3xl">{s.title}</h2>
                        {s.isAvailable ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-bold text-nut">
                            <Clock className="h-3.5 w-3.5" /> Availability to be confirmed
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-lg font-semibold text-leaf">{s.summary}</p>
                      <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/70">{s.description}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-28 bg-cream py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Service enquiry" title="Tell us what you need." description="Share your location and land details. We'll confirm which services we can provide and how we can help." />
          </div>
          <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-10 lg:col-span-3">
            <EnquiryForm
              whatsappNumber={settings.whatsappNumber}
              defaultType="PLANTATION_CONSULTATION"
              source="services"
              serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
