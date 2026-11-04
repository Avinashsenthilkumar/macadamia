import type { Metadata } from "next";
import { AlertTriangle, BookOpen } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { SectionNav } from "@/components/content/section-nav";
import { PhScaleDiagram, PollinationDiagram, SpacingDiagram, TemperatureDiagram } from "@/components/content/guide-diagrams";
import { Reveal } from "@/components/motion/primitives";
import { Icon } from "@/components/ui/icon";
import Image from "next/image";
import { guideImages, pics } from "@/content/images";
import { cultivationDisclaimer, guideSections, references } from "@/content/macadamia";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Macadamia Cultivation Guide — Climate, Soil, Spacing, Pollination & Harvest",
  description:
    "A practical macadamia cultivation guide: climate, temperature, irrigation, soil and pH, land preparation, grafted vs seed-grown plants, spacing, pollination, pruning, harvest and post-harvest.",
  path: "/cultivation-guide",
});

const diagrams: Record<string, React.ReactNode> = {
  temperature: <TemperatureDiagram />,
  "soil-ph": <PhScaleDiagram />,
  spacing: <SpacingDiagram />,
  pollination: <PollinationDiagram />,
};

export default async function CultivationGuidePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Cultivation Guide"
        title="The macadamia knowledge centre."
        description="Seventeen essentials, from choosing your site to drying your first harvest — written as general guidance you can take to your agricultural adviser."
        image="/images/orchard/macadamia-orchard-rows.webp"
        imageAlt="Rows of macadamia trees in an orchard (illustrative)"
        crumbs={[{ name: "Cultivation Guide", path: "/cultivation-guide" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Reveal className="flex flex-col gap-4 rounded-[2rem] border border-nut/25 bg-cream p-6 sm:flex-row sm:p-8">
            <AlertTriangle className="h-7 w-7 shrink-0 text-nut" />
            <div>
              <p className="font-display text-xl text-deep">Read this first</p>
              <p className="mt-2 leading-relaxed text-ink/80">{cultivationDisclaimer}</p>
              <p className="mt-3 text-sm text-ink/60">
                <strong className="text-deep">General guidance</strong> in this guide comes from published references (listed at the end). It has not been validated
                for specific districts in India. <strong className="text-deep">Locally validated recommendations</strong> should come from your agricultural
                department, a university extension service or an agronomist who has assessed your land.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-6 pr-2">
              <SectionNav sections={guideSections.map((s) => ({ id: s.id, title: s.title }))} title="Guide contents" />
            </div>
          </aside>

          <div className="lg:col-span-9">
            {/* Mobile jump list */}
            <details className="mb-10 rounded-2xl bg-white p-5 shadow-soft lg:hidden">
              <summary className="cursor-pointer font-semibold text-forest">Jump to a section</summary>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {guideSections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-sm text-ink/70 hover:text-forest">
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <div className="space-y-6">
              {guideSections.map((s, i) => (
                <article key={s.id} id={s.id} className="scroll-mt-28">
                  <Reveal className="group overflow-hidden rounded-[2rem] bg-white/70 ring-1 ring-forest/5 transition-colors duration-500 hover:bg-white">
                    <div className="relative h-52 overflow-hidden sm:h-64">
                      <Image src={(guideImages[s.id] ?? pics.orchardRows).src} alt={(guideImages[s.id] ?? pics.orchardRows).alt} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-6 font-display text-6xl leading-none text-ivory/90 sm:left-10">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="p-6 sm:p-10">
                    <header className="flex items-start gap-5">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest text-ivory transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
                        <Icon name={s.icon} className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="font-display text-sm text-nut">{String(i + 1).padStart(2, "0")} / {guideSections.length}</p>
                        <h2 className="font-display text-2xl leading-tight text-forest sm:text-3xl">{s.title}</h2>
                        <p className="mt-1 font-semibold text-leaf">{s.summary}</p>
                      </div>
                    </header>
                    <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-ink/80">
                      {s.paragraphs.map((p) => (
                        <p key={p.slice(0, 30)}>{p}</p>
                      ))}
                    </div>
                    {s.bullets ? (
                      <ul className="mt-5 space-y-2.5">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-ink/80">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {s.table ? (
                      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-forest/10">
                        <table className="w-full min-w-[28rem] text-left text-sm">
                          <caption className="bg-cream/60 px-4 py-2.5 text-left text-xs text-ink/60">{s.table.caption}</caption>
                          <thead className="bg-forest text-ivory">
                            <tr>
                              {s.table.head.map((h) => (
                                <th key={h || "blank"} scope="col" className="px-4 py-3 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-forest/8 bg-white">
                            {s.table.rows.map((row) => (
                              <tr key={row.join("|")} className="transition-colors hover:bg-cream/40">
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-semibold text-deep" : "text-ink/75"}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    {diagrams[s.id] ?? null}
                    {s.callout ? (
                      <p className="mt-6 flex gap-3 rounded-2xl bg-nut/10 p-4 text-sm leading-relaxed text-deep">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-nut" />
                        {s.callout}
                      </p>
                    ) : null}
                    </div>
                  </Reveal>
                </article>
              ))}
            </div>

            <Reveal className="mt-14 rounded-[2rem] bg-deep p-8 text-ivory sm:p-10">
              <h2 className="flex items-center gap-3 font-display text-2xl">
                <BookOpen className="h-6 w-6 text-sage" /> References
              </h2>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-ivory/80">
                {references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline decoration-sage/50 underline-offset-4 hover:text-ivory">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand whatsappNumber={settings.whatsappNumber} title="Want to discuss your land?" description="Share your location, soil and water details — we'll help you think through the next questions to ask." />
    </>
  );
}
