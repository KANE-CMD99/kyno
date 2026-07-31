"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState<{ productName: string; token: string; claimed: boolean }[] | null>(null);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/downloads?email=${encodeURIComponent(email.trim())}`);
    const data = await res.json();
    setDownloads(data.downloads || []);
    setLoading(false);
  };

  return (
    <>
      <Nav />
      <main className="min-h-[80vh] bg-[#FAFAFA] pt-[105px]">
        <div className="mx-auto max-w-lg px-6 py-16 text-center">
          <span className="text-6xl select-none">{String.fromCodePoint(0x1F4E6)}</span>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Find Your Downloads</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter the email you used during checkout to retrieve your download links.
          </p>

          <form onSubmit={handleLookup} className="mt-8 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Looking..." : "Search"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          {downloads !== null && (
            <div className="mt-8">
              {downloads.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-8">
                  <p className="text-sm text-neutral-500">No downloads found for that email.</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Make sure you use the same email address that received the download links.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    {downloads.length} download{downloads.length !== 1 ? "s" : ""} found
                  </p>
                  {downloads.map((d) => (
                    <a
                      key={d.token}
                      href={`/download/${d.token}`}
                      className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-blue-300"
                    >
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{d.productName}</p>
                        <p className="text-xs text-neutral-400">
                          {d.claimed ? "Already downloaded" : "Ready to download"} &middot; One-time use
                        </p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue-600">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="mt-10 text-xs text-neutral-400">
            Need help?{" "}
            <a href="mailto:33429296@qq.com" className="text-blue-600 hover:text-blue-700">Contact support</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
