import Image from "next/image";
import { deleteGalleryImage, updateGalleryImage, uploadGalleryImages } from "@/actions/admin/content";
import { ActionForm, FieldMsg } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/confirm-action";
import { SelectField, TextField, Toggle } from "@/components/admin/fields";
import { ImagePicker } from "@/components/admin/image-picker";
import { AdminPageHeader, EmptyState, Panel, Pill } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { galleryCategories, galleryCategoryLabels } from "@/lib/labels";

const categoryOptions = galleryCategories.map((c) => ({ value: c, label: galleryCategoryLabels[c] }));

export default async function AdminGallery() {
  await requirePageUser();
  const images = await db.galleryImage.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      <AdminPageHeader title="Gallery" description="Upload and organise website photographs. Mark reference images that are not Ganesh Nursery's own photos." />
      <Panel title="Upload images" className="mb-8">
        <ActionForm action={uploadGalleryImages} submitLabel="Upload" resetOnSuccess>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <ImagePicker name="files" multiple />
              <FieldMsg name="files" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField name="alt" label="Alt text (describe the photo)" required className="sm:col-span-2" />
              <TextField name="caption" label="Caption" className="sm:col-span-2" />
              <SelectField name="category" label="Category" defaultValue="NURSERY" options={categoryOptions} />
              <TextField name="sortOrder" label="Sort order" type="number" defaultValue={0} />
              <Toggle name="isCompanyPhoto" label="Genuine Ganesh Nursery photo" hint="Untick for stock / illustrative images" defaultChecked />
              <Toggle name="isPublished" label="Published" defaultChecked />
            </div>
          </div>
        </ActionForm>
      </Panel>

      {images.length === 0 ? (
        <EmptyState title="No images yet" text="Upload your first photographs above." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest/5">
              <div className="relative aspect-[4/3] bg-cream">
                <Image src={img.url} alt={img.alt} fill sizes="(min-width:1280px) 30vw, 50vw" className="object-cover" />
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <Pill className="bg-ivory/90 text-forest">{galleryCategoryLabels[img.category]}</Pill>
                  {!img.isCompanyPhoto ? <Pill className="bg-black/60 text-white">Illustrative</Pill> : null}
                  {!img.isPublished ? <Pill className="bg-stone-200 text-stone-700">Hidden</Pill> : null}
                </div>
              </div>
              <details className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-deep">
                  <span className="truncate pr-3">{img.caption ?? img.alt}</span>
                  <span className="text-leaf group-open:hidden">Edit</span>
                  <span className="hidden text-leaf group-open:inline">Close</span>
                </summary>
                <ActionForm action={updateGalleryImage} submitLabel="Save" className="mt-4 space-y-3">
                  <input type="hidden" name="id" value={img.id} />
                  <TextField name="alt" label="Alt text" required defaultValue={img.alt} />
                  <TextField name="caption" label="Caption" defaultValue={img.caption} />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField name="category" label="Category" defaultValue={img.category} options={categoryOptions} />
                    <TextField name="sortOrder" label="Order" type="number" defaultValue={img.sortOrder} />
                  </div>
                  <Toggle name="isCompanyPhoto" label="Genuine company photo" defaultChecked={img.isCompanyPhoto} />
                  <Toggle name="isPublished" label="Published" defaultChecked={img.isPublished} />
                </ActionForm>
                <div className="mt-3 border-t border-forest/5 pt-3">
                  <ActionButton action={deleteGalleryImage.bind(null, img.id)} confirm="Confirm delete" tone="danger">Delete image</ActionButton>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
