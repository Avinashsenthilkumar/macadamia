"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

/** Circular reading-progress indicator tied to the article body */
export function ArticleProgress({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="pointer-events-none fixed bottom-24 left-5 z-30 hidden sm:block">
        <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
          <circle cx="22" cy="22" r="19" fill="rgba(247,245,237,0.92)" stroke="#EEE9DB" strokeWidth="3" />
          <motion.circle cx="22" cy="22" r="19" fill="none" stroke="#426B45" strokeWidth="3" strokeLinecap="round" style={{ pathLength: progress }} />
        </svg>
      </div>
      {children}
    </div>
  );
}
