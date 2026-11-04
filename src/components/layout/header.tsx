"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { mainNav } from "@/config/site";
import { ArrowSlide, buttonClasses } from "@/components/ui/button";
import { cn, telHref } from "@/lib/utils";

type HeaderProps = {
  businessName: string;
  logoUrl: string;
  phone: string;
  announcement?: string;
};

export function Header({ businessName, logoUrl, phone, announcement }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showBar, setShowBar] = useState(Boolean(announcement));
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence initial={false}>
          {showBar && announcement && !scrolled ? (
            <motion.div
              key="bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-nut text-ivory"
            >
              <div className="container-x flex items-center justify-center gap-3 py-2 text-center text-xs font-medium sm:text-sm">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ivory opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ivory" />
                </span>
                <Link href="/contact" className="hover:underline hover:underline-offset-4">
                  {announcement}
                </Link>
                <button type="button" onClick={() => setShowBar(false)} aria-label="Dismiss announcement" className="ml-1 rounded-full p-1 transition hover:bg-white/15">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className={cn("transition-all duration-500", scrolled ? "px-3 pt-3" : "px-0 pt-0")}>
          <div
            className={cn(
              "mx-auto flex items-center justify-between gap-4 transition-all duration-500",
              scrolled
                ? "max-w-7xl rounded-full border border-white/40 bg-ivory/85 px-4 py-2 shadow-lift backdrop-blur-xl sm:px-6"
                : "container-x py-5",
            )}
          >
            <Link href="/" className="group flex items-center gap-3" aria-label={`${businessName} – home`}>
              <motion.span whileHover={{ rotate: -8, scale: 1.06 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="block">
                <Image src={logoUrl} alt="" width={44} height={44} unoptimized className="h-10 w-10 rounded-xl sm:h-11 sm:w-11" priority />
              </motion.span>
              <span className="leading-none">
                <span className={cn("block font-display text-lg font-semibold tracking-tight transition-colors sm:text-xl", scrolled ? "text-forest" : "text-ivory")}>
                  {businessName}
                </span>
                <span className={cn("mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.25em] transition-colors", scrolled ? "text-leaf" : "text-sage")}>
                  Macadamia · Since 1980
                </span>
              </span>
            </Link>

            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {mainNav.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-[0.88rem] font-semibold transition-colors",
                        scrolled ? "text-ink/75 hover:text-forest" : "text-ivory/80 hover:text-ivory",
                        isActive(item.href) && (scrolled ? "text-forest" : "text-ivory"),
                      )}
                    >
                      {isActive(item.href) ? (
                        <motion.span
                          layoutId="nav-pill"
                          className={cn("absolute inset-0 -z-10 rounded-full", scrolled ? "bg-forest/8" : "bg-white/12")}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      ) : null}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <a href={telHref(phone)} className={cn("hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition md:flex", scrolled ? "text-forest hover:bg-forest/5" : "text-ivory hover:bg-white/10")}>
                <Phone className="h-4 w-4" /> <span className="hidden 2xl:inline">{phone}</span>
                <span className="sr-only 2xl:hidden">Call {phone}</span>
              </a>
              <Link href="/contact#enquiry" className={buttonClasses({ variant: scrolled ? "primary" : "light", size: "sm", className: "hidden sm:inline-flex" })}>
                Get a Quote <ArrowSlide />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className={cn("grid h-11 w-11 place-items-center rounded-full transition xl:hidden", scrolled ? "bg-forest text-ivory" : "bg-white/12 text-ivory backdrop-blur")}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            className="fixed inset-0 z-[70] flex flex-col bg-deep text-ivory xl:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="container-x flex items-center justify-between py-5">
              <span className="font-display text-xl">{businessName}</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pb-10">
              <motion.ul
                className="mt-4 space-y-1"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
              >
                {[...mainNav, { href: "/why-macadamia", label: "Why Macadamia?" }, { href: "/faq", label: "FAQ" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    variants={{ hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-baseline gap-4 border-b border-white/10 py-3.5 font-display text-3xl transition-colors hover:text-sage",
                        isActive(item.href) && "text-sage",
                      )}
                    >
                      <span className="font-sans text-xs text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link href="/contact#enquiry" className={buttonClasses({ variant: "light", size: "lg" })}>
                  Get a Quote <ArrowSlide />
                </Link>
                <a href={telHref(phone)} className={buttonClasses({ variant: "outline-light", size: "lg" })}>
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
