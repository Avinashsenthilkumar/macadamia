"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { whatsappLink, whatsappMessages, type WhatsAppPreset } from "@/lib/whatsapp";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="currentColor">
      <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.99L4 29l8.24-2.15a12.1 12.1 0 0 0 3.8.62h.01c6.63 0 12.03-5.37 12.03-11.98S22.68 3 16.04 3zm0 21.94h-.01c-1.18 0-2.34-.31-3.36-.91l-.24-.14-4.89 1.27 1.3-4.74-.16-.24a9.86 9.86 0 0 1-1.53-5.21c0-5.45 4.46-9.88 9.9-9.88 2.64 0 5.13 1.03 7 2.89a9.79 9.79 0 0 1 2.9 6.99c0 5.45-4.46 9.97-9.91 9.97zm5.43-7.4c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

const presets: { key: WhatsAppPreset; label: string }[] = [
  { key: "plant", label: "Macadamia plant enquiry" },
  { key: "bulk", label: "Bulk order enquiry" },
  { key: "consultation", label: "Plantation consultation" },
  { key: "general", label: "General enquiry" },
];

export function WhatsAppFloat({ number }: { number: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-72 origin-bottom-right overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-forest/10"
          >
            <div className="bg-[#1f9d55] px-5 py-4 text-white">
              <p className="font-display text-lg">Chat with Ganesh Nursery</p>
              <p className="text-xs text-white/80">Choose a topic — we&apos;ll open WhatsApp with your message ready.</p>
            </div>
            <ul className="p-2">
              {presets.map((p, i) => (
                <motion.li key={p.key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <a
                    href={whatsappLink(number, whatsappMessages[p.key])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-deep transition hover:bg-[#1f9d55]/10"
                  >
                    {p.label}
                    <span aria-hidden className="text-[#1f9d55]">→</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp options" : "Chat on WhatsApp"}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1f9d55] text-white shadow-lift"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {!open ? <span aria-hidden className="absolute inset-0 animate-ping-soft rounded-full bg-[#1f9d55]" /> : null}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "x" : "wa"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative">
            {open ? <X className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
