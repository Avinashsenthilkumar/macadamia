"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Img = { id: string; url: string; alt: string };

const FALLBACK: Img[] = [
  { id: "fallback-1", url: "/images/orchard/orchard-young-tree.webp", alt: "Young macadamia tree (illustrative)" },
  { id: "fallback-2", url: "/images/orchard/macadamia-nuts-on-tree.webp", alt: "Macadamia nuts on the tree (illustrative)" },
];

export function ProductGallery({ images: given, name }: { images: Img[]; name: string }) {
  const images = given.length ? given : FALLBACK;
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);

  const img = images[active]!;

  return (
    <div>
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[2rem] bg-cream shadow-lift"
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={img.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <Image
              src={img.url}
              alt={img.alt || name}
              fill
              priority={active === 0}
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-out"
              style={{ transformOrigin: origin, transform: zoom ? "scale(1.8)" : "scale(1)" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((im, i) => (
            <button
              key={im.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === active}
              className={cn("relative aspect-square overflow-hidden rounded-2xl ring-2 transition-all duration-300", i === active ? "ring-forest" : "ring-transparent opacity-70 hover:opacity-100")}
            >
              <Image src={im.url} alt="" fill sizes="120px" className="object-cover" />
              {i === active ? <motion.span layoutId="thumb-active" className="absolute inset-0 rounded-2xl ring-4 ring-inset ring-forest/40" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
