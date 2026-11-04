import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requirePageUser();
  const { id } = await params;
  const sp = await searchParams;
  const [post, categories] = await Promise.all([db.blogPost.findUnique({ where: { id } }), db.blogCategory.findMany({ orderBy: { name: "asc" } })]);
  if (!post) notFound();

  return (
    <>
      <Link href="/admin/blog" className="text-sm font-semibold text-leaf">← Blog</Link>
      <AdminPageHeader
        title={post.title}
        description={post.status === "PUBLISHED" ? "Published" : "Draft"}
        actions={
          post.status === "PUBLISHED" ? (
            <Link href={`/blog/${post.slug}`} target="_blank" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              <ExternalLink className="h-4 w-4" /> View
            </Link>
          ) : null
        }
      />
      {sp.created ? <p className="mb-6 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">Article created.</p> : null}
      <PostForm post={post} categories={categories} />
    </>
  );
}
