"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { galleryCategoryLabels, type GalleryCategoryKey } from "@/lib/labels";
import { cn } from "@/lib/utils";

type Img = { id: string; url: string; alt: string; caption: string | null; category: GalleryCategoryKey; isCompanyPhoto: boolean };

const ratios = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[5/6]"];

export function GalleryGrid({ images }: { images: Img[] }) {
  const [cat, setCat] = useState<GalleryCategoryKey | "ALL">("ALL");
  const [index, setIndex] = useState<number | null>(null);

  const cats = useMemo(() => {
    const present = new Set(images.map((i) => i.category));
    return (Object.keys(galleryCategoryLabels) as GalleryCategoryKey[]).filter((c) => present.has(c));
  }, [images]);

  const visible = useMemo(() => (cat === "ALL" ? images : images.filter((i) => i.category === cat)), [images, cat]);
  const current = index !== null ? visible[index] : null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + visible.length) % visible.length)), [visible.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  return (
    <div>
      <div role="tablist" aria-label="Gallery categories" className="mb-10 flex flex-wrap gap-2">
        {(["ALL", ...cats] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn("relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors", cat === c ? "text-ivory" : "text-forest hover:bg-forest/5")}
          >
            {cat === c ? <motion.span layoutId="gallery-pill" className="absolute inset-0 -z-10 rounded-full bg-forest" transition={{ type: "spring", stiffness: 380, damping: 30 }} /> : null}
            {c === "ALL" ? "All" : galleryCategoryLabels[c]}
          </button>
        ))}
      </div>

      <motion.div layout className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {visible.map((img, i) => (
            <motion.figure
              key={img.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] bg-cream shadow-soft"
            >
              <button type="button" onClick={() => setIndex(i)} className="block w-full text-left" aria-label={`Open image: ${img.alt}`}>
                <motion.div layoutId={`img-${img.id}`} className={cn("relative w-full", ratios[i % ratios.length])}>
                  <Image src={img.url} alt={img.alt} fill loading="lazy" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                </motion.div>
                <span className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute right-4 top-4 grid h-10 w-10 scale-50 place-items-center rounded-full bg-ivory/90 text-forest opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-sm text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sage">{galleryCategoryLabels[img.category]}</span>
                  {img.caption ?? img.alt}
                </figcaption>
              </button>
              {!img.isCompanyPhoto ? (
                <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-semibold text-white">Illustrative reference image</span>
              ) : null}
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {current ? (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-deep/95 p-4 backdrop-blur-md sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
          >
            <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-ivory transition hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
            {visible.length > 1 ? (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-ivory transition hover:bg-white/20 sm:left-6">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image" className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-ivory transition hover:bg-white/20 sm:right-6">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}
            <figure className="relative flex max-h-full w-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <motion.div layoutId={`img-${current.id}`} className="relative h-[70vh] w-full overflow-hidden rounded-3xl">
                <Image src={current.url} alt={current.alt} fill sizes="90vw" className="object-contain" />
              </motion.div>
              <motion.figcaption initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 text-center text-ivory/85">
                {current.caption ?? current.alt}
                {!current.isCompanyPhoto ? <span className="ml-2 text-xs text-ivory/50">(illustrative reference image)</span> : null}
                <span className="mt-1 block text-xs text-ivory/40">
                  {index! + 1} / {visible.length}
                </span>
              </motion.figcaption>
            </figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
