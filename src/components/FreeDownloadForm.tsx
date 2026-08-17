"use client";

import { useState } from "react";

interface Props {
  productId: string;
}

export default function FreeDownloadForm({ productId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/free-download-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), productId }),
      });
      const data = await res.json();
      setStatus(res.ok && data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div id="free-download" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Download link sent to <span className="font-medium">{email}</span>! Check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="free-download" className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Get Free Download"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600">Failed to send. Please try again.</p>
      )}
      <p className="text-xs text-neutral-400">
        No signup required. We&apos;ll email you a one-time download link.
      </p>
    </form>
  );
}
