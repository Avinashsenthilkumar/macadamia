import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-forest sm:text-4xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-ink/60">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({ title, description, children, className }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-3xl bg-white p-6 shadow-soft ring-1 ring-forest/5 sm:p-8", className)}>
      {title ? <h2 className="font-display text-xl text-forest">{title}</h2> : null}
      {description ? <p className="mt-1 text-sm text-ink/55">{description}</p> : null}
      <div className={title || description ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold", className ?? "bg-cream text-nut")}>{children}</span>;
}

export function EmptyState({ title, text, href, cta }: { title: string; text?: string; href?: string; cta?: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-forest/15 p-12 text-center">
      <p className="font-display text-2xl text-forest">{title}</p>
      {text ? <p className="mt-2 text-ink/60">{text}</p> : null}
      {href && cta ? (
        <Link href={href} className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-soft ring-1 ring-forest/5">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="border-b border-forest/10 text-xs uppercase tracking-wider text-ink/50">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest/5">{children}</tbody>
      </table>
    </div>
  );
}
