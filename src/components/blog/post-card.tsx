import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { PublicPost } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, featured = false }: { post: PublicPost; featured?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-forest/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift ${featured ? "lg:flex-row" : ""}`}>
      <div className={`relative overflow-hidden bg-cream ${featured ? "aspect-[16/10] lg:aspect-auto lg:w-3/5" : "aspect-[16/10]"}`}>
        <Image
          src={post.coverImage ?? "/images/orchard/macadamia-orchard-rows.webp"}
          alt={post.coverAlt ?? post.title}
          fill
          sizes={featured ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        {post.category ? <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-bold text-forest backdrop-blur">{post.category.name}</span> : null}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:justify-center lg:p-12" : ""}`}>
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink/50">
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min read
          </span>
        </p>
        <h3 className={`mt-3 font-display leading-tight text-forest ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
          <Link href={href} className="bg-gradient-to-r from-sage to-sage bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 after:absolute after:inset-0 group-hover:bg-[length:100%_2px]">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-ink/70">{post.excerpt}</p>
        <span className="mt-auto pt-6 text-sm font-semibold text-leaf">
          Read article <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </article>
  );
}
