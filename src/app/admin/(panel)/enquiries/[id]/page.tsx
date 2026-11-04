import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { addEnquiryNote, deleteEnquiry, updateEnquiry } from "@/actions/admin/enquiries";
import { ActionForm } from "@/components/admin/action-form";
import { SelectField, TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { ActionButton } from "@/components/admin/confirm-action";
import { AdminPageHeader, Panel, Pill } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { enquiryStatuses, enquiryStatusLabels, enquiryStatusTone, enquiryTypeLabels } from "@/lib/labels";
import { formatDateTime, telHref } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const e = await db.enquiry.findUnique({
    where: { id },
    include: {
      product: { select: { name: true, slug: true } },
      service: { select: { title: true } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } },
    },
  });
  if (!e) notFound();

  const details: [string, string | number | null | undefined][] = [
    ["Reference", e.reference],
    ["Received", formatDateTime(e.createdAt)],
    ["Enquiry type", enquiryTypeLabels[e.enquiryType]],
    ["Source", e.source],
    ["Product", e.product?.name],
    ["Service", e.service?.title],
    ["State", e.state],
    ["District", e.district],
    ["Location", e.location],
    ["Land area", e.landArea],
    ["Plants required", e.plantsRequired],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className="text-sm font-semibold text-leaf">← Enquiries</Link>
      <AdminPageHeader
        title={e.fullName}
        description={`${e.reference} · ${enquiryTypeLabels[e.enquiryType]}`}
        actions={
          <>
            <a href={telHref(e.phone)} className={buttonClasses({ variant: "secondary", size: "sm" })}><Phone className="h-4 w-4" /> Call</a>
            <a href={whatsappLink(e.phone, `Hello ${e.fullName}, this is Ganesh Nursery regarding your enquiry ${e.reference}.`)} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", size: "sm" })}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {e.email ? <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry ${e.reference} — Ganesh Nursery`)}`} className={buttonClasses({ variant: "secondary", size: "sm" })}><Mail className="h-4 w-4" /> Email</a> : null}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Message">
            <p className="whitespace-pre-wrap leading-relaxed text-ink/80">{e.message}</p>
          </Panel>
          <Panel title="Customer details">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wider text-ink/45">Phone</dt><dd className="font-semibold">{e.phone}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-ink/45">Email</dt><dd className="font-semibold">{e.email ?? "—"}</dd></div>
              {details.map(([k, v]) => (
                <div key={k}><dt className="text-xs uppercase tracking-wider text-ink/45">{k}</dt><dd className="font-semibold">{v === null || v === undefined || v === "" ? "—" : v}</dd></div>
              ))}
            </dl>
          </Panel>
          <Panel title="Internal notes" description="Visible to admin users only.">
            <ActionForm action={addEnquiryNote} submitLabel="Add note" resetOnSuccess>
              <input type="hidden" name="id" value={e.id} />
              <TextAreaField name="body" label="New note" rows={3} placeholder="e.g. Called on 12 Nov — will visit nursery next week." />
            </ActionForm>
            <ul className="mt-8 space-y-4">
              {e.notes.map((n) => (
                <li key={n.id} className="rounded-2xl bg-cream/60 p-4">
                  <p className="whitespace-pre-wrap text-sm text-ink/80">{n.body}</p>
                  <p className="mt-2 text-xs text-ink/50">{n.author?.name ?? "Former user"} · {formatDateTime(n.createdAt)}</p>
                </li>
              ))}
              {e.notes.length === 0 ? <li className="text-sm text-ink/50">No notes yet.</li> : null}
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Status & follow-up">
            <p className="mb-5">Current: <Pill className={enquiryStatusTone[e.status]}>{enquiryStatusLabels[e.status]}</Pill></p>
            <ActionForm action={updateEnquiry} submitLabel="Update" className="space-y-4">
              <input type="hidden" name="id" value={e.id} />
              <SelectField name="status" label="Status" defaultValue={e.status} options={enquiryStatuses.map((s) => ({ value: s, label: enquiryStatusLabels[s] }))} />
              <TextField name="followUpAt" label="Follow-up date" type="date" defaultValue={e.followUpAt ? e.followUpAt.toISOString().slice(0, 10) : ""} />
              <Toggle name="followUpDone" label="Follow-up completed" defaultChecked={e.followUpDone} />
            </ActionForm>
          </Panel>
          {user.role === "ADMIN" ? (
            <Panel title="Danger zone">
              <ActionButton action={deleteEnquiry.bind(null, e.id)} confirm="Click again to permanently delete" tone="danger">
                Delete enquiry
              </ActionButton>
            </Panel>
          ) : null}
        </div>
      </div>
    </>
  );
}
