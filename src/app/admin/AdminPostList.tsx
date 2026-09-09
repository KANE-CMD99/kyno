"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminGetPosts, adminDeletePost } from "./post-actions";
import type { BlogPost } from "@/db/blog-posts";

interface AdminPostListProps {
  onEdit: (post: BlogPost) => void;
  onAdd: () => void;
}

export default function AdminPostList({ onEdit, onAdd }: AdminPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setPosts(await adminGetPosts());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await adminDeletePost(id);
    await load();
    router.refresh();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-neutral-500">Loading posts...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Blog Posts</h2>
        <button onClick={onAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">No posts yet</p>
          <button onClick={onAdd} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">+ Write your first post</button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-neutral-400">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}</span>
                </div>
                <h3 className="mt-1 truncate text-sm font-semibold text-neutral-900">{p.title}</h3>
                <p className="text-xs text-neutral-400">/blog/{p.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => onEdit(p)} className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(p.id, p.title)} className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
