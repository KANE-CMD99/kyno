"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  productId: string;
  name: string;
  rating?: number;
  text: string;
  createdAt: string;
}

interface Props {
  productId: string;
}

const INITIAL_SHOW = 10;

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex leading-none ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "text-amber-400" : "text-neutral-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductComments({ productId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
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
    if (!name.trim() || !text.trim() || rating < 1) return;
    setSubmitting(true);
    setMsg("");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, name: name.trim(), text: text.trim(), rating }),
    });
    if (res.ok) {
      setName(""); setText(""); setRating(0);
      setMsg("Thanks — your review is posted!");
      setTimeout(() => setMsg(""), 3000);
      loadComments();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Failed to post review.");
    }
    setSubmitting(false);
  };

  // Only comments that actually carry a rating count toward the average.
  const rated = comments.filter((c) => typeof c.rating === "number" && c.rating >= 1 && c.rating <= 5);
  const average = rated.length
    ? Math.round((rated.reduce((sum, c) => sum + (c.rating as number), 0) / rated.length) * 10) / 10
    : 0;

  const displayed = showAll ? comments : comments.slice(0, INITIAL_SHOW);
  const hasMore = comments.length > INITIAL_SHOW;
  const canSubmit = name.trim().length > 0 && text.trim().length > 0 && rating >= 1 && !submitting;

  return (
    <section className="bg-white px-4 sm:px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-xl font-bold text-neutral-900">Reviews</h2>
        <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
          {rated.length > 0 ? (
            <>
              <Stars value={Math.round(average)} />
              <span className="font-medium text-neutral-700">{average.toFixed(1)}</span>
              <span>
                from {rated.length} review{rated.length !== 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <span>No reviews yet — be the first to rate this product.</span>
          )}
        </div>

        {/* Review form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Your rating</span>
            <div className="flex items-center" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={rating === n}
                  className={`px-0.5 text-2xl leading-none transition-colors ${
                    n <= (hovered || rating) ? "text-amber-400" : "text-neutral-300 hover:text-amber-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && <span className="text-xs text-neutral-400">{rating}/5</span>}
          </div>

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
              disabled={!canSubmit}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
            {rating < 1 && <span className="text-xs text-neutral-400">Pick a star rating to post</span>}
            {msg && (
              <span className={`text-xs ${msg.includes("Failed") || msg.includes("must be") ? "text-red-500" : "text-green-600"}`}>
                {msg}
              </span>
            )}
          </div>
        </form>

        {/* Reviews list */}
        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-400">Loading reviews...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-neutral-400">No reviews yet. Be the first!</p>
          ) : (
            displayed.map((c) => (
              <div key={c.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">{c.name}</span>
                  {typeof c.rating === "number" && c.rating >= 1 && c.rating <= 5 && (
                    <Stars value={c.rating} className="text-sm" />
                  )}
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
                : `Show all ${comments.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
