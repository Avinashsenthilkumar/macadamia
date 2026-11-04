import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { deleteProduct } from "@/actions/admin/products";
import { ActionButton } from "@/components/admin/confirm-action";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const sp = await searchParams;
  const product = await db.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } });
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/products" className="text-sm font-semibold text-leaf">← Products</Link>
      <AdminPageHeader
        title={product.name}
        description={`Last updated ${product.updatedAt.toLocaleString("en-IN")}`}
        actions={
          <>
            {product.isPublished ? (
              <Link href={`/macadamia-plants/${product.slug}`} target="_blank" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                <ExternalLink className="h-4 w-4" /> View
              </Link>
            ) : null}
            {user.role === "ADMIN" ? (
              <ActionButton action={deleteProduct.bind(null, product.id)} confirm="Click to confirm delete" tone="danger">
                Delete product
              </ActionButton>
            ) : null}
          </>
        }
      />
      {sp.created ? <p className="mb-6 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">Product created.</p> : null}
      <ProductForm product={{ ...product, price: product.price ? product.price.toString() : null }} />
    </>
  );
}
