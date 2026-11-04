"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Item = { id: string; availability: string; propagation: string; node: React.ReactNode };

const filters = [
  { key: "all", label: "All plants" },
  { key: "available", label: "Available now" },
  { key: "GRAFTED", label: "Grafted" },
  { key: "SEEDLING", label: "Seed-grown" },
] as const;

/** Client-side filter with animated re-layout of product cards */
export function ProductCatalogue({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const visible = useMemo(
    () =>
      items.filter((i) => {
        if (filter === "all") return true;
        if (filter === "available") return i.availability === "IN_STOCK" || i.availability === "LIMITED";
        return i.propagation === filter;
      }),
    [items, filter],
  );

  // Only offer filters that would match something
  const usable = filters.filter(
    (f) =>
      f.key === "all" ||
      items.some((i) => (f.key === "available" ? i.availability === "IN_STOCK" || i.availability === "LIMITED" : i.propagation === f.key)),
  );

  return (
    <div>
      {usable.length > 1 ? (
        <div role="tablist" aria-label="Filter plants" className="mb-10 flex flex-wrap gap-2">
          {usable.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn("relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors", filter === f.key ? "text-ivory" : "text-forest hover:bg-forest/5")}
            >
              {filter === f.key ? <motion.span layoutId="cat-pill" className="absolute inset-0 -z-10 rounded-full bg-forest" transition={{ type: "spring", stiffness: 380, damping: 30 }} /> : null}
              {f.label}
            </button>
          ))}
        </div>
      ) : null}
      <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((i, idx) => (
            <motion.div key={i.id} layout initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
              {i.node}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 ? <p className="py-10 text-center text-ink/60">No plants match this filter right now.</p> : null}
    </div>
  );
}
