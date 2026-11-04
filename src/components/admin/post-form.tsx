import Image from "next/image";
import type { BlogCategory, BlogPost } from "@prisma/client";
import { savePost } from "@/actions/admin/blog";
import { ActionForm } from "@/components/admin/action-form";
import { SelectField, TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { ImagePicker } from "@/components/admin/image-picker";
import { Panel } from "@/components/admin/ui";

export function PostForm({ post, categories }: { post: BlogPost | null; categories: BlogCategory[] }) {
  return (
    <ActionForm action={savePost} submitLabel={post ? "Save article" : "Create article"}>
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel>
            <div className="space-y-5">
              <TextField name="title" label="Title" required defaultValue={post?.title} />
              <TextField name="slug" label="URL slug" defaultValue={post?.slug} hint="Leave blank to generate from the title" />
              <TextAreaField name="excerpt" label="Excerpt" required rows={3} defaultValue={post?.excerpt} hint="1–2 sentence summary shown on cards and in search results" />
              <TextAreaField
                name="content"
                label="Content (Markdown)"
                required
                rows={24}
                mono
                defaultValue={post?.content}
                hint="Use ## for headings, **bold**, - for lists, [text](https://link) for links and | tables |. Fact-check every claim and cite references."
              />
            </div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Publishing">
            <div className="space-y-4">
              <SelectField
                name="status"
                label="Status"
                defaultValue={post?.status ?? "DRAFT"}
                options={[
                  { value: "DRAFT", label: "Draft" },
                  { value: "PUBLISHED", label: "Published" },
                ]}
              />
              <SelectField name="categoryId" label="Category" defaultValue={post?.categoryId ?? ""} options={[{ value: "", label: "Uncategorised" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
              <TextField name="authorName" label="Author name" defaultValue={post?.authorName ?? "Ganesh Nursery Team"} />
            </div>
          </Panel>
          <Panel title="Featured image">
            {post?.coverImage ? (
              <div className="mb-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream">
                  <Image src={post.coverImage} alt={post.coverAlt ?? ""} fill sizes="320px" className="object-cover" />
                </div>
                <div className="mt-3">
                  <Toggle name="removeCover" label="Remove current image" />
                </div>
              </div>
            ) : null}
            <ImagePicker name="coverImage" label={post?.coverImage ? "Replace image" : "Upload image"} />
            <TextField name="coverAlt" label="Image alt text" defaultValue={post?.coverAlt} className="mt-4" />
          </Panel>
          <Panel title="SEO">
            <div className="space-y-4">
              <TextField name="seoTitle" label="SEO title" defaultValue={post?.seoTitle} maxLength={70} />
              <TextAreaField name="seoDescription" label="SEO description" rows={3} defaultValue={post?.seoDescription} />
            </div>
          </Panel>
        </div>
      </div>
    </ActionForm>
  );
}
