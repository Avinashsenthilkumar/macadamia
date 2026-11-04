"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { idFrom, revalidatePublic, runAction, type ActionState } from "@/lib/admin-action";
import { optionalImage } from "@/lib/upload";
import { readingTime, slugify } from "@/lib/utils";
import { blogCategorySchema, blogPostSchema, formToObject } from "@/lib/validations/admin";

async function uniquePostSlug(base: string, excludeId?: string) {
  let slug = base || "article";
  for (let i = 2; i < 50; i++) {
    const clash = await db.blogPost.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) }, select: { id: true } });
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const result = await runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    const v = blogPostSchema.parse(formToObject(formData));
    const existing = id ? await db.blogPost.findUnique({ where: { id }, select: { slug: true, publishedAt: true, coverImage: true } }) : null;
    if (id && !existing) return { ok: false, message: "This article no longer exists." };

    const slug = await uniquePostSlug(v.slug ?? slugify(v.title), id ?? undefined);
    const cover = await optionalImage(formData, "coverImage", "blog");
    const removeCover = formData.get("removeCover") === "on";
    const categoryId = v.categoryId && (await db.blogCategory.findUnique({ where: { id: v.categoryId }, select: { id: true } })) ? v.categoryId : null;

    const data = {
      title: v.title,
      slug,
      excerpt: v.excerpt,
      content: v.content,
      categoryId,
      authorName: v.authorName ?? "Ganesh Nursery Team",
      coverAlt: v.coverAlt ?? null,
      coverImage: cover ?? (removeCover ? null : existing?.coverImage ?? null),
      status: v.status,
      publishedAt: v.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null),
      readingMinutes: readingTime(v.content),
      seoTitle: v.seoTitle ?? null,
      seoDescription: v.seoDescription ?? null,
    };

    const post = id
      ? await db.blogPost.update({ where: { id }, data })
      : await db.blogPost.create({ data: { ...data, authorId: user.id } });

    await audit(user, id ? "update" : "create", "BlogPost", post.id, { title: post.title, status: post.status });
    revalidatePublic("/blog", `/blog/${post.slug}`, ...(existing && existing.slug !== post.slug ? [`/blog/${existing.slug}`] : []));
    return { ok: true, message: id ? "Article saved." : "Article created.", redirectTo: id ? undefined : `/admin/blog/${post.id}?created=1` };
  });
  if (result?.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}

export async function deletePost(id: string): Promise<ActionState> {
  const result = await runAction(async () => {
    const user = await requireUser("ADMIN");
    const p = await db.blogPost.delete({ where: { id } });
    await audit(user, "delete", "BlogPost", id, { title: p.title });
    revalidatePublic("/blog", `/blog/${p.slug}`);
    return { ok: true, message: "Article deleted.", redirectTo: "/admin/blog" };
  });
  if (result?.ok && result.redirectTo) redirect(result.redirectTo);
  return result;
}

export async function togglePostStatus(id: string): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const p = await db.blogPost.findUniqueOrThrow({ where: { id } });
    const next = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await db.blogPost.update({ where: { id }, data: { status: next, publishedAt: next === "PUBLISHED" ? (p.publishedAt ?? new Date()) : p.publishedAt } });
    await audit(user, next === "PUBLISHED" ? "publish" : "unpublish", "BlogPost", id);
    revalidatePublic("/blog", `/blog/${p.slug}`);
    return { ok: true, message: next === "PUBLISHED" ? "Article published." : "Article moved to drafts." };
  });
}

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const id = idFrom(formData);
    const v = blogCategorySchema.parse(formToObject(formData));
    const slug = slugify(v.name);
    const cat = id
      ? await db.blogCategory.update({ where: { id }, data: { name: v.name, slug, description: v.description ?? null } })
      : await db.blogCategory.create({ data: { name: v.name, slug, description: v.description ?? null } });
    await audit(user, id ? "update" : "create", "BlogCategory", cat.id, { name: cat.name });
    revalidatePath("/admin/blog");
    revalidatePublic("/blog");
    return { ok: true, message: "Category saved." };
  });
}

export async function deleteCategory(id: string): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser("ADMIN");
    const c = await db.blogCategory.delete({ where: { id } });
    await audit(user, "delete", "BlogCategory", id, { name: c.name });
    revalidatePath("/admin/blog");
    revalidatePublic("/blog");
    return { ok: true, message: "Category deleted. Its articles are now uncategorised." };
  });
}
