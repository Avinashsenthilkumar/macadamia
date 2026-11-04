import { Reveal, SplitText } from "@/components/motion/primitives";
import { FloatingNature, KenBurnsBackdrop } from "@/components/motion/decor";
import { Breadcrumbs } from "@/components/ui/misc";

export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/gallery/nursery-bed-saplings.webp",
  imageAlt = "Rows of young saplings at Ganesh Nursery",
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  crumbs: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden bg-deep pb-20 pt-40 text-ivory sm:pb-28 sm:pt-48">
      <KenBurnsBackdrop src={image} alt={imageAlt} priority />
      <FloatingNature />
      <div className="container-x relative">
        <Reveal y={10}>
          <Breadcrumbs items={crumbs} tone="light" />
        </Reveal>
        <Reveal y={10} delay={0.1}>
          <span className="eyebrow mt-8 text-sage">{eyebrow}</span>
        </Reveal>
        <SplitText
          as="h1"
          animateOnMount
          delay={0.15}
          text={title}
          className="mt-5 max-w-4xl font-display text-[2.6rem] leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
        />
        {description ? (
          <Reveal delay={0.5}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80 sm:text-xl">{description}</p>
          </Reveal>
        ) : null}
        {children ? <Reveal delay={0.7}>{children}</Reveal> : null}
      </div>
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-10 w-full text-ivory sm:h-16">
        <path d="M0 80V40C240 0 480 0 720 30s480 50 720 10v40z" fill="currentColor" />
      </svg>
    </section>
  );
}
