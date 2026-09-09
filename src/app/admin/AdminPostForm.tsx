"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreatePost, adminUpdatePost } from "./post-actions";
import { slugify } from "@/db/slug.mjs";
import type { BlogPost } from "@/db/blog-posts";

interface AdminPostFormProps {
  post: BlogPost | null;
  onSaved: () => void;
}

export default function AdminPostForm({ post, onSaved }: AdminPostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [content, setContent] = useState(post?.content || "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status || "draft");
  const [author, setAuthor] = useState(post?.author || "Kyno");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isEditing = !!post?.id;

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Only image files allowed for cover"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setUploading(true); setError("");
    const form = new FormData(); form.append("file", file); form.append("type", "image");
    const res = await fetch("/admin/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (data.url) setCoverImage(data.url);
    else setError(data.error || "Upload failed");
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Title is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }
    setSaving(true);
    const input = { slug, title: title.trim(), excerpt: excerpt.trim(), coverImage: coverImage || undefined, content, status, author };
    const result = isEditing
      ? await adminUpdatePost(post!.id, input)
      : await adminCreatePost(input);
    if (result.success) { onSaved(); router.refresh(); }
    else setError(result.error || "Save failed");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">{isEditing ? `Edit: ${post?.title}` : "New Post"}</h2>
        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
        </button>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-neutral-700">Title</label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-neutral-700">Slug</label>
            <input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} placeholder="auto-from-title" className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Excerpt (shown on cards)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Cover image (optional)</label>
          {coverImage ? (
            <div className="mt-1.5 flex items-center gap-3">
              <img src={coverImage} alt="" className="h-16 w-24 rounded-lg border border-neutral-200 object-cover" />
              <button type="button" onClick={() => setCoverImage("")} className="text-xs text-red-500 hover:text-red-600">Remove</button>
            </div>
          ) : (
            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-4 text-sm text-neutral-400 hover:border-blue-400 hover:text-blue-600">
              {uploading ? "Uploading..." : "Upload cover image (PNG/JPG/WebP, max 5MB)"}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Content (Markdown)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} placeholder={"## Heading\n\nWrite your post in Markdown..."} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm font-mono outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
    </form>
  );
}
