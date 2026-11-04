/**
 * Built-in content used when the database has no rows yet (e.g. before `npm run db:seed`
 * has been run on production), so public pages are never empty.
 * Admin-created content always takes priority over these fallbacks.
 */
import type { BlogCategory, Faq, GalleryImage, Prisma, Service } from "@prisma/client";
import { seedPosts } from "@/content/posts";
import { seedFaqs, seedGallery, seedOrchard, seedServices } from "@/content/seed-data";
import { readingTime, slugify } from "@/lib/utils";

const STAMP = new Date("2026-11-01T00:00:00.000Z");

type PostWithCategory = Prisma.BlogPostGetPayload<{ include: { category: true } }>;
type GalleryRow = GalleryImage;
type FaqRow = Faq;
type ServiceRow = Service;
type CategoryRow = BlogCategory;

export const fallbackCategories: CategoryRow[] = [...new Set(seedPosts.map((p) => p.category))].map((name) => ({
  id: `static-cat-${slugify(name)}`,
  name,
  slug: slugify(name),
  description: null,
  createdAt: STAMP,
  updatedAt: STAMP,
}));

export const fallbackPosts: PostWithCategory[] = seedPosts.map((p, i) => {
  const category = fallbackCategories.find((c) => c.name === p.category) ?? null;
  // Stagger dates so the newest-first order is stable
  const date = new Date(STAMP.getTime() - i * 86_400_000);
  return {
    id: `static-post-${p.slug}`,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content.trim(),
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    categoryId: category?.id ?? null,
    category,
    authorId: null,
    authorName: "Ganesh Nursery Team",
    status: "PUBLISHED",
    publishedAt: date,
    readingMinutes: readingTime(p.content),
    seoTitle: null,
    seoDescription: null,
    createdAt: date,
    updatedAt: date,
  } as PostWithCategory;
});

export const fallbackGallery: GalleryRow[] = [...seedGallery, ...seedOrchard].map((g, i) => ({
  id: `static-img-${i}`,
  ...g,
  isPublished: true,
  sortOrder: i * 10,
  createdAt: STAMP,
  updatedAt: STAMP,
}));

export const fallbackFaqs: FaqRow[] = seedFaqs.map((f, i) => ({
  id: `static-faq-${i}`,
  ...f,
  isPublished: true,
  sortOrder: i * 10,
  createdAt: STAMP,
  updatedAt: STAMP,
}));

export const fallbackServices: ServiceRow[] = seedServices
  .filter((s) => s.isPublished)
  .map((s, i) => ({
    id: `static-svc-${i}`,
    slug: slugify(s.title),
    ...s,
    sortOrder: i * 10,
    createdAt: STAMP,
    updatedAt: STAMP,
  }));

/** Filters fallback posts the same way the database query would */
export function filterFallbackPosts(opts: { q?: string; category?: string }) {
  const q = opts.q?.toLowerCase();
  return fallbackPosts.filter(
    (p) =>
      (!opts.category || p.category?.slug === opts.category) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)),
  );
}
