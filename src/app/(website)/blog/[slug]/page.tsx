import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDays, Clock, PenLine } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/layout/cta-band";
import { PostCard } from "@/components/blog/post-card";
import { ArticleProgress } from "@/components/blog/reading-progress";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppIcon } from "@/components/layout/whatsapp-float";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts({ take: 100 });
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const shareText = `${post.title} — ${absoluteUrl(`/blog/${post.slug}`)}`;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          image: post.coverImage,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.authorName,
        })}
      />
      <PageHero
        eyebrow={post.category?.name ?? "Knowledge Centre"}
        title={post.title}
        description={post.excerpt}
        image={post.coverImage ?? "/images/orchard/macadamia-orchard-rows.webp"}
        imageAlt={post.coverAlt ?? post.title}
        crumbs={[
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      >
        <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ivory/75">
          <span className="flex items-center gap-2"><PenLine className="h-4 w-4 text-sage" /> {post.authorName}</span>
          <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sage" /> <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time></span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-sage" /> {post.readingMinutes} min read</span>
        </p>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          {post.coverImage ? (
            <ImageReveal className="relative mx-auto mb-14 aspect-[16/8] max-w-5xl rounded-[2rem] shadow-lift">
              <Image src={post.coverImage} alt={post.coverAlt ?? post.title} fill priority sizes="(min-width:1024px) 64rem, 100vw" className="object-cover" />
            </ImageReveal>
          ) : null}
          <ArticleProgress>
            <Reveal className="prose-gn mx-auto max-w-3xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) =>
                    href?.startsWith("/") ? (
                      <Link href={href}>{children}</Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table>{children}</table>
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
              <hr className="my-10 border-forest/10" />
              <div className="not-prose flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ink/60">Last updated {formatDate(post.updatedAt)}</p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f9d55] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-[#178347]"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Share on WhatsApp
                </a>
              </div>
            </Reveal>
          </ArticleProgress>
        </div>
      </section>

      {related.length ? (
        <section className="bg-cream py-20 sm:py-24">
          <div className="container-x">
            <h2 className="font-display text-4xl text-forest">Related articles</h2>
            <Stagger className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <PostCard post={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      <CtaBand whatsappNumber={settings.whatsappNumber} />
    </>
  );
}
