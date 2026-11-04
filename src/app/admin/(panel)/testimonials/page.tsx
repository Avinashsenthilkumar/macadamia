import { deleteTestimonial, saveTestimonial } from "@/actions/admin/content";
import { ActionForm } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/confirm-action";
import { TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { AdminPageHeader, EmptyState, Panel, Pill } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

function Fields({ t }: { t?: { name: string; location: string | null; quote: string; isPublished: boolean; sortOrder: number } }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="Customer name" required defaultValue={t?.name} />
        <TextField name="location" label="Location" defaultValue={t?.location} />
      </div>
      <TextAreaField name="quote" label="Testimonial (customer's own words)" required rows={4} defaultValue={t?.quote} />
      <TextField name="sortOrder" label="Sort order" type="number" defaultValue={t?.sortOrder ?? 0} />
      <Toggle name="confirmGenuine" label="I confirm this is a genuine testimonial" hint="Given by a real customer, who agreed to it being published" />
      <Toggle name="isPublished" label="Published" defaultChecked={t?.isPublished ?? false} />
    </div>
  );
}

export default async function AdminTestimonials() {
  await requirePageUser();
  const items = await db.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <AdminPageHeader title="Testimonials" description="Only genuine customer testimonials, with the customer's permission. The homepage section stays hidden until at least one is published." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Add testimonial">
          <ActionForm action={saveTestimonial} submitLabel="Save" resetOnSuccess>
            <Fields />
          </ActionForm>
        </Panel>
        <div className="space-y-3 xl:col-span-2">
          {items.length === 0 ? <EmptyState title="No testimonials yet" text="Add real feedback from customers when you have it." /> : null}
          {items.map((t) => (
            <details key={t.id} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-forest/5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="block italic text-ink/80">“{t.quote}”</span>
                  <span className="mt-1 block text-sm font-semibold text-deep">{t.name}{t.location ? ` · ${t.location}` : ""}</span>
                </span>
                <Pill className={t.isPublished ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-700"}>{t.isPublished ? "Published" : "Hidden"}</Pill>
              </summary>
              <ActionForm action={saveTestimonial} submitLabel="Save" className="mt-5 border-t border-forest/5 pt-5">
                <input type="hidden" name="id" value={t.id} />
                <Fields t={t} />
              </ActionForm>
              <div className="mt-3">
                <ActionButton action={deleteTestimonial.bind(null, t.id)} confirm="Confirm delete" tone="danger">Delete</ActionButton>
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
