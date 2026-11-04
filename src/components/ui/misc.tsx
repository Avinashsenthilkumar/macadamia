import Link from "next/link";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", className ?? "bg-forest/8 text-forest")}>
      {children}
    </span>
  );
}

export function Breadcrumbs({ items, tone = "dark" }: { items: { name: string; path: string }[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", tone === "light" ? "text-ivory/70" : "text-ink/60")}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 ? <span aria-hidden className="opacity-50">/</span> : null}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "light" ? "text-ivory" : "text-forest"}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition hover:underline hover:underline-offset-4">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
