"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** A stylised macadamia nut in its shell (decorative only) */
export function NutGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <radialGradient id="nutShade" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#b48a62" />
          <stop offset="0.6" stopColor="#8A6545" />
          <stop offset="1" stopColor="#5e4330" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#nutShade)" />
      <path d="M14 18c4-5 13-6 19-1" stroke="#EEE9DB" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M24 6c-2 6-2 30 0 36" stroke="#4d3727" strokeOpacity=".35" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function LeafGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 80" className={className} aria-hidden>
      <path d="M20 2C6 20 4 52 20 78 36 52 34 20 20 2z" fill="currentColor" />
      <path d="M20 8v66" stroke="#F7F5ED" strokeOpacity=".35" strokeWidth="1.2" />
      {[18, 28, 38, 48, 58].map((y) => (
        <path key={y} d={`M20 ${y} l-8 -6 M20 ${y} l8 -6`} stroke="#F7F5ED" strokeOpacity=".25" strokeWidth="1" />
      ))}
    </svg>
  );
}

const floaters = [
  { kind: "nut", pos: "left-[6%] top-[18%] w-[34px]", delay: 0, dur: 7 },
  { kind: "leaf", pos: "left-[88%] top-[12%] w-[30px]", delay: 1.2, dur: 9 },
  { kind: "nut", pos: "left-[78%] top-[72%] w-[22px]", delay: 0.6, dur: 6 },
  { kind: "leaf", pos: "left-[14%] top-[78%] w-[26px]", delay: 2, dur: 8 },
  { kind: "nut", pos: "left-[48%] top-[8%] w-[16px]", delay: 1.6, dur: 6.5 },
  { kind: "leaf", pos: "left-[62%] top-[88%] w-[20px]", delay: 0.3, dur: 10 },
] as const;

/** Gently drifting nuts and leaves, used behind dark sections */
export function FloatingNature({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          className={cn("absolute", f.pos)}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: tone === "light" ? 0.55 : 0.35, scale: 1, y: [0, -18, 0], rotate: [0, f.kind === "leaf" ? 18 : 40, 0] }}
          transition={{
            opacity: { duration: 1.2, delay: f.delay },
            scale: { duration: 1.2, delay: f.delay },
            y: { duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay },
            rotate: { duration: f.dur * 1.4, repeat: Infinity, ease: "easeInOut", delay: f.delay },
          }}
        >
          {f.kind === "nut" ? (
            <NutGlyph className="h-auto w-full drop-shadow-lg" />
          ) : (
            <LeafGlyph className={cn("h-auto w-full", tone === "light" ? "text-sage" : "text-leaf")} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/** Background image that slowly zooms (Ken Burns) and drifts with scroll */
export function KenBurnsBackdrop({ src, alt, className, overlayClassName, priority = false }: { src: string; alt: string; className?: string; overlayClassName?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute inset-[-6%]" style={{ y }}>
        <div className="relative h-full w-full animate-kenburns">
          <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
        </div>
      </motion.div>
      <div className={cn("absolute inset-0", overlayClassName ?? "bg-gradient-to-b from-deep/85 via-deep/70 to-deep/90")} />
    </div>
  );
}

/** Animated sapling that "grows" when scrolled into view */
export function GrowingSapling({ className }: { className?: string }) {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 1.4, delay, ease: "easeInOut" as const },
  });
  const leaf = (delay: number) => ({
    initial: { scale: 0, opacity: 0 },
    whileInView: { scale: 1, opacity: 1 },
    viewport: { once: true },
    transition: { type: "spring" as const, stiffness: 120, damping: 12, delay },
  });
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden>
      <motion.ellipse cx="100" cy="226" rx="70" ry="9" fill="#8A6545" fillOpacity=".25" {...leaf(0)} />
      <motion.path d="M100 226 C100 190 98 150 102 70" stroke="#426B45" strokeWidth="5" strokeLinecap="round" fill="none" {...draw(0.1)} />
      <motion.path d="M101 170 C80 160 66 146 58 126" stroke="#426B45" strokeWidth="3" strokeLinecap="round" fill="none" {...draw(0.8)} />
      <motion.path d="M101 130 C122 120 138 104 144 84" stroke="#426B45" strokeWidth="3" strokeLinecap="round" fill="none" {...draw(1.1)} />
      <motion.g style={{ originX: "58px", originY: "126px" }} {...leaf(1.6)}>
        <path d="M58 126 C38 120 30 98 34 84 C52 88 64 104 58 126z" fill="#426B45" />
      </motion.g>
      <motion.g style={{ originX: "144px", originY: "84px" }} {...leaf(1.9)}>
        <path d="M144 84 C164 78 172 56 168 42 C150 46 138 62 144 84z" fill="#A8B89A" />
      </motion.g>
      <motion.g style={{ originX: "102px", originY: "70px" }} {...leaf(2.2)}>
        <path d="M102 70 C86 56 86 30 100 14 C114 30 116 56 102 70z" fill="#173F2A" />
      </motion.g>
      <motion.g {...leaf(2.6)}>
        <circle cx="120" cy="150" r="9" fill="#8A6545" />
        <circle cx="132" cy="160" r="7" fill="#8A6545" fillOpacity=".85" />
      </motion.g>
    </svg>
  );
}
