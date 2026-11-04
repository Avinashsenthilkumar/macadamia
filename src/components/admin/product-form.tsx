import Image from "next/image";
import type { Product, ProductImage } from "@prisma/client";
import { saveProduct } from "@/actions/admin/products";
import { ActionForm, FieldMsg } from "@/components/admin/action-form";
import { SelectField, TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { ImagePicker } from "@/components/admin/image-picker";
import { Panel } from "@/components/admin/ui";
import { availabilities, availabilityLabels, priceTypeLabels, priceTypes, propagationLabels, propagations } from "@/lib/labels";

type P = (Omit<Product, "price"> & { price: string | null; images: ProductImage[] }) | null;

export function ProductForm({ product }: { product: P }) {
  return (
    <ActionForm action={saveProduct} submitLabel={product ? "Save changes" : "Create product"} className="space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Basic information" description="Only enter specifications that Ganesh Nursery has verified. Leave anything uncertain blank — it will not be shown.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="name" label="Product name" required defaultValue={product?.name} className="sm:col-span-2" />
              <TextField name="slug" label="URL slug" defaultValue={product?.slug} hint="Leave blank to generate from the name" />
              <TextField name="scientificName" label="Scientific name" defaultValue={product?.scientificName} hint="Only if verified, e.g. Macadamia integrifolia" />
              <TextField name="variety" label="Variety" defaultValue={product?.variety} hint="Only if verified" />
              <TextField name="shortDescription" label="Short description" defaultValue={product?.shortDescription} maxLength={240} hint="Shown on product cards (max 240 characters)" />
              <TextAreaField name="description" label="Description" required rows={8} defaultValue={product?.description} className="sm:col-span-2" hint="Markdown supported (## headings, **bold**, - lists)" />
              <TextAreaField name="growingInfo" label="Growing information" rows={5} defaultValue={product?.growingInfo} className="sm:col-span-2" hint="Optional. Markdown supported." />
            </div>
          </Panel>

          <Panel title="Specifications">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField name="propagation" label="Grafted / seed-grown" defaultValue={product?.propagation ?? "UNSPECIFIED"} options={propagations.map((p) => ({ value: p, label: propagationLabels[p] }))} />
              <TextField name="propagationMethod" label="Propagation method details" defaultValue={product?.propagationMethod} placeholder="e.g. Side-veneer graft" />
              <TextField name="plantAge" label="Plant age" defaultValue={product?.plantAge} placeholder="e.g. 8–10 months" />
              <TextField name="plantHeight" label="Plant height" defaultValue={product?.plantHeight} placeholder="e.g. 1.5–2 ft" />
              <TextField name="containerSize" label="Container / grow bag" defaultValue={product?.containerSize} placeholder="e.g. 8 × 10 in grow bag" />
            </div>
          </Panel>

          <Panel title="Images" description="The first image is used on cards and for sharing.">
            {product?.images.length ? (
              <ul className="mb-6 grid gap-4 sm:grid-cols-2">
                {product.images.map((img) => (
                  <li key={img.id} className="flex gap-4 rounded-2xl border border-forest/10 p-3">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <Image src={img.url} alt={img.alt} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-semibold text-ink/60">
                        Alt text
                        <input name={`alt_${img.id}`} defaultValue={img.alt} className="mt-1 h-9 w-full rounded-lg border border-forest/15 px-2 text-sm" />
                      </label>
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-semibold text-ink/60">
                          Order
                          <input name={`order_${img.id}`} type="number" min={0} max={99} defaultValue={img.sortOrder} className="ml-2 h-8 w-16 rounded-lg border border-forest/15 px-2 text-sm" />
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                          <input type="checkbox" name="removeImage" value={img.id} className="accent-red-600" /> Remove
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            <ImagePicker name="images" multiple label="Add product photos" />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Visibility">
            <div className="space-y-3">
              <Toggle name="isPublished" label="Published" hint="Visible on the website" defaultChecked={product?.isPublished ?? false} />
              <Toggle name="isFeatured" label="Featured" hint="Shown first and on the homepage" defaultChecked={product?.isFeatured ?? false} />
              <TextField name="sortOrder" label="Sort order" type="number" defaultValue={product?.sortOrder ?? 0} hint="Lower numbers appear first" />
            </div>
          </Panel>

          <Panel title="Pricing & stock">
            <div className="space-y-4">
              <SelectField name="priceType" label="Pricing" defaultValue={product?.priceType ?? "ON_REQUEST"} options={priceTypes.map((p) => ({ value: p, label: priceTypeLabels[p] }))} />
              <div className="grid grid-cols-2 gap-3">
                <TextField name="price" label="Price (₹)" type="number" defaultValue={product?.price} />
                <TextField name="priceUnit" label="Unit" defaultValue={product?.priceUnit} placeholder="per plant" />
              </div>
              <Toggle name="showPrice" label="Show price on website" hint="Also requires prices to be enabled in Website Settings" defaultChecked={product?.showPrice ?? false} />
              <SelectField name="availability" label="Availability" defaultValue={product?.availability ?? "ON_ENQUIRY"} options={availabilities.map((a) => ({ value: a, label: availabilityLabels[a] }))} />
              <TextField name="stockQuantity" label="Stock quantity" type="number" defaultValue={product?.stockQuantity} hint="Optional. Shown on the product page when set." />
            </div>
          </Panel>

          <Panel title="SEO">
            <div className="space-y-4">
              <TextField name="seoTitle" label="SEO title" defaultValue={product?.seoTitle} maxLength={70} hint="Max 70 characters" />
              <TextAreaField name="seoDescription" label="SEO description" rows={3} defaultValue={product?.seoDescription} hint="Max 170 characters" />
            </div>
          </Panel>
          <FieldMsg name="form" />
        </div>
      </div>
    </ActionForm>
  );
}
