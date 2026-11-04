"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { runAction, revalidatePublic, idFrom, type ActionState } from "@/lib/admin-action";
import { storeImage } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { formToObject, productSchema } from "@/lib/validations/admin";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base || "macadamia-plant";
  for (let i = 2; i < 50; i++) {
    const clash = await db.product.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) }, select: { id: true } });
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const result = await runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    const parsed = productSchema.safeParse(formToObject(formData));
    if (!parsed.success) throw parsed.error;
    const v = parsed.data;

    const existing = id ? await db.product.findUnique({ where: { id }, select: { slug: true } }) : null;
    if (id && !existing) return { ok: false, message: "This product no longer exists." };
    const slug = await uniqueSlug(v.slug ?? slugify(v.name), id ?? undefined);

    const data = {
      name: v.name,
      slug,
      scientificName: v.scientificName ?? null,
      variety: v.variety ?? null,
      shortDescription: v.shortDescription ?? null,
      description: v.description,
      growingInfo: v.growingInfo ?? null,
      propagation: v.propagation,
      propagationMethod: v.propagationMethod ?? null,
      plantAge: v.plantAge ?? null,
      plantHeight: v.plantHeight ?? null,
      containerSize: v.containerSize ?? null,
      priceType: v.priceType,
      price: v.price ?? null,
      priceUnit: v.priceUnit ?? null,
      showPrice: v.showPrice,
      availability: v.availability,
      stockQuantity: v.stockQuantity ?? null,
      isFeatured: v.isFeatured,
      isPublished: v.isPublished,
      sortOrder: v.sortOrder,
      seoTitle: v.seoTitle ?? null,
      seoDescription: v.seoDescription ?? null,
    };

    // Upload new images first so a failed upload doesn't leave a half-saved product
    const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > 8) return { ok: false, message: "Upload at most 8 images at a time." };
    const urls: string[] = [];
    for (const f of files) urls.push(await storeImage(f, "products"));

    const product = await db.$transaction(async (tx) => {
      const saved = id ? await tx.product.update({ where: { id }, data }) : await tx.product.create({ data });

      if (id) {
        // Remove images the admin ticked for deletion
        const remove = formData.getAll("removeImage").filter((x): x is string => typeof x === "string");
        if (remove.length) await tx.productImage.deleteMany({ where: { id: { in: remove }, productId: id } });
        // Update alt text and order of remaining images
        const kept = await tx.productImage.findMany({ where: { productId: id } });
        for (const img of kept) {
          const alt = String(formData.get(`alt_${img.id}`) ?? img.alt).trim().slice(0, 200) || v.name;
          const order = Number(formData.get(`order_${img.id}`) ?? img.sortOrder);
          await tx.productImage.update({ where: { id: img.id }, data: { alt, sortOrder: Number.isFinite(order) ? Math.max(0, Math.min(99, order)) : img.sortOrder } });
        }
      }
      const start = await tx.productImage.count({ where: { productId: saved.id } });
      if (urls.length) {
        await tx.productImage.createMany({
          data: urls.map((url, i) => ({ productId: saved.id, url, alt: `${v.name} — photo ${start + i + 1}`, sortOrder: start + i })),
        });
      }
      return saved;
    });

    await audit(user, id ? "update" : "create", "Product", product.id, { name: product.name, published: product.isPublished });
    revalidatePublic("/macadamia-plants", `/macadamia-plants/${product.slug}`, ...(existing && existing.slug !== product.slug ? [`/macadamia-plants/${existing.slug}`] : []));
    return { ok: true, message: id ? "Product updated." : "Product created.", redirectTo: id ? undefined : `/admin/products/${product.id}?created=1` };
  });
  if (result?.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}

export async function deleteProduct(id: string): Promise<ActionState> {
  const result = await runAction(async () => {
    const user = await requireUser("ADMIN");
    const p = await db.product.delete({ where: { id } });
    await audit(user, "delete", "Product", id, { name: p.name });
    revalidatePublic("/macadamia-plants", `/macadamia-plants/${p.slug}`);
    return { ok: true, message: "Product deleted.", redirectTo: "/admin/products" };
  });
  if (result?.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}

export async function toggleProductFlag(id: string, flag: "isPublished" | "isFeatured"): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const p = await db.product.findUniqueOrThrow({ where: { id }, select: { isPublished: true, isFeatured: true, slug: true } });
    const current = p[flag];
    await db.product.update({ where: { id }, data: { [flag]: !current } });
    await audit(user, `toggle_${flag}`, "Product", id, { value: !current });
    revalidatePublic("/macadamia-plants", `/macadamia-plants/${p.slug}`);
    return { ok: true, message: "Updated." };
  });
}
