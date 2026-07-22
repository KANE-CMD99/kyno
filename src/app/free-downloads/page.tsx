"use client";

import { useState } from "react";
import Link from "next/link";
import { freeDownloads } from "@/data/free-downloads";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function FreeDownloadsPage() {
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClaim = (itemId: string) => {
    if (!email.trim()) return;
    // In production: POST to API, log email + download
    setClaimed((prev) => ({ ...prev, [itemId]: true }));
    setActiveItem(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Nav />
      <main className="bg-white pt-[105px]">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">Free Downloads</span>
            </p>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-5xl">{String.fromCodePoint(0x1F381)}</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">
              Free Downloads
            </h1>
            <p className="mt-4 text-lg text-neutral-500">
              Free resources for your creative projects. Enter your email to download — no signup required.
            </p>
          </div>
        </section>

        {/* Success toast */}
        {submitted && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-neutral-900 px-6 py-3 text-sm text-white shadow-lg">
            Download link sent to your email! Check your inbox.
          </div>
        )}

        {/* Free items grid */}
        <section className="bg-neutral-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {freeDownloads.map((item) => {
                const isClaimed = claimed[item.id];

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl shrink-0">{item.emoji}</span>
                      <div>
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                          FREE
                        </span>
                        <h3 className="mt-1.5 text-base font-semibold text-neutral-900">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
                      <span>{item.fileSize}</span>
                      <span>{item.format}</span>
                    </div>

                    <div className="mt-5">
                      {isClaimed ? (
                        <a
                          href="#"
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download
                        </a>
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
                              onClick={() => handleClaim(item.id)}
                              disabled={!email.trim()}
                              className="shrink-0 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                            >
                              Get Download Link
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download Free
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
