"use client";

import { Suspense } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function SuccessContent() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#FAFAFA] pt-[105px]">
      <div className="max-w-md px-6 text-center">
        <span className="text-7xl select-none">{String.fromCodePoint(0x2705)}</span>
        <h1 className="mt-6 text-3xl font-bold text-neutral-900">Payment successful!</h1>
        <p className="mt-3 text-neutral-500">
          Thank you for your purchase. Your download link has been sent to your email.
        </p>

        <div className="mt-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm font-semibold text-emerald-800">Download link sent!</p>
            </div>
            <p className="mt-2 text-xs text-emerald-700">
              Check your email and click the download link to get your files.
              If you don&apos;t see it within a few minutes, check your spam folder.
            </p>
          </div>
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
