import Link from "next/link";
import { ArrowRight, BellRing, FileText, Inbox, Phone, Sprout } from "lucide-react";
import { AdminPageHeader, Panel, Pill } from "@/components/admin/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { requirePageUser } from "@/lib/auth";
import { db, safeQuery } from "@/lib/db";
import { enquiryStatusLabels, enquiryStatusTone, enquiryTypeLabels } from "@/lib/labels";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function AdminOverview({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requirePageUser();
  const sp = await searchParams;
  const since = new Date(Date.now() - 13 * 86_400_000);
  since.setHours(0, 0, 0, 0);

  const [total, fresh, contactRequests, products, published, recent, recentForChart, followUps] = await Promise.all([
    safeQuery(() => db.enquiry.count(), 0),
    safeQuery(() => db.enquiry.count({ where: { status: "NEW" } }), 0),
    safeQuery(() => db.enquiry.count({ where: { source: "contact" } }), 0),
    safeQuery(() => db.product.count(), 0),
    safeQuery(() => db.blogPost.count({ where: { status: "PUBLISHED" } }), 0),
    safeQuery(() => db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 8 }), []),
    safeQuery(() => db.enquiry.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }), []),
    safeQuery(
      () =>
        db.enquiry.findMany({
          where: { followUpDone: false, followUpAt: { lte: new Date(Date.now() + 86_400_000) } },
          orderBy: { followUpAt: "asc" },
          take: 6,
        }),
      [],
    ),
  ]);

  // Enquiries per day for the last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    return d;
  });
  const counts = days.map((d) => recentForChart.filter((e) => e.createdAt.toDateString() === d.toDateString()).length);
  const maxCount = Math.max(1, ...counts);
  const heights = ["h-[4%]", "h-[10%]", "h-[20%]", "h-[30%]", "h-[40%]", "h-[50%]", "h-[60%]", "h-[70%]", "h-[80%]", "h-[90%]", "h-full"];

  const stats = [
    { label: "Total enquiries", value: total, Icon: Inbox, href: "/admin/enquiries" },
    { label: "New enquiries", value: fresh, Icon: BellRing, href: "/admin/enquiries?status=NEW", highlight: fresh > 0 },
    { label: "Contact requests", value: contactRequests, Icon: Phone, href: "/admin/enquiries" },
    { label: "Products", value: products, Icon: Sprout, href: "/admin/products" },
    { label: "Published blogs", value: published, Icon: FileText, href: "/admin/blog" },
  ];

  return (
    <>
      <AdminPageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description="Here's what's happening on the Ganesh Nursery website." />
      {sp.denied ? <p className="mb-6 rounded-2xl bg-amber-50 px-5 py-3 text-sm text-amber-900">That section is available to administrators only.</p> : null}

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" stagger={0.06}>
        {stats.map(({ label, value, Icon, href, highlight }) => (
          <StaggerItem key={label}>
            <Link href={href} className={`group block rounded-3xl p-6 shadow-soft ring-1 ring-forest/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${highlight ? "bg-nut text-ivory" : "bg-white"}`}>
              <Icon className={`h-5 w-5 ${highlight ? "text-ivory" : "text-leaf"}`} />
              <p className={`mt-4 font-display text-4xl ${highlight ? "" : "text-forest"}`}>{value}</p>
              <p className={`mt-1 text-sm ${highlight ? "text-ivory/80" : "text-ink/60"}`}>{label}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <Panel title="Recent enquiries">
            {recent.length === 0 ? (
              <p className="text-sm text-ink/60">No enquiries yet. They will appear here as soon as visitors submit the website forms.</p>
            ) : (
              <ul className="divide-y divide-forest/5">
                {recent.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/enquiries/${e.id}`} className="group flex items-center gap-4 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-deep">
                          {e.fullName} <span className="font-normal text-ink/50">· {e.phone}</span>
                        </p>
                        <p className="truncate text-sm text-ink/55">{enquiryTypeLabels[e.enquiryType]} · {formatDateTime(e.createdAt)}</p>
                      </div>
                      <Pill className={enquiryStatusTone[e.status]}>{enquiryStatusLabels[e.status]}</Pill>
                      <ArrowRight className="h-4 w-4 text-ink/30 transition group-hover:translate-x-1 group-hover:text-forest" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1}>
            <Panel title="Last 14 days">
              <div className="flex h-36 items-end gap-1.5" role="img" aria-label={`Enquiries per day: ${counts.join(", ")}`}>
                {counts.map((c, i) => (
                  <div key={i} className="group relative flex h-full flex-1 items-end">
                    <div className={`w-full origin-bottom animate-grow rounded-t-md ${c ? "bg-leaf" : "bg-forest/10"} ${heights[Math.round((c / maxCount) * 10)]}`} />
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-deep px-1.5 py-0.5 text-[0.65rem] text-ivory opacity-0 transition group-hover:opacity-100">{c}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[0.65rem] text-ink/45">
                <span>{formatDate(days[0], { day: "numeric", month: "short" })}</span>
                <span>Today</span>
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={0.15}>
            <Panel title="Follow-ups due">
              {followUps.length === 0 ? (
                <p className="text-sm text-ink/60">No follow-ups due. Set a follow-up date on any enquiry to see it here.</p>
              ) : (
                <ul className="space-y-3">
                  {followUps.map((e) => (
                    <li key={e.id}>
                      <Link href={`/admin/enquiries/${e.id}`} className="flex justify-between gap-3 text-sm hover:text-leaf">
                        <span className="truncate font-semibold">{e.fullName}</span>
                        <span className={e.followUpAt && e.followUpAt < new Date() ? "text-red-700" : "text-ink/55"}>{formatDate(e.followUpAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </Reveal>
        </div>
      </div>
    </>
  );
}
