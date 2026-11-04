"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ClipboardList, Compass, Sprout, Users } from "lucide-react";
import { pics } from "@/content/images";

const steps = [
  { n: "01", title: "Initial Consultation", text: "Tell us about your land, water source, goals and timeline. We listen first and answer your questions about macadamia.", Icon: Users, pic: pics.saplingVisit },
  { n: "02", title: "Site and Soil Assessment", text: "Review climate, drainage, soil test results and water availability — the factors that decide whether macadamia suits your land.", Icon: Compass, pic: pics.soil },
  { n: "03", title: "Plant Selection and Planning", text: "Discuss planting material, layout, spacing and pollination planning so your orchard starts on the right footing.", Icon: ClipboardList, pic: pics.nurseryBeds },
  { n: "04", title: "Plantation Guidance", text: "Guidance on planting, early care and the questions to raise with your local agricultural experts as trees establish.", Icon: Sprout, pic: pics.pondPlanting },
];

/** Vertical timeline whose connecting line fills as you scroll */
export function ProcessSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative mt-16 space-y-6 lg:mt-0">
      <span aria-hidden className="absolute left-[1.9rem] top-4 h-[calc(100%-2rem)] w-px bg-ivory/15" />
      <motion.span aria-hidden className="absolute left-[1.9rem] top-4 h-[calc(100%-2rem)] w-px origin-top bg-gradient-to-b from-sage to-nut" style={{ scaleY: fill }} />
      {steps.map(({ n, title, text, Icon, pic }, i) => (
        <motion.li
          key={n}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="group relative flex gap-6"
        >
          <motion.span
            className="relative z-10 grid h-[3.8rem] w-[3.8rem] shrink-0 place-items-center rounded-2xl bg-forest ring-1 ring-sage/30 transition-colors duration-500 group-hover:bg-sage group-hover:text-deep"
            whileInView={{ rotate: [0, -8, 0] }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
          >
            <Icon className="h-6 w-6" />
          </motion.span>
          <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:border-sage/40 group-hover:bg-white/[0.07] sm:flex-row">
            <div className="relative h-40 shrink-0 overflow-hidden sm:h-auto sm:w-40">
              <Image src={pic.src} alt={pic.alt} fill sizes="(min-width:640px) 160px, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="p-6">
              <p className="font-display text-sm text-sage">Step {n}</p>
              <h3 className="mt-1 font-display text-2xl">{title}</h3>
              <p className="mt-2 leading-relaxed text-ivory/70">{text}</p>
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
