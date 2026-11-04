import { deleteService, saveService } from "@/actions/admin/content";
import { ActionForm } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/confirm-action";
import { SelectField, TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { AdminPageHeader, EmptyState, Panel, Pill } from "@/components/admin/ui";
import { Icon, iconNames } from "@/components/ui/icon";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

const iconOptions = iconNames.map((n) => ({ value: n, label: n }));

function ServiceFields({ s }: { s?: { title: string; slug: string; summary: string; description: string; icon: string; isAvailable: boolean; isPublished: boolean; sortOrder: number } }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="title" label="Title" required defaultValue={s?.title} />
        <TextField name="slug" label="Slug" defaultValue={s?.slug} hint="Auto-generated if blank" />
      </div>
      <TextField name="summary" label="Summary" required defaultValue={s?.summary} />
      <TextAreaField name="description" label="Description" required rows={4} defaultValue={s?.description} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField name="icon" label="Icon" defaultValue={s?.icon ?? "sprout"} options={iconOptions} />
        <TextField name="sortOrder" label="Sort order" type="number" defaultValue={s?.sortOrder ?? 0} />
      </div>
      <Toggle name="isAvailable" label="Confirmed available" hint="Only tick once Ganesh Nursery confirms it provides this service" defaultChecked={s?.isAvailable ?? false} />
      <Toggle name="isPublished" label="Show on website" defaultChecked={s?.isPublished ?? false} />
    </div>
  );
}

export default async function AdminServices() {
  const user = await requirePageUser();
  const services = await db.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <AdminPageHeader title="Plantation services" description="Do not mark a service as available until Ganesh Nursery confirms it." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Add a service">
          <ActionForm action={saveService} submitLabel="Add service" resetOnSuccess>
            <ServiceFields />
          </ActionForm>
        </Panel>
        <div className="space-y-3 xl:col-span-2">
          {services.length === 0 ? <EmptyState title="No services yet" /> : null}
          {services.map((s) => (
            <details key={s.id} className="group rounded-3xl bg-white p-5 shadow-soft ring-1 ring-forest/5">
              <summary className="flex cursor-pointer list-none items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest text-ivory"><Icon name={s.icon} className="h-5 w-5" /></span>
                <span className="flex-1">
                  <span className="block font-semibold text-deep">{s.title}</span>
                  <span className="text-sm text-ink/55">{s.summary}</span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <Pill className={s.isAvailable ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}>{s.isAvailable ? "Confirmed" : "Unconfirmed"}</Pill>
                  <Pill className={s.isPublished ? "bg-sky-100 text-sky-900" : "bg-stone-200 text-stone-700"}>{s.isPublished ? "Visible" : "Hidden"}</Pill>
                </span>
              </summary>
              <ActionForm action={saveService} submitLabel="Save" className="mt-5 border-t border-forest/5 pt-5">
                <input type="hidden" name="id" value={s.id} />
                <ServiceFields s={s} />
              </ActionForm>
              {user.role === "ADMIN" ? (
                <div className="mt-3">
                  <ActionButton action={deleteService.bind(null, s.id)} confirm="Confirm delete" tone="danger">Delete</ActionButton>
                </div>
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
