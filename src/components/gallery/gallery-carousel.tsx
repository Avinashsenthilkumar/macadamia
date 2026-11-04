"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { galleryCategoryLabels, type GalleryCategoryKey } from "@/lib/labels";
import { cn } from "@/lib/utils";

type Img = { id: string; url: string; alt: string; caption: string | null; category: GalleryCategoryKey; isCompanyPhoto: boolean };

const AUTOPLAY_MS = 5000;

/** Full-width showcase carousel: autoplay with progress, swipe/drag, arrows, keyboard and thumbnails */
export function GalleryCarousel({ images }: { images: Img[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const thumbs = useRef<HTMLDivElement>(null);
  const n = images.length;

  const go = useCallback((d: number) => setState(([i]) => [(i + d + n) % n, d]), [n]);
  const jump = (i: number) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  useEffect(() => {
    if (!playing || hover || n < 2) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, playing, hover, go, n]);

  // Keep the active thumbnail in view
  useEffect(() => {
    const el = thumbs.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index]);

  if (!n) return null;
  const img = images[index]!;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  return (
    <div
      className="select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photo gallery"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-deep shadow-lift sm:aspect-[16/9] lg:aspect-[16/8]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={img.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d >= 0 ? "100%" : "-100%", opacity: 0.4, scale: 1.05 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (d: number) => ({ x: d >= 0 ? "-30%" : "30%", opacity: 0, scale: 0.95 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <motion.div className="absolute inset-0" initial={{ scale: 1 }} animate={{ scale: 1.08 }} transition={{ duration: AUTOPLAY_MS / 1000 + 1, ease: "linear" }}>
              <Image src={img.url} alt={img.alt} fill priority={index === 0} sizes="(min-width:1280px) 1200px, 100vw" className="pointer-events-none object-cover" draggable={false} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-ivory sm:p-10" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={img.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">
                {galleryCategoryLabels[img.category]}
                {!img.isCompanyPhoto ? <span className="ml-2 rounded-full bg-black/40 px-2 py-0.5 normal-case tracking-normal text-ivory/80">Illustrative</span> : null}
              </p>
              <p className="mt-2 max-w-2xl font-display text-2xl sm:text-4xl">{img.caption ?? img.alt}</p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-3 font-display text-sm text-ivory/60">
            {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </div>

        {/* Controls */}
        <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slideshow" : "Play slideshow"} className="grid h-11 w-11 place-items-center rounded-full bg-black/35 text-ivory backdrop-blur transition hover:bg-black/55">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-forest shadow-lift transition hover:scale-110 sm:left-6">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-forest shadow-lift transition hover:scale-110 sm:right-6">
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Autoplay progress */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
          {playing && !hover ? (
            <motion.div key={`p-${index}`} className="h-full origin-left bg-sage" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }} />
          ) : null}
        </div>
      </div>

      {/* Thumbnails */}
      <div ref={thumbs} className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {images.map((im, i) => (
          <button
            key={im.id}
            type="button"
            onClick={() => jump(i)}
            aria-label={`Show photo ${i + 1}: ${im.alt}`}
            aria-current={i === index}
            className={cn(
              "relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl transition-all duration-500 sm:h-24 sm:w-36",
              i === index ? "ring-4 ring-forest ring-offset-2 ring-offset-ivory" : "opacity-55 hover:opacity-100",
            )}
          >
            <Image src={im.url} alt="" fill sizes="144px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
