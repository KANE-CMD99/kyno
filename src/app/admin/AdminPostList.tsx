"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminGetPosts, adminDeletePost, adminApprovePost, adminRejectPost } from "./post-actions";
import type { BlogPost } from "@/db/blog-posts";

interface AdminPostListProps {
  onEdit: (post: BlogPost) => void;
  onAdd: () => void;
}

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "DRAFT", cls: "bg-neutral-100 text-neutral-600" },
  pending: { label: "PENDING REVIEW", cls: "bg-amber-100 text-amber-700" },
  published: { label: "PUBLISHED", cls: "bg-green-100 text-green-700" },
};

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

  const handleApprove = async (id: string) => {
    await adminApprovePost(id);
    await load();
    router.refresh();
  };

  const handleReject = async (id: string) => {
    if (!confirm("Send this post back to the author as a draft?")) return;
    await adminRejectPost(id);
    await load();
    router.refresh();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-neutral-500">Loading posts...</p></div>;
  }

  const pendingCount = posts.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Blog Posts</h2>
          {pendingCount > 0 && (
            <p className="mt-1 text-sm text-amber-600">{pendingCount} awaiting review</p>
          )}
        </div>
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
          {posts.map((p) => {
            const s = STATUS[p.status] || STATUS.draft;
            return (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}>{s.label}</span>
                    <span className="text-xs text-neutral-400">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}</span>
                    <span className="text-xs text-neutral-400">by {p.author}</span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold text-neutral-900">{p.title}</h3>
                  <p className="text-xs text-neutral-400">/blog/{p.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {p.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(p.id)} className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">Approve</button>
                      <button onClick={() => handleReject(p.id)} className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">Send back</button>
                    </>
                  )}
                  <button onClick={() => onEdit(p)} className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">Edit</button>
                  <button onClick={() => handleDelete(p.id, p.title)} className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
