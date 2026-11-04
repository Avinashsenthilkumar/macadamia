import { ArrowDown, ArrowUp } from "lucide-react";
import { deleteFaq, moveFaq, saveFaq } from "@/actions/admin/content";
import { ActionForm } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/confirm-action";
import { TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { AdminPageHeader, EmptyState, Panel, Pill } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminFaqs() {
  await requirePageUser();
  const faqs = await db.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <AdminPageHeader title="FAQ" description="Questions shown on the FAQ page, homepage and Why Macadamia page. Business-specific answers (availability, delivery, pricing) should be confirmed by the nursery." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Add a question">
          <ActionForm action={saveFaq} submitLabel="Add FAQ" resetOnSuccess className="space-y-4">
            <TextField name="question" label="Question" required />
            <TextAreaField name="answer" label="Answer" required rows={5} />
            <TextField name="category" label="Group" defaultValue="General" hint="e.g. Macadamia basics, Cultivation, Orders & delivery" />
            <TextField name="sortOrder" label="Sort order" type="number" defaultValue={(faqs.length + 1) * 10} />
            <Toggle name="isPublished" label="Published" defaultChecked />
          </ActionForm>
        </Panel>
        <div className="space-y-3 xl:col-span-2">
          {faqs.length === 0 ? <EmptyState title="No FAQs yet" /> : null}
          {faqs.map((f, i) => (
            <details key={f.id} className="group rounded-3xl bg-white p-5 shadow-soft ring-1 ring-forest/5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="font-semibold text-deep">{f.question}</span>
                  <span className="mt-1 flex gap-2">
                    <Pill>{f.category}</Pill>
                    {!f.isPublished ? <Pill className="bg-stone-200 text-stone-700">Hidden</Pill> : null}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {i > 0 ? <ActionButton action={moveFaq.bind(null, f.id, "up")}><ArrowUp className="h-4 w-4" /><span className="sr-only">Move up</span></ActionButton> : null}
                  {i < faqs.length - 1 ? <ActionButton action={moveFaq.bind(null, f.id, "down")}><ArrowDown className="h-4 w-4" /><span className="sr-only">Move down</span></ActionButton> : null}
                </span>
              </summary>
              <ActionForm action={saveFaq} submitLabel="Save" className="mt-5 space-y-4 border-t border-forest/5 pt-5">
                <input type="hidden" name="id" value={f.id} />
                <TextField name="question" label="Question" required defaultValue={f.question} />
                <TextAreaField name="answer" label="Answer" required rows={5} defaultValue={f.answer} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField name="category" label="Group" defaultValue={f.category} />
                  <TextField name="sortOrder" label="Sort order" type="number" defaultValue={f.sortOrder} />
                </div>
                <Toggle name="isPublished" label="Published" defaultChecked={f.isPublished} />
              </ActionForm>
              <div className="mt-3">
                <ActionButton action={deleteFaq.bind(null, f.id)} confirm="Confirm delete" tone="danger">Delete</ActionButton>
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
