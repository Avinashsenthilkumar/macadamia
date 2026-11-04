/**
 * Safe development / initial-content seed.
 * - Idempotent: uses upserts keyed on slugs / natural keys, so it can be re-run.
 * - Creates NO admin users and NO customer data. Create the first admin with `npm run admin:create`.
 */
import { PrismaClient } from "@prisma/client";
import { seedPosts } from "../src/content/posts";
import { seedFaqs as faqs, seedGallery as gallery, seedOrchard as orchard, seedServices as services } from "../src/content/seed-data";

const db = new PrismaClient();

const readingTime = (t: string) => Math.max(1, Math.round(t.trim().split(/\s+/).length / 200));
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  // Blog categories + posts
  for (const p of seedPosts) {
    const category = await db.blogCategory.upsert({
      where: { slug: slugify(p.category) },
      update: {},
      create: { name: p.category, slug: slugify(p.category) },
    });
    await db.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content.trim(),
        coverImage: p.coverImage,
        coverAlt: p.coverAlt,
        categoryId: category.id,
        authorName: "Ganesh Nursery Team",
        status: "PUBLISHED",
        publishedAt: new Date(),
        readingMinutes: readingTime(p.content),
      },
    });
  }

  // Services
  for (const [i, s] of services.entries()) {
    await db.service.upsert({ where: { slug: slugify(s.title) }, update: {}, create: { ...s, slug: slugify(s.title), sortOrder: i * 10 } });
  }

  // FAQs (only if none exist, so admin edits are never overwritten)
  if ((await db.faq.count()) === 0) {
    await db.faq.createMany({ data: faqs.map((f, i) => ({ ...f, sortOrder: i * 10, isPublished: true })) });
  }

  // Gallery (only if empty)
  if ((await db.galleryImage.count()) === 0) {
    await db.galleryImage.createMany({ data: gallery.map((g, i) => ({ ...g, sortOrder: i * 10, isPublished: true })) });
  }
  // Orchard stills from the growth animation (illustrative) — added once
  if ((await db.galleryImage.count({ where: { url: { startsWith: "/images/orchard/" } } })) === 0) {
    await db.galleryImage.createMany({ data: orchard.map((g, i) => ({ ...g, sortOrder: 200 + i * 10, isPublished: true })) });
  }

  // A general enquiry product — no unverified specifications
  await db.product.upsert({
    where: { slug: "macadamia-plant" },
    update: {},
    create: {
      slug: "macadamia-plant",
      name: "Macadamia Plant",
      shortDescription: "Macadamia saplings raised at Ganesh Nursery. Contact us for current varieties, specifications and pricing.",
      description:
        "Young macadamia plants raised in grow bags at our nursery.\n\nVariety, propagation method, plant age and height vary with current stock, so we confirm these details for every enquiry. Tell us your land location and the number of plants you need, and our team will share what is available.",
      growingInfo:
        "Macadamia generally prefers mild, frost-free subtropical conditions, deep well-drained soil (a pH of roughly 5.0–6.5 is a commonly cited range) and shelter from strong winds. Plan compatible varieties for cross-pollination.",
      propagation: "UNSPECIFIED",
      priceType: "QUOTATION",
      availability: "ON_ENQUIRY",
      isFeatured: true,
      isPublished: true,
      images: {
        create: [
          { url: "/images/gallery/macadamia-sapling-nursery.webp", alt: "Macadamia sapling in a grow bag at the nursery", sortOrder: 0 },
          { url: "/images/gallery/macadamia-sapling-handover.webp", alt: "Macadamia sapling held in its grow bag", sortOrder: 1 },
          { url: "/images/gallery/macadamia-sapling-visit.webp", alt: "Macadamia sapling at a shade-net nursery", sortOrder: 2 },
        ],
      },
    },
  });

  console.log("✔ Seed complete: articles, services, FAQs, gallery and a general product enquiry listing.");
  console.log("  No admin user was created. Run: npm run admin:create");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
