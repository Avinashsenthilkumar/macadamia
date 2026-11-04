import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/primitives";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} crumbs={[{ name: title, path }]} />
      <section className="py-20">
        <div className="container-x">
          <Reveal className="prose-gn mx-auto max-w-3xl">
            <p className="text-sm text-ink/55">Last updated: {updated}</p>
            {children}
          </Reveal>
        </div>
      </section>
    </>
  );
}
