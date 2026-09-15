"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  productId: string;
  name: string;
  text: string;
  createdAt: string;
}

interface Props {
  productId: string;
}

const INITIAL_SHOW = 10;

export default function ProductComments({ productId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [showAll, setShowAll] = useState(false);

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/comments?productId=${productId}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments || []);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    setMsg("");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, name: name.trim(), text: text.trim() }),
    });
    if (res.ok) {
      setName(""); setText("");
      setMsg("Comment posted!");
      setTimeout(() => setMsg(""), 3000);
      loadComments();
    } else {
      setMsg("Failed to post comment.");
    }
    setSubmitting(false);
  };

  const displayed = showAll ? comments : comments.slice(0, INITIAL_SHOW);
  const hasMore = comments.length > INITIAL_SHOW;

  return (
    <section className="bg-white px-4 sm:px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-bold text-neutral-900">Comments</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </p>

        {/* Comment form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            required
            rows={3}
            className="block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !name.trim() || !text.trim()}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
            {msg && (
              <span className={`text-xs ${msg.includes("Failed") ? "text-red-500" : "text-green-600"}`}>
                {msg}
              </span>
            )}
          </div>
        </form>

        {/* Comments list */}
        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-400">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-neutral-400">No comments yet. Be the first!</p>
          ) : (
            displayed.map((c) => (
              <div key={c.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">{c.name}</span>
                  <span className="text-xs text-neutral-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{c.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Show more/less toggle */}
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {showAll
                ? "Show less"
                : `Show all ${comments.length} comments`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
