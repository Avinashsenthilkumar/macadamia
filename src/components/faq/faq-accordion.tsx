"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = { id: string; question: string; answer: string; category: string };

export function FaqAccordion({ faqs, searchable = false, grouped = false }: { faqs: Faq[]; searchable?: boolean; grouped?: boolean }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return faqs;
    return faqs.filter((f) => f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term));
  }, [faqs, q]);

  const groups = useMemo<[string, Faq[]][]>(() => {
    if (!grouped) return [["", filtered]];
    const map = new Map<string, Faq[]>();
    for (const f of filtered) map.set(f.category, [...(map.get(f.category) ?? []), f]);
    return [...map.entries()];
  }, [filtered, grouped]);

  return (
    <div>
      {searchable ? (
        <div className="relative mb-10">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/50" aria-hidden />
          <label htmlFor="faq-search" className="sr-only">Search questions</label>
          <input
            id="faq-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions — e.g. soil, delivery, grafted"
            className="h-14 w-full rounded-full border border-forest/15 bg-white pl-14 pr-6 text-base shadow-soft transition focus:border-leaf focus:outline-none focus:ring-4 focus:ring-sage/30"
          />
          <p className="sr-only" aria-live="polite">{filtered.length} questions found</p>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-3xl bg-cream p-8 text-center text-ink/70">No questions match “{q}”. Try another word, or ask us directly.</p>
      ) : null}

      <div className="space-y-12">
        {groups.map(([group, items]) => (
          <div key={group || "all"}>
            {group ? <h2 className="mb-5 font-display text-2xl text-forest">{group}</h2> : null}
            <ul className="space-y-3">
              {items.map((f, i) => {
                const isOpen = open === f.id;
                return (
                  <motion.li
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                    className={cn("overflow-hidden rounded-3xl border transition-colors duration-300", isOpen ? "border-leaf/30 bg-white shadow-soft" : "border-forest/10 bg-white/60 hover:bg-white")}
                  >
                    <h3>
                      <button
                        type="button"
                        id={`faq-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${f.id}`}
                        onClick={() => setOpen(isOpen ? null : f.id)}
                        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-deep sm:text-lg"
                      >
                        {f.question}
                        <motion.span animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors", isOpen ? "bg-forest text-ivory" : "bg-cream text-forest")}>
                          <Plus className="h-4 w-4" />
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={`faq-a-${f.id}`}
                          role="region"
                          aria-labelledby={`faq-q-${f.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="whitespace-pre-line px-6 pb-6 leading-relaxed text-ink/75">{f.answer}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
