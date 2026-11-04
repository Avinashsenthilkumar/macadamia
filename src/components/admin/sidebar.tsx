"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ExternalLink,
  FileText,
  HelpCircle,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  ScrollText,
  Settings,
  Sprout,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox },
  { href: "/admin/products", label: "Products", Icon: Sprout },
  { href: "/admin/blog", label: "Blog", Icon: FileText },
  { href: "/admin/gallery", label: "Gallery", Icon: ImageIcon },
  { href: "/admin/faqs", label: "FAQ", Icon: HelpCircle },
  { href: "/admin/services", label: "Services", Icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Website Settings", Icon: Settings, adminOnly: true },
  { href: "/admin/users", label: "Users", Icon: Users, adminOnly: true },
  { href: "/admin/audit-log", label: "Audit Log", Icon: ScrollText, adminOnly: true },
];

export function AdminSidebar({ user, newEnquiries }: { user: { name: string; email: string; role: "ADMIN" | "EDITOR" }; newEnquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const items = nav.filter((n) => !n.adminOnly || user.role === "ADMIN");
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const content = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-3 py-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage/20 font-display text-lg text-sage">G</span>
        <span>
          <span className="block font-display text-lg leading-none text-ivory">Ganesh Nursery</span>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sage">Admin</span>
        </span>
      </Link>
      <nav aria-label="Admin" className="mt-8 flex-1 space-y-1 overflow-y-auto">
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors", isActive(href) ? "text-deep" : "text-ivory/70 hover:bg-white/5 hover:text-ivory")}
          >
            {isActive(href) ? <motion.span layoutId="admin-nav" className="absolute inset-0 -z-10 rounded-xl bg-sage" transition={{ type: "spring", stiffness: 380, damping: 32 }} /> : null}
            <Icon className="h-4 w-4" />
            {label}
            {href === "/admin/enquiries" && newEnquiries > 0 ? (
              <span className="ml-auto rounded-full bg-nut px-2 py-0.5 text-[0.7rem] text-ivory">{newEnquiries}</span>
            ) : null}
          </Link>
        ))}
      </nav>
      <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ivory/70 hover:bg-white/5 hover:text-ivory">
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <Link href="/admin/account" className="block rounded-xl px-3 py-2 hover:bg-white/5">
          <span className="block truncate text-sm font-semibold text-ivory">{user.name}</span>
          <span className="block truncate text-xs text-ivory/50">{user.email} · {user.role === "ADMIN" ? "Administrator" : "Editor"}</span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ivory/70 hover:bg-white/5 hover:text-ivory">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-deep p-4 lg:block">{content}</aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-deep px-4 py-3 lg:hidden">
        <span className="font-display text-lg text-ivory">Ganesh Nursery Admin</span>
        <button type="button" aria-label="Open admin menu" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-ivory">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <>
            <motion.div key="scrim" className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside key="drawer" className="fixed inset-y-0 left-0 z-50 w-72 bg-deep p-4 lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 32 }}>
              <button type="button" aria-label="Close admin menu" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-ivory">
                <X className="h-4 w-4" />
              </button>
              {content}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
