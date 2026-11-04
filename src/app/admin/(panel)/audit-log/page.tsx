import { AdminPageHeader, Table } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function AuditLogPage() {
  await requirePageUser("ADMIN");
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <>
      <AdminPageHeader title="Audit log" description="The latest 200 administrative actions." />
      <Table head={["When", "Who", "Action", "Item", "Details"]}>
        {logs.map((l) => (
          <tr key={l.id}>
            <td className="whitespace-nowrap px-5 py-3 text-ink/60">{formatDateTime(l.createdAt)}</td>
            <td className="px-5 py-3">{l.actorEmail}</td>
            <td className="px-5 py-3 font-semibold text-deep">{l.action}</td>
            <td className="px-5 py-3 text-ink/70">{l.entity}{l.entityId ? <span className="block text-xs text-ink/40">{l.entityId}</span> : null}</td>
            <td className="max-w-xs truncate px-5 py-3 font-mono text-xs text-ink/55">{l.details ? JSON.stringify(l.details) : ""}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
