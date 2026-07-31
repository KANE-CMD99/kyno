"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface DownloadItem {
  productId: string;
  productName: string;
  token: string;
}

function SuccessContent() {
  const [downloads, setDownloads] = useState<DownloadItem[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokens = params.get("tokens");
    const email = params.get("email");

    if (tokens) {
      fetch(`/api/downloads?tokens=${tokens}`)
        .then((r) => r.json())
        .then((d) => setDownloads(d.downloads || []));
    } else if (email) {
      fetch(`/api/downloads?email=${email}`)
        .then((r) => r.json())
        .then((d) => setDownloads(d.downloads || []));
    } else {
      setDownloads([]);
    }
  }, []);

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#FAFAFA] pt-[105px]">
      <div className="max-w-md px-6 text-center">
        <span className="text-7xl select-none">{String.fromCodePoint(0x2705)}</span>
        <h1 className="mt-6 text-3xl font-bold text-neutral-900">Payment successful!</h1>
        <p className="mt-3 text-neutral-500">
          Thank you for your purchase. Here are your download links:
        </p>

        {/* Download links */}
        <div className="mt-6 space-y-3">
          {downloads === null ? (
            <div className="animate-pulse space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-neutral-200" />
              ))}
            </div>
          ) : downloads.length > 0 ? (
            downloads.map((item) => (
              <a
                key={item.token}
                href={`/download/${item.token}`}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-blue-300"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{item.productName}</p>
                  <p className="text-xs text-neutral-400">Click to download &middot; One-time use</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-blue-600">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            ))
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">
                Download links will be sent to your email. If you don&apos;t see them, check spam or{" "}
                <a href="mailto:33429296@qq.com" className="text-blue-600 hover:text-blue-700">contact us</a>.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="rounded-lg bg-white border border-neutral-300 px-8 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-400"
          >
            Find My Downloads
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to Store
          </Link>
        </div>
        <p className="mt-4 text-xs text-neutral-400">
          Bookmark{" "}
          <Link href="/orders" className="text-blue-600 hover:text-blue-700">My Downloads</Link>
          {" "}to find your purchases anytime using your email.
        </p>
      </div>
    </main>
  );
}

function Loading() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#FAFAFA] pt-[105px]">
      <p className="text-sm text-neutral-500">Loading...</p>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={<Loading />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
