import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { deleteProduct, toggleProductFlag } from "@/actions/admin/products";
import { ActionButton } from "@/components/admin/confirm-action";
import { AdminPageHeader, EmptyState, Pill, Table } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { availabilityLabels, priceTypeLabels } from "@/lib/labels";
import { availabilityTone } from "@/lib/products";
import { formatINR } from "@/lib/utils";

export default async function AdminProducts() {
  const user = await requirePageUser();
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, _count: { select: { enquiries: true } } },
  });

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Manage macadamia plant listings. Leave unverified specifications blank."
        actions={
          <Link href="/admin/products/new" className={buttonClasses({ size: "sm" })}>
            <Plus className="h-4 w-4" /> Add product
          </Link>
        }
      />
      {products.length === 0 ? (
        <EmptyState title="No products yet" text="Add your first macadamia plant listing." href="/admin/products/new" cta="Add product" />
      ) : (
        <Table head={["Product", "Availability", "Price", "Enquiries", "Status", ""]}>
          {products.map((p) => (
            <tr key={p.id} className="transition hover:bg-cream/40">
              <td className="px-5 py-4">
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={p.images[0]?.url ?? "/images/orchard/orchard-young-tree.webp"} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block font-semibold text-deep hover:text-leaf">{p.name}</span>
                    <span className="text-xs text-ink/50">/{p.slug}</span>
                  </span>
                </Link>
              </td>
              <td className="px-5 py-4">
                <Pill className={availabilityTone[p.availability]}>{availabilityLabels[p.availability]}</Pill>
                {p.stockQuantity !== null ? <span className="ml-2 text-xs text-ink/50">{p.stockQuantity} in stock</span> : null}
              </td>
              <td className="px-5 py-4 text-ink/70">{p.priceType === "FIXED" && p.price ? `${formatINR(p.price.toString())}${p.showPrice ? "" : " (hidden)"}` : priceTypeLabels[p.priceType]}</td>
              <td className="px-5 py-4 text-ink/70">{p._count.enquiries}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  <Pill className={p.isPublished ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-700"}>{p.isPublished ? "Published" : "Draft"}</Pill>
                  {p.isFeatured ? <Pill className="bg-nut/15 text-nut">Featured</Pill> : null}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <ActionButton action={toggleProductFlag.bind(null, p.id, "isPublished")}>{p.isPublished ? "Unpublish" : "Publish"}</ActionButton>
                  <ActionButton action={toggleProductFlag.bind(null, p.id, "isFeatured")}>{p.isFeatured ? "Unfeature" : "Feature"}</ActionButton>
                  {user.role === "ADMIN" ? (
                    <ActionButton action={deleteProduct.bind(null, p.id)} confirm="Confirm delete" tone="danger">
                      Delete
                    </ActionButton>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
