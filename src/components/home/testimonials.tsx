"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type T = { id: string; name: string; location: string | null; quote: string };

/** Only renders genuine testimonials entered (and confirmed) by the admin */
export function Testimonials({ items }: { items: T[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  if (!items.length) return null;
  const item = items[i]!;

  return (
    <div className="relative mx-auto max-w-4xl text-center" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Quote className="mx-auto h-12 w-12 text-sage" aria-hidden />
      <div className="relative mt-6 min-h-56" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure key={item.id} initial={{ opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -24, filter: "blur(6px)" }} transition={{ duration: 0.6 }}>
            <blockquote className="font-display text-2xl leading-snug text-forest sm:text-3xl">“{item.quote}”</blockquote>
            <figcaption className="mt-6 text-sm font-semibold text-ink/70">
              {item.name}
              {item.location ? <span className="font-normal text-ink/50"> · {item.location}</span> : null}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {items.length > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" aria-label="Previous testimonial" onClick={() => setI((v) => (v - 1 + items.length) % items.length)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-forest/20 transition hover:bg-forest hover:text-ivory">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {items.map((t, idx) => (
              <button key={t.id} type="button" aria-label={`Show testimonial ${idx + 1}`} onClick={() => setI(idx)} className={`relative h-2 overflow-hidden rounded-full bg-forest/15 transition-all ${idx === i ? "w-8" : "w-2"}`}>
                {idx === i ? <motion.span layoutId="t-dot" className="absolute inset-0 bg-forest" /> : null}
              </button>
            ))}
          </div>
          <button type="button" aria-label="Next testimonial" onClick={() => setI((v) => (v + 1) % items.length)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-forest/20 transition hover:bg-forest hover:text-ivory">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
