import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/config/site";
import { footerNav } from "@/config/site";
import { Reveal } from "@/components/motion/primitives";
import { telHref } from "@/lib/utils";

/** Compact footer: menu columns + contact, no oversized branding */
export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = [
    { href: settings.social.facebook, label: "Facebook" },
    { href: settings.social.instagram, label: "Instagram" },
    { href: settings.social.youtube, label: "YouTube" },
    { href: settings.social.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);
  const columns = [
    ["Explore", footerNav.explore],
    ["Company", footerNav.company],
    ["Legal", footerNav.legal],
  ] as const;

  return (
    <footer className="relative bg-deep text-ivory">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/50 to-transparent" />
      <div className="container-x pt-14 pb-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map(([title, links], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-sage">{title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-center gap-2 text-ivory/75 transition hover:text-ivory">
                      <span className="h-px w-0 bg-sage transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal delay={0.18} className="space-y-3 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Contact</h3>
            <p className="flex gap-2.5 text-ivory/75">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span className="flex flex-col">
                {[settings.phones.primary, settings.phones.secondary].filter(Boolean).map((p) => (
                  <a key={p} href={telHref(p)} className="hover:text-ivory">{p}</a>
                ))}
              </span>
            </p>
            <p className="flex gap-2.5 text-ivory/75">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-ivory">{settings.email}</a>
            </p>
            {settings.addresses[0] ? (
              <p className="flex gap-2.5 text-ivory/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <span>{settings.addresses[0].city}, {settings.addresses[0].state}</span>
              </p>
            ) : null}
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.businessName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">{s.label}</a>
            ))}
            {settings.relatedSites.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">{r.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
