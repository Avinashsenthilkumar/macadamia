"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";
import { Counter, Magnetic } from "@/components/motion/primitives";
import { FloatingNature, NutGlyph } from "@/components/motion/decor";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ heroImage, heroImageAlt, established }: { heroImage: string; heroImageAlt: string; established: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer parallax for the photo stack
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const layer1x = useTransform(sx, (v) => v * 18);
  const layer1y = useTransform(sy, (v) => v * 18);
  const layer2x = useTransform(sx, (v) => v * -26);
  const layer2y = useTransform(sy, (v) => v * -26);
  const layer3x = useTransform(sx, (v) => v * 34);
  const layer3y = useTransform(sy, (v) => v * 34);

  const headline = ["Grow", "the", "Future", "with"];
  const years = new Date().getFullYear() - established;

  return (
    <section
      ref={ref}
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-deep text-ivory"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <motion.div className="absolute inset-[-8%] -z-10" style={{ y: bgY }}>
        <motion.div className="relative h-full w-full" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
          <div className="relative h-full w-full animate-kenburns">
            <Image src={heroImage} alt={heroImageAlt} fill priority sizes="100vw" className="object-cover" />
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-deep/85 to-deep/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-transparent to-deep/60" />
      <FloatingNature />

      {/* Animated light rays */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 right-[10%] -z-10 h-[140%] w-[38rem] rotate-[18deg] bg-gradient-to-b from-sage/25 via-sage/5 to-transparent blur-3xl"
        animate={{ opacity: [0.4, 0.8, 0.4], x: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative grid items-center gap-14 pb-24 pt-36 lg:grid-cols-12 lg:pt-32">
        <div className="lg:col-span-7">
          <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="eyebrow text-sage">
            Ganesh Nursery · Thanjavur
          </motion.span>

          <h1 className="mt-6 font-display text-[3.1rem] leading-[0.98] tracking-tight sm:text-7xl xl:text-[5.6rem]">
            <span className="sr-only">Grow the Future with Macadamia.</span>
            <span aria-hidden className="block">
              {headline.map((w, i) => (
                <span key={w} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span className="inline-block" initial={{ y: "110%", rotate: 6 }} animate={{ y: "0%", rotate: 0 }} transition={{ duration: 1, delay: 0.4 + i * 0.09, ease: EASE }}>
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
              <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block bg-gradient-to-r from-sage via-[#d9c7a8] to-sage bg-[length:200%_auto] bg-clip-text italic text-transparent"
                  initial={{ y: "110%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0, backgroundPosition: ["0% 50%", "200% 50%"] }}
                  transition={{ y: { duration: 1, delay: 0.8, ease: EASE }, rotate: { duration: 1, delay: 0.8, ease: EASE }, backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" } }}
                >
                  Macadamia.
                </motion.span>
              </span>
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/80 sm:text-xl">
            Discover macadamia cultivation with Ganesh Nursery. Explore quality planting material, plantation guidance and support for your agricultural journey.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic>
              <Link href="/macadamia-plants" className={buttonClasses({ variant: "light", size: "lg" })}>
                Explore Macadamia Plants <ArrowSlide />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/contact#enquiry" className={buttonClasses({ variant: "outline-light", size: "lg" })}>
                Talk to Our Team
              </Link>
            </Magnetic>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.6 } } }}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-ivory/75"
          >
            {["Decades of Nursery Experience", "Plantation Guidance", "Customer Support"].map((t) => (
              <motion.li key={t} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Floating photo stack */}
        <div className="relative hidden h-[34rem] lg:col-span-5 lg:block">
          <motion.div style={{ x: layer1x, y: layer1y }} className="absolute right-0 top-0 h-[26rem] w-[19rem]">
            <motion.div initial={{ opacity: 0, y: 60, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 3 }} transition={{ delay: 0.9, duration: 1.2, ease: EASE }} className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20">
              <Image src="/images/gallery/macadamia-sapling-handover.webp" alt="A macadamia sapling held in its grow bag" fill sizes="320px" className="object-cover" />
            </motion.div>
          </motion.div>
          <motion.div style={{ x: layer2x, y: layer2y }} className="absolute bottom-6 left-0 h-56 w-56">
            <motion.div initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ delay: 1.2, duration: 1.1, ease: EASE }} className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-ivory/90 shadow-2xl">
              <Image src="/images/gallery/macadamia-nuts-cracked.webp" alt="Macadamia nuts in their shells (illustrative)" fill sizes="224px" className="object-cover" />
            </motion.div>
          </motion.div>
          <motion.div style={{ x: layer3x, y: layer3y }} className="absolute bottom-0 right-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9, ease: EASE }} className="rounded-3xl bg-ivory/95 px-6 py-5 text-forest shadow-2xl backdrop-blur">
              <p className="font-display text-5xl leading-none">
                <Counter to={years} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-leaf">Years of nursery experience</p>
            </motion.div>
          </motion.div>
          <motion.div aria-hidden className="absolute left-16 top-10 w-14" animate={{ y: [0, -16, 0], rotate: [0, 25, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <NutGlyph className="h-auto w-full drop-shadow-xl" />
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to learn more"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-ivory/60 sm:flex"
      >
        Scroll
        <span className="flex h-10 w-6 justify-center rounded-full border border-ivory/40 pt-2">
          <span className="h-2 w-1 animate-scroll-dot rounded-full bg-ivory" />
        </span>
      </motion.a>
    </section>
  );
}
