import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db, safeQuery } from "@/lib/db";

// ─── Products ───────────────────────────────────────────────────────────

const productInclude = { images: { orderBy: { sortOrder: "asc" } } } satisfies Prisma.ProductInclude;
type ProductWithImages = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

/** Serialisable product shape (Decimal → string) safe to pass to client components */
export type PublicProduct = Omit<ProductWithImages, "price"> & { price: string | null };

function serialiseProduct(p: ProductWithImages): PublicProduct {
  return { ...p, price: p.price ? p.price.toString() : null };
}

export async function getPublishedProducts(opts: { featured?: boolean; take?: number } = {}) {
  return safeQuery(
    async () =>
      (
        await db.product.findMany({
          where: { isPublished: true, ...(opts.featured ? { isFeatured: true } : {}) },
          include: productInclude,
          orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
          take: opts.take,
        })
      ).map(serialiseProduct),
    [] as PublicProduct[],
    "products",
  );
}

export const getProductBySlug = cache(async (slug: string) =>
  safeQuery(
    async () => {
      const p = await db.product.findFirst({ where: { slug, isPublished: true }, include: productInclude });
      return p ? serialiseProduct(p) : null;
    },
    null,
    "product",
  ),
);

export async function getRelatedProducts(excludeId: string, take = 3) {
  return safeQuery(
    async () =>
      (
        await db.product.findMany({
          where: { isPublished: true, id: { not: excludeId } },
          include: productInclude,
          orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
          take,
        })
      ).map(serialiseProduct),
    [] as PublicProduct[],
    "related products",
  );
}

export async function getProductOptions() {
  return safeQuery(
    () => db.product.findMany({ where: { isPublished: true }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } }),
    [] as { id: string; name: string }[],
    "product options",
  );
}

// ─── Services ───────────────────────────────────────────────────────────

export async function getPublishedServices() {
  return safeQuery(
    () => db.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    [],
    "services",
  );
}

// ─── Blog ───────────────────────────────────────────────────────────────

const postInclude = { category: true } satisfies Prisma.BlogPostInclude;
export type PublicPost = Prisma.BlogPostGetPayload<{ include: typeof postInclude }>;

export async function getPublishedPosts(opts: { q?: string; category?: string; take?: number; skip?: number } = {}) {
  const where: Prisma.BlogPostWhereInput = {
    status: "PUBLISHED",
    publishedAt: { lte: new Date() },
    ...(opts.category ? { category: { slug: opts.category } } : {}),
    ...(opts.q
      ? {
          OR: [
            { title: { contains: opts.q, mode: "insensitive" } },
            { excerpt: { contains: opts.q, mode: "insensitive" } },
            { content: { contains: opts.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  return safeQuery(
    async () => {
      const [posts, total] = await Promise.all([
        db.blogPost.findMany({ where, include: postInclude, orderBy: { publishedAt: "desc" }, take: opts.take, skip: opts.skip }),
        db.blogPost.count({ where }),
      ]);
      return { posts, total };
    },
    { posts: [] as PublicPost[], total: 0 },
    "posts",
  );
}

export const getPostBySlug = cache(async (slug: string) =>
  safeQuery(
    () =>
      db.blogPost.findFirst({
        where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
        include: postInclude,
      }),
    null,
    "post",
  ),
);

export async function getRelatedPosts(post: { id: string; categoryId: string | null }, take = 3) {
  return safeQuery(
    () =>
      db.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          publishedAt: { lte: new Date() },
          id: { not: post.id },
          ...(post.categoryId ? { categoryId: post.categoryId } : {}),
        },
        include: postInclude,
        orderBy: { publishedAt: "desc" },
        take,
      }),
    [] as PublicPost[],
    "related posts",
  );
}

export async function getBlogCategories() {
  return safeQuery(
    () =>
      db.blogCategory.findMany({
        where: { posts: { some: { status: "PUBLISHED" } } },
        orderBy: { name: "asc" },
      }),
    [],
    "categories",
  );
}

// ─── Gallery, FAQ, testimonials ─────────────────────────────────────────

export async function getGalleryImages(take?: number) {
  return safeQuery(
    () =>
      db.galleryImage.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take,
      }),
    [],
    "gallery",
  );
}

export async function getPublishedFaqs(take?: number) {
  return safeQuery(
    () => db.faq.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], take }),
    [],
    "faqs",
  );
}

export async function getPublishedTestimonials() {
  return safeQuery(
    () => db.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    [],
    "testimonials",
  );
}
