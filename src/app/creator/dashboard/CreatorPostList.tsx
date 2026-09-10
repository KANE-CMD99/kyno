"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { creatorGetPosts, creatorDeletePost } from "./post-actions";
import type { BlogPost } from "@/db/blog-posts";

interface CreatorPostListProps {
  onEdit: (post: BlogPost) => void;
  onAdd: () => void;
}

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-neutral-100 text-neutral-600" },
  pending: { label: "In review", cls: "bg-amber-100 text-amber-700" },
  published: { label: "Published", cls: "bg-green-100 text-green-700" },
};

export default function CreatorPostList({ onEdit, onAdd }: CreatorPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await creatorGetPosts();
      if (res.success) setPosts(res.posts);
      else setError(res.error || "Failed to load posts");
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await creatorDeletePost(id);
    await load();
    router.refresh();
  };

  if (loading) {
    return <p className="py-10 text-sm text-neutral-500">Loading posts...</p>;
  }

  if (error) {
    return <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Blog posts</h2>
          <p className="text-sm text-neutral-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + New post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">You haven&apos;t written any posts yet</p>
          <button onClick={onAdd} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
            Write your first post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const s = STATUS[p.status] || STATUS.draft;
            return (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}>{s.label}</span>
                    <span className="text-xs text-neutral-400">
                      {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold text-neutral-900">{p.title}</h3>
                  <p className="text-xs text-neutral-400">/blog/{p.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
