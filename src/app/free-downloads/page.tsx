"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface FreeProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  fileSize?: string;
  format?: string;
  emoji: string;
  thumbnail?: string;
  downloadUrl?: string;
}

const categoryEmoji: Record<string, string> = {
  Photos: "📷",
  Fonts: "🔤",
  Templates: "📐",
  Free: "🎁",
};

export default function FreeDownloadsPage() {
  const [products, setProducts] = useState<FreeProduct[]>([]);
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const free = (d.products || [])
          .filter((p: { category: string; downloadUrl?: string }) => p.category === "Free" && p.downloadUrl)
          .map((p: { id: string; name: string; category: string; description?: string; downloadFile?: { url: string; name: string; size: number }; price: string; thumbnail?: string; downloadUrl?: string }) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description || "",
            fileSize: p.downloadFile ? `${(p.downloadFile.size / 1024 / 1024).toFixed(1)} MB` : "N/A",
            format: p.downloadFile ? p.downloadFile.name.split(".").pop()?.toUpperCase() || "FILE" : "FILE",
            emoji: categoryEmoji[p.category] || "🎁",
            thumbnail: p.thumbnail,
            downloadUrl: p.downloadUrl,
          }));
        setProducts(free);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleClaim = async (item: FreeProduct) => {
    if (!email.trim()) return;
    // Send email with download link — user downloads from their inbox, not this page
    fetch("/api/free-download-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        productName: item.name,
        downloadUrl: item.downloadUrl || "",
      }),
    }).catch(() => {});
    setClaimed((prev) => ({ ...prev, [item.id]: true }));
    setActiveItem(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">Free Downloads</span>
            </p>
          </div>
        </div>

        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-4xl sm:text-5xl">🎁</span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
              Free Downloads
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-500 px-2 sm:px-0">
              Free resources for your creative projects. Enter your email to download — no signup required.
            </p>
          </div>
        </section>

        {submitted && (
          <div className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto z-50 sm:-translate-x-1/2 rounded-lg bg-neutral-900 px-6 py-3 text-sm text-white shadow-lg text-center">
            Download link sent to your email! Check your inbox.
          </div>
        )}

        <section className="bg-neutral-50 px-4 sm:px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <p className="py-12 text-center text-sm text-neutral-400">Loading free downloads...</p>
            ) : products.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-neutral-400">No free downloads available yet. Check back soon!</p>
                <Link href="/" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">Browse all products</Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((item) => {
                  const isClaimed = claimed[item.id];
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-neutral-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
                    >
                      {item.thumbnail ? (
                        <Link href={`/products/${item.id}`} className="block">
                          <img src={item.thumbnail} alt={item.name} className="w-full aspect-[3/2] object-cover" />
                        </Link>
                      ) : (
                        <div className="w-full aspect-[3/2] bg-neutral-100 flex items-center justify-center">
                          <span className="text-4xl">{item.emoji}</span>
                        </div>
                      )}
                      <div className="p-6">
                      <Link href={`/products/${item.id}`} className="flex items-start gap-4 group">
                        <span className="text-4xl shrink-0">{item.emoji}</span>
                        <div>
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                            FREE
                          </span>
                          <h3 className="mt-1.5 text-base font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                        </div>
                      </Link>

                      <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
                        <span>{item.fileSize}</span>
                        <span>{item.format}</span>
                      </div>

                      <div className="mt-5">
                        {isClaimed ? (
                          <span className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-neutral-500">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Link sent to email
                          </span>
                        ) : activeItem === item.id ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => handleClaim(item)}
                                disabled={!email.trim()}
                                className="shrink-0 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                              >
                                Get Link
                              </button>
                            </div>
                            <button
                              onClick={() => setActiveItem(null)}
                              className="text-xs text-neutral-400 hover:text-neutral-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveItem(item.id)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Free
                          </button>
                        )}
                      </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
