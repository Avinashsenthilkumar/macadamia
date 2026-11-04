import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db, safeQuery } from "@/lib/db";
import { fallbackCategories, fallbackFaqs, fallbackGallery, fallbackPosts, fallbackServices, filterFallbackPosts } from "@/lib/fallbacks";

/** True when the database has no published posts at all (or is unreachable) → use built-in articles */
const usingFallbackPosts = cache(async () =>
  safeQuery(async () => (await db.blogPost.count({ where: { status: "PUBLISHED" } })) === 0, true, "post count"),
);

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
  const rows = await safeQuery(() => db.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }), [], "services");
  return rows.length ? rows : fallbackServices;
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
  if (await usingFallbackPosts()) {
    const all = filterFallbackPosts(opts);
    const skip = opts.skip ?? 0;
    return { posts: all.slice(skip, opts.take ? skip + opts.take : undefined), total: all.length };
  }
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

export const getPostBySlug = cache(async (slug: string): Promise<PublicPost | null> => {
  if (await usingFallbackPosts()) return fallbackPosts.find((p) => p.slug === slug) ?? null;
  return safeQuery(
    () =>
      db.blogPost.findFirst({
        where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
        include: postInclude,
      }),
    null,
    "post",
  );
});

export async function getRelatedPosts(post: { id: string; categoryId: string | null }, take = 3) {
  if (post.id.startsWith("static-")) {
    const same = fallbackPosts.filter((p) => p.id !== post.id && p.categoryId === post.categoryId);
    const others = fallbackPosts.filter((p) => p.id !== post.id && p.categoryId !== post.categoryId);
    return [...same, ...others].slice(0, take);
  }
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
  if (await usingFallbackPosts()) return fallbackCategories;
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
  const rows = await safeQuery(
    () =>
      db.galleryImage.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take,
      }),
    [],
    "gallery",
  );
  return rows.length ? rows : fallbackGallery.slice(0, take);
}

export async function getPublishedFaqs(take?: number) {
  const rows = await safeQuery(
    () => db.faq.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], take }),
    [],
    "faqs",
  );
  return rows.length ? rows : fallbackFaqs.slice(0, take);
}

export async function getPublishedTestimonials() {
  return safeQuery(
    () => db.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    [],
    "testimonials",
  );
}
