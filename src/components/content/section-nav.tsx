"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/** Sticky table of contents with scroll-spy and a reading-progress rail */
export function SectionNav({ sections, title = "On this page" }: { sections: { id: string; title: string }[]; title?: string }) {
  const [active, setActive] = useState(sections[0]?.id);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={title} className="relative">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">{title}</p>
      <div className="relative mt-5 pl-5">
        <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-forest/10" />
        <motion.span aria-hidden className="absolute left-0 top-0 h-full w-px origin-top bg-forest" style={{ scaleY: progress }} />
        <ul className="space-y-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "relative flex gap-3 rounded-lg py-1.5 text-sm transition-all duration-300",
                  active === s.id ? "translate-x-1 font-semibold text-forest" : "text-ink/55 hover:text-forest",
                )}
              >
                {active === s.id ? <motion.span layoutId="toc-dot" className="absolute -left-[1.42rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-nut ring-4 ring-ivory" /> : null}
                <span className="w-5 shrink-0 tabular-nums text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
