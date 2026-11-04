"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";

type Img = { id: string; url: string; alt: string; caption: string | null; isCompanyPhoto: boolean };

/**
 * Desktop: a pinned section where photos glide horizontally as you scroll down.
 * Mobile: a native swipeable row (no scroll-jacking on touch devices).
 */
export function GalleryStrip({ images }: { images: Img[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", `-${Math.max(0, images.length * 19 - 88)}%`]);

  if (!images.length) return null;

  const Heading = (
    <div className="max-w-xl">
      <span className="eyebrow">Gallery</span>
      <h2 className="mt-4 font-display text-[2.1rem] leading-[1.08] tracking-tight text-forest sm:text-5xl">Life at the nursery</h2>
      <p className="mt-4 text-lg text-ink/70">From seed beds to dispatch — a look at how our plants are raised and prepared.</p>
      <Link href="/gallery" className={buttonClasses({ variant: "secondary", className: "mt-6" })}>
        View full gallery <ArrowSlide />
      </Link>
    </div>
  );

  return (
    <>
      {/* Mobile / tablet */}
      <section className="py-20 lg:hidden">
        <div className="container-x">{Heading}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
          {images.map((img) => (
            <figure key={img.id} className="relative h-80 w-64 shrink-0 snap-center overflow-hidden rounded-3xl bg-cream">
              <Image src={img.url} alt={img.alt} fill sizes="256px" className="object-cover" />
              {!img.isCompanyPhoto ? <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[0.65rem] text-white">Illustrative</span> : null}
            </figure>
          ))}
        </div>
      </section>

      {/* Desktop scroll-driven */}
      <section ref={ref} className="relative hidden h-[260vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="container-x">{Heading}</div>
          <motion.div style={{ x }} className="mt-12 flex gap-6 pl-[6vw]">
            {images.map((img, i) => (
              <motion.figure
                key={img.id}
                className={`group relative h-[46vh] w-[17vw] min-w-60 shrink-0 overflow-hidden rounded-[2rem] bg-cream shadow-soft ${i % 2 ? "mt-[4vh]" : ""}`}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Image src={img.url} alt={img.alt} fill sizes="20vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-deep/90 to-transparent p-5 pt-12 text-sm text-ivory transition-transform duration-500 group-hover:translate-y-0">
                  {img.caption ?? img.alt}
                </figcaption>
                {!img.isCompanyPhoto ? <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[0.65rem] text-white">Illustrative</span> : null}
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
