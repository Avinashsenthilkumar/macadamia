import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function NewPostPage() {
  await requirePageUser();
  const categories = await db.blogCategory.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <Link href="/admin/blog" className="text-sm font-semibold text-leaf">← Blog</Link>
      <AdminPageHeader title="New article" />
      <PostForm post={null} categories={categories} />
    </>
  );
}
