import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";

export default async function NewProductPage() {
  await requirePageUser();
  return (
    <>
      <Link href="/admin/products" className="text-sm font-semibold text-leaf">← Products</Link>
      <AdminPageHeader title="Add product" />
      <ProductForm product={null} />
    </>
  );
}
