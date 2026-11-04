import Link from "next/link";
import { Download, Search } from "lucide-react";
import { quickSetStatus } from "@/actions/admin/enquiries";
import { ActionButton } from "@/components/admin/confirm-action";
import { AdminPageHeader, EmptyState, Pill, Table } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildEnquiryWhere } from "@/lib/enquiry-filters";
import { enquiryStatuses, enquiryStatusLabels, enquiryStatusTone, enquiryTypeLabels, enquiryTypes } from "@/lib/labels";
import { cn, formatDateTime } from "@/lib/utils";

const PAGE = 25;
type SP = Promise<{ q?: string; status?: string; type?: string; from?: string; to?: string; page?: string }>;

export default async function AdminEnquiries({ searchParams }: { searchParams: SP }) {
  await requirePageUser();
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const where = buildEnquiryWhere(sp);

  const [rows, total, statusCounts] = await Promise.all([
    db.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, take: PAGE, skip: (page - 1) * PAGE, include: { product: { select: { name: true } } } }),
    db.enquiry.count({ where }),
    db.enquiry.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const countFor = (s: string) => statusCounts.find((c) => c.status === s)?._count._all ?? 0;

  const filterQs = new URLSearchParams(Object.entries({ q: sp.q, status: sp.status, type: sp.type, from: sp.from, to: sp.to }).filter(([, v]) => v) as [string, string][]);
  const link = (extra: Record<string, string | undefined>) => {
    const u = new URLSearchParams(filterQs);
    for (const [k, v] of Object.entries(extra)) {
      if (v) u.set(k, v);
      else u.delete(k);
    }
    const s = u.toString();
    return s ? `/admin/enquiries?${s}` : "/admin/enquiries";
  };

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description={`${total} matching enquir${total === 1 ? "y" : "ies"}`}
        actions={
          <a href={`/api/admin/enquiries/export${filterQs.toString() ? `?${filterQs}` : ""}`} className={buttonClasses({ variant: "secondary", size: "sm" })}>
            <Download className="h-4 w-4" /> Export CSV
          </a>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <Link href={link({ status: undefined, page: undefined })} className={cn("rounded-full px-4 py-2 text-sm font-semibold", !sp.status ? "bg-forest text-ivory" : "bg-white text-forest shadow-soft")}>
          All
        </Link>
        {enquiryStatuses.map((s) => (
          <Link key={s} href={link({ status: s, page: undefined })} className={cn("rounded-full px-4 py-2 text-sm font-semibold", sp.status === s ? "bg-forest text-ivory" : "bg-white text-forest shadow-soft")}>
            {enquiryStatusLabels[s]} <span className="opacity-60">{countFor(s)}</span>
          </Link>
        ))}
      </div>

      <form method="get" className="mb-6 grid gap-3 rounded-3xl bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-6">
        {sp.status ? <input type="hidden" name="status" value={sp.status} /> : null}
        <label className="relative lg:col-span-2">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input name="q" defaultValue={sp.q} placeholder="Name, phone, email, reference…" className="h-11 w-full rounded-xl border border-forest/15 pl-9 pr-3 text-sm" />
        </label>
        <label>
          <span className="sr-only">Enquiry type</span>
          <select name="type" defaultValue={sp.type ?? ""} className="h-11 w-full rounded-xl border border-forest/15 px-3 text-sm">
            <option value="">All types</option>
            {enquiryTypes.map((t) => (
              <option key={t} value={t}>{enquiryTypeLabels[t]}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-ink/50">
          From
          <input type="date" name="from" defaultValue={sp.from} className="h-11 w-full rounded-xl border border-forest/15 px-3 text-sm text-ink" />
        </label>
        <label className="text-xs text-ink/50">
          To
          <input type="date" name="to" defaultValue={sp.to} className="h-11 w-full rounded-xl border border-forest/15 px-3 text-sm text-ink" />
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className={buttonClasses({ size: "sm", className: "h-11 flex-1" })}>Filter</button>
          <Link href="/admin/enquiries" className={buttonClasses({ variant: "ghost", size: "sm", className: "h-11" })}>Reset</Link>
        </div>
      </form>

      {rows.length === 0 ? (
        <EmptyState title="No enquiries found" text="Try changing the filters." />
      ) : (
        <Table head={["Received", "Customer", "Type", "Location", "Plants", "Status", ""]}>
          {rows.map((e) => (
            <tr key={e.id} className={cn("transition hover:bg-cream/40", e.status === "NEW" && "bg-amber-50/40")}>
              <td className="whitespace-nowrap px-5 py-4 text-ink/60">
                {formatDateTime(e.createdAt)}
                <span className="block text-xs text-ink/40">{e.reference}</span>
              </td>
              <td className="px-5 py-4">
                <Link href={`/admin/enquiries/${e.id}`} className="font-semibold text-deep hover:text-leaf">{e.fullName}</Link>
                <span className="block text-xs text-ink/55">{e.phone}{e.email ? ` · ${e.email}` : ""}</span>
              </td>
              <td className="px-5 py-4 text-ink/70">
                {enquiryTypeLabels[e.enquiryType]}
                {e.product ? <span className="block text-xs text-ink/45">{e.product.name}</span> : null}
              </td>
              <td className="px-5 py-4 text-ink/70">{[e.district, e.state].filter(Boolean).join(", ") || "—"}</td>
              <td className="px-5 py-4 text-ink/70">{e.plantsRequired ?? "—"}</td>
              <td className="px-5 py-4"><Pill className={enquiryStatusTone[e.status]}>{enquiryStatusLabels[e.status]}</Pill></td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  {e.status === "NEW" ? <ActionButton action={quickSetStatus.bind(null, e.id, "CONTACTED")}>Mark contacted</ActionButton> : null}
                  <Link href={`/admin/enquiries/${e.id}`} className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-semibold text-forest hover:bg-forest/5">Open</Link>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {pages > 1 ? (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-ink/60">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 ? <Link href={link({ page: String(page - 1) })} className={buttonClasses({ variant: "secondary", size: "sm" })}>Previous</Link> : null}
            {page < pages ? <Link href={link({ page: String(page + 1) })} className={buttonClasses({ variant: "secondary", size: "sm" })}>Next</Link> : null}
          </div>
        </nav>
      ) : null}
    </>
  );
}
