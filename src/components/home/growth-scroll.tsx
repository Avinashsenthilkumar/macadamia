"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Scroll-scrubbed growth sequence. The section is pinned while you scroll:
 * scrolling down plays the macadamia growing (seed → orchard), scrolling up plays it in reverse.
 * Frames are pre-extracted WebP images drawn to a canvas, which scrubs far more smoothly
 * than seeking a <video> element.
 */

const SETS = {
  desktop: { dir: "/growth/d", count: 120 },
  mobile: { dir: "/growth/m", count: 60 },
} as const;

const stages = [
  { at: 0, title: "Seed & sprout", text: "Life starts below the soil. A healthy start depends on good planting material and well-drained ground." },
  { at: 0.2, title: "Young sapling", text: "The first years build the frame of the tree — consistent water, shelter from wind and formative pruning matter most." },
  { at: 0.4, title: "Flowering", text: "Long hanging racemes of cream flowers. Cross-pollination between compatible varieties improves nut set." },
  { at: 0.7, title: "Nut set", text: "Green husks form and fill. Moisture during nut development is especially important." },
  { at: 0.85, title: "Mature orchard", text: "A long-lived evergreen tree. Results depend on climate, soil, water, planting material and care." },
];

const pad = (n: number) => String(n).padStart(3, "0");

export function GrowthScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState<number>(SETS.desktop.count);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const progress = reduce ? scrollYProgress : smooth;
  const railScale = useTransform(progress, [0, 1], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;
    // Use the requested frame, or the nearest one that has finished loading
    let img = frames[index];
    for (let d = 1; (!img || !img.complete || !img.naturalWidth) && d < frames.length; d++) {
      img = frames[index - d] ?? frames[index + d];
      if (img && img.complete && img.naturalWidth) break;
    }
    if (!img || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }, []);

  // Size the canvas to the screen (capped pixel ratio for performance)
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // Load the first frame immediately, the rest once the section is near the viewport
  useEffect(() => {
    const set = window.innerWidth < 768 ? SETS.mobile : SETS.desktop;
    setTotal(set.count);
    const frames: HTMLImageElement[] = Array.from({ length: set.count }, () => new Image());
    framesRef.current = frames;
    let count = 0;
    const load = (i: number) => {
      const img = frames[i]!;
      if (img.src) return;
      img.decoding = "async";
      img.onload = () => {
        count += 1;
        setLoaded(count);
        if (i === currentRef.current || i === 0) draw(currentRef.current);
      };
      img.src = `${set.dir}/f${pad(i + 1)}.webp`;
    };
    load(0);

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // Load key frames first so scrubbing is usable quickly, then fill the gaps
        for (const step of [8, 4, 2, 1]) for (let i = 0; i < set.count; i += step) load(i);
      },
      { rootMargin: "100% 0px" },
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [draw]);

  useMotionValueEvent(progress, "change", (p) => {
    const frames = framesRef.current.length || total;
    const index = Math.min(frames - 1, Math.max(0, Math.round(p * (frames - 1))));
    if (index !== currentRef.current) {
      currentRef.current = index;
      requestAnimationFrame(() => draw(index));
    }
    let s = 0;
    for (let i = 0; i < stages.length; i++) if (p >= stages[i]!.at - 0.001) s = i;
    setStage((prev) => (prev === s ? prev : s));
  });

  const current = stages[stage]!;
  const pct = Math.round((loaded / total) * 100);

  return (
    <section ref={sectionRef} aria-label="Macadamia growth journey" className="relative h-[420vh] bg-deep md:h-[520vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-deep/50" />

        <div className="container-x relative flex h-full flex-col justify-between pb-14 pt-28 text-ivory sm:pb-20">
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="eyebrow text-sage">The growth journey</span>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] sm:text-6xl">From seed to orchard.</h2>
            </div>
            {pct < 100 ? (
              <span className="mt-2 hidden rounded-full bg-black/30 px-3 py-1 text-xs text-ivory/70 backdrop-blur sm:inline">Loading {pct}%</span>
            ) : null}
          </div>

          <div className="flex items-end justify-between gap-8">
            <div className="max-w-lg" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-lg text-sage">
                    {String(stage + 1).padStart(2, "0")} <span className="text-ivory/40">/ {String(stages.length).padStart(2, "0")}</span>
                  </p>
                  <h3 className="mt-2 font-display text-4xl sm:text-6xl">{current.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-ivory/80 sm:text-lg">{current.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage rail */}
            <ol className="relative hidden shrink-0 space-y-5 py-1 pl-6 md:block">
              <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-ivory/20" />
              <motion.span aria-hidden className="absolute left-0 top-0 h-full w-px origin-top bg-sage" style={{ scaleY: railScale }} />
              {stages.map((s, i) => (
                <li key={s.title} className={`relative text-sm font-semibold transition-all duration-500 ${i === stage ? "translate-x-1 text-ivory" : i < stage ? "text-ivory/60" : "text-ivory/35"}`}>
                  <span className={`absolute -left-[1.62rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-all duration-500 ${i <= stage ? "scale-110 bg-sage" : "bg-ivory/30"}`} />
                  {s.title}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="absolute inset-x-5 bottom-6 h-1 overflow-hidden rounded-full bg-ivory/15 md:hidden">
          <motion.div className="h-full origin-left bg-sage" style={{ scaleX: railScale }} />
        </div>

        <motion.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-ivory/70 md:flex">
          Scroll to grow
          <span className="flex h-10 w-6 justify-center rounded-full border border-ivory/40 pt-2">
            <span className="h-2 w-1 animate-scroll-dot rounded-full bg-ivory" />
          </span>
        </motion.div>
        <span className="absolute bottom-3 right-4 text-[0.6rem] text-ivory/45">Illustrative animation</span>
      </div>
    </section>
  );
}
