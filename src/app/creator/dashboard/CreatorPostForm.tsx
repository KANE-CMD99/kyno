"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { creatorCreatePost, creatorUpdatePost } from "./post-actions";
import { useLang } from "@/components/LangContext";
import { slugify } from "@/db/slug.mjs";
import type { BlogPost } from "@/db/blog-posts";

interface CreatorPostFormProps {
  post: BlogPost | null;
  onSaved: () => void;
}

export default function CreatorPostForm({ post, onSaved }: CreatorPostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [content, setContent] = useState(post?.content || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState<"draft" | "submit" | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useLang();

  const isEditing = !!post?.id;
  const wasPublished = post?.status === "published";

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError(t("blog.err_cover_type")); return; }
    if (file.size > 5 * 1024 * 1024) { setError(t("blog.err_cover_size")); return; }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", "image");
      const res = await fetch("/api/creator/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) setCoverImage(data.url);
      else setError(data.error || t("blog.err_upload"));
    } catch {
      setError(t("blog.err_upload"));
    } finally {
      setUploading(false);
    }
  };

  const save = async (mode: "draft" | "submit") => {
    setError("");
    if (!title.trim()) { setError(t("blog.err_title")); return; }
    if (!content.trim()) { setError(t("blog.err_content")); return; }
    setSaving(mode);
    const input = {
      slug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      coverImage: coverImage || undefined,
      content,
      submit: mode === "submit",
    };
    const result = isEditing
      ? await creatorUpdatePost(post!.id, input)
      : await creatorCreatePost(input);
    if (result.success) {
      onSaved();
      router.refresh();
    } else {
      setError(result.error || t("blog.err_save"));
    }
    setSaving(null);
  };

  const busy = saving !== null;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save("submit"); }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-neutral-900">
          {isEditing ? t("blog.edit_title", { title: post?.title || "" }) : t("blog.new_post")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save("draft")}
            disabled={busy}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-400 disabled:opacity-60"
          >
            {saving === "draft" ? t("admin.saving") : t("blog.save_draft")}
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving === "submit" ? t("blog.submitting") : t("blog.submit_review")}
          </button>
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {wasPublished && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {t("blog.live_warning")}
        </p>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-neutral-700">{t("blog.field_title")}</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">{t("blog.field_slug")}</label>
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            placeholder={t("blog.slug_placeholder")}
            className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">{t("blog.field_excerpt")}</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="mt-1.5 block w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">{t("blog.field_cover")}</label>
          {coverImage ? (
            <div className="mt-1.5 flex items-center gap-3">
              <img src={coverImage} alt="" className="h-16 w-24 rounded-lg border border-neutral-200 object-cover" />
              <button type="button" onClick={() => setCoverImage("")} className="text-xs text-red-500 hover:text-red-600">
                {t("common.remove")}
              </button>
            </div>
          ) : (
            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-4 text-sm text-neutral-400 transition-colors hover:border-blue-400 hover:text-blue-600">
              {uploading ? t("admin.uploading") : t("blog.upload_cover")}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">{t("blog.field_content")}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder={"## Heading\n\nWrite your post in Markdown..."}
            className="mt-1.5 block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </form>
  );
}
