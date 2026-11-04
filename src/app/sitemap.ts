import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { db, safeQuery } from "@/lib/db";
import { fallbackPosts } from "@/lib/fallbacks";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/macadamia-plants", priority: 0.9, changeFrequency: "weekly" },
    { path: "/why-macadamia", priority: 0.8, changeFrequency: "monthly" },
    { path: "/cultivation-guide", priority: 0.8, changeFrequency: "monthly" },
    { path: "/plantation-services", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  const [products, posts] = await Promise.all([
    safeQuery(() => db.product.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }), [], "sitemap products"),
    safeQuery(
      () => db.blogPost.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: now } }, select: { slug: true, updatedAt: true } }),
      [],
      "sitemap posts",
    ),
  ]);

  return [
    ...staticRoutes.map((r) => ({ url: `${SITE_URL}${r.path}`, lastModified: now, changeFrequency: r.changeFrequency, priority: r.priority })),
    ...products.map((p) => ({ url: `${SITE_URL}/macadamia-plants/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...(posts.length ? posts : fallbackPosts).map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
