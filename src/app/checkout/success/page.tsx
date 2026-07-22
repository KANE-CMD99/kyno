"use client";

import { Suspense } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function SuccessContent() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#FAFAFA] pt-[105px]">
      <div className="text-center px-6">
        <span className="text-6xl select-none">{String.fromCodePoint(0x2705)}</span>
        <h1 className="mt-6 text-3xl font-bold text-neutral-900">Order confirmed!</h1>
        <p className="mt-3 text-neutral-500 max-w-sm mx-auto">
          Thank you for your purchase. Your download links and receipt have been sent to your email.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Store
        </Link>
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
