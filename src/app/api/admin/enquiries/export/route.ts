import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { getSessionUser } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { buildEnquiryWhere } from "@/lib/enquiry-filters";
import { enquiryStatusLabels, enquiryTypeLabels } from "@/lib/labels";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const where = buildEnquiryWhere({
    q: sp.get("q") ?? undefined,
    status: sp.get("status") ?? undefined,
    type: sp.get("type") ?? undefined,
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
  });

  try {
    const rows = await db.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10_000,
      include: { product: { select: { name: true } }, service: { select: { title: true } } },
    });

    const csv = toCsv(
      ["Reference", "Date", "Status", "Type", "Name", "Phone", "Email", "State", "District", "Location", "Land area", "Plants required", "Product", "Service", "Follow-up date", "Follow-up done", "Message"],
      rows.map((r) => [
        r.reference,
        r.createdAt.toISOString(),
        enquiryStatusLabels[r.status],
        enquiryTypeLabels[r.enquiryType],
        r.fullName,
        r.phone,
        r.email,
        r.state,
        r.district,
        r.location,
        r.landArea,
        r.plantsRequired,
        r.product?.name,
        r.service?.title,
        r.followUpAt?.toISOString().slice(0, 10),
        r.followUpDone ? "Yes" : "No",
        r.message,
      ]),
    );

    await audit(user, "export_csv", "Enquiry", null, { count: rows.length });
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ganesh-nursery-enquiries-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[export]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
