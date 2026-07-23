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
          Thank you for your purchase. Your download links will be sent to your email shortly.
        </p>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 text-left">
          <h3 className="text-sm font-semibold text-neutral-900">What happens next?</h3>
          <ol className="mt-3 space-y-2 text-sm text-neutral-500">
            <li className="flex gap-2">
              <span className="font-medium text-blue-600 shrink-0">1.</span>
              Check your inbox for an email from hello@kyno.dev with your download links.
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-blue-600 shrink-0">2.</span>
              If you don&apos;t see it, check your spam folder or contact us.
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-blue-600 shrink-0">3.</span>
              Save the email — links are valid for lifetime access.
            </li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to Store
          </Link>
          <a
            href="mailto:hello@kyno.dev?subject=Order%20Issue"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Need help? Contact us
          </a>
        </div>
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
