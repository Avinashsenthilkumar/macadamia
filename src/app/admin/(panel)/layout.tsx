import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requirePageUser } from "@/lib/auth";
import { db, safeQuery } from "@/lib/db";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  const newEnquiries = await safeQuery(() => db.enquiry.count({ where: { status: "NEW" } }), 0, "new enquiries");

  return (
    <div className="min-h-screen bg-[#f3f1e8]">
      <AdminSidebar user={user} newEnquiries={newEnquiries} />
      <main className="px-4 py-8 sm:px-8 lg:ml-64 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
