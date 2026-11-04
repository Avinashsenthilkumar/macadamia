import Link from "next/link";
import { Plus } from "lucide-react";
import { deleteCategory, deletePost, saveCategory, togglePostStatus } from "@/actions/admin/blog";
import { ActionForm } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/confirm-action";
import { TextField } from "@/components/admin/fields";
import { AdminPageHeader, EmptyState, Panel, Pill, Table } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/button";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminBlog() {
  const user = await requirePageUser();
  const [posts, categories] = await Promise.all([
    db.blogPost.findMany({ orderBy: [{ updatedAt: "desc" }], include: { category: true } }),
    db.blogCategory.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Write, publish and organise knowledge-centre articles."
        actions={
          <Link href="/admin/blog/new" className={buttonClasses({ size: "sm" })}>
            <Plus className="h-4 w-4" /> New article
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {posts.length === 0 ? (
            <EmptyState title="No articles yet" href="/admin/blog/new" cta="Write an article" />
          ) : (
            <Table head={["Article", "Category", "Status", "Updated", ""]}>
              {posts.map((p) => (
                <tr key={p.id} className="transition hover:bg-cream/40">
                  <td className="px-5 py-4">
                    <Link href={`/admin/blog/${p.id}`} className="font-semibold text-deep hover:text-leaf">{p.title}</Link>
                    <span className="block text-xs text-ink/45">/blog/{p.slug} · {p.readingMinutes} min</span>
                  </td>
                  <td className="px-5 py-4 text-ink/70">{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-4">
                    <Pill className={p.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-700"}>{p.status === "PUBLISHED" ? "Published" : "Draft"}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink/60">{formatDate(p.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton action={togglePostStatus.bind(null, p.id)}>{p.status === "PUBLISHED" ? "Unpublish" : "Publish"}</ActionButton>
                      {user.role === "ADMIN" ? (
                        <ActionButton action={deletePost.bind(null, p.id)} confirm="Confirm delete" tone="danger">Delete</ActionButton>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </div>
        <Panel title="Categories">
          <ActionForm action={saveCategory} submitLabel="Add category" resetOnSuccess>
            <div className="space-y-3">
              <TextField name="name" label="Name" required />
              <TextField name="description" label="Description" />
            </div>
          </ActionForm>
          <ul className="mt-6 divide-y divide-forest/5">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <span>
                  <span className="font-semibold text-deep">{c.name}</span>
                  <span className="ml-2 text-xs text-ink/45">{c._count.posts} article{c._count.posts === 1 ? "" : "s"}</span>
                </span>
                {user.role === "ADMIN" ? (
                  <ActionButton action={deleteCategory.bind(null, c.id)} confirm="Confirm" tone="danger">Delete</ActionButton>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
