import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { getBlogCategories, getPublishedPosts } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export const metadata: Metadata = pageMetadata({
  title: "Macadamia Knowledge Centre — Blog",
  description: "Articles on macadamia farming, planting material, soil, irrigation, pollination and plantation planning in India from Ganesh Nursery.",
  path: "/blog",
});

type SP = Promise<{ q?: string; category?: string; page?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const category = sp.category?.slice(0, 80);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const [{ posts, total }, categories] = await Promise.all([
    getPublishedPosts({ q: q || undefined, category, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    getBlogCategories(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showFeatured = page === 1 && !q && !category && posts.length > 0;
  const [first, ...rest] = posts;

  const qs = (params: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <>
      <PageHero
        eyebrow="Blog & Knowledge Centre"
        title="Learn before you plant."
        description="Practical, referenced articles on macadamia — written to help you ask better questions."
        image="/images/gallery/nursery-field-care.webp"
        imageAlt="A nursery worker tending young plants in a field"
        crumbs={[{ name: "Blog", path: "/blog" }]}
      />

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Categories" className="flex flex-wrap gap-2">
              <Link href={qs({ q })} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", !category ? "bg-forest text-ivory" : "text-forest ring-1 ring-forest/15 hover:bg-forest/5")}>
                All
              </Link>
              {categories.map((c) => (
                <Link key={c.id} href={qs({ q, category: c.slug })} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", category === c.slug ? "bg-forest text-ivory" : "text-forest ring-1 ring-forest/15 hover:bg-forest/5")}>
                  {c.name}
                </Link>
              ))}
            </nav>
            <form action="/blog" method="get" role="search" className="relative w-full lg:w-80">
              {category ? <input type="hidden" name="category" value={category} /> : null}
              <label htmlFor="blog-q" className="sr-only">Search articles</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" aria-hidden />
              <input id="blog-q" name="q" type="search" defaultValue={q} placeholder="Search articles" className="h-12 w-full rounded-full border border-forest/15 bg-white pl-11 pr-4 text-sm shadow-soft focus:border-leaf focus:outline-none focus:ring-4 focus:ring-sage/30" />
            </form>
          </Reveal>

          {q ? (
            <p className="mb-8 text-ink/70" aria-live="polite">
              {total} result{total === 1 ? "" : "s"} for “{q}”.{" "}
              <Link href={qs({ category })} className="font-semibold text-leaf underline underline-offset-4">
                Clear search
              </Link>
            </p>
          ) : null}

          {posts.length === 0 ? (
            <div className="rounded-[2rem] bg-cream p-12 text-center text-ink/70">No articles found. Try a different search or category.</div>
          ) : (
            <>
              {showFeatured && first ? (
                <Reveal className="mb-10">
                  <PostCard post={first} featured />
                </Reveal>
              ) : null}
              <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(showFeatured ? rest : posts).map((p) => (
                  <StaggerItem key={p.id}>
                    <PostCard post={p} />
                  </StaggerItem>
                ))}
              </Stagger>
            </>
          )}

          {pages > 1 ? (
            <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={qs({ q, category, page: n > 1 ? String(n) : undefined })}
                  aria-current={n === page ? "page" : undefined}
                  className={cn("grid h-11 w-11 place-items-center rounded-full text-sm font-semibold transition", n === page ? "bg-forest text-ivory" : "text-forest ring-1 ring-forest/15 hover:bg-forest/5")}
                >
                  {n}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
