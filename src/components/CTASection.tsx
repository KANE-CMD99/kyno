"use client";

import AnimatedSection from "./AnimatedSection";

export default function CTASection() {
  return (
    <AnimatedSection className="border-t border-neutral-200 bg-white px-6 py-24 text-center">
      <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
        Start earning with Kyno
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base text-neutral-500">
        Join our community of independent creators selling premium digital products.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <a
          href="#"
          className="rounded-lg bg-green-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-green-600"
        >
          Open a Shop
        </a>
        <a
          href="#"
          className="rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-400"
        >
          Become an Affiliate
        </a>
      </div>
    </AnimatedSection>
  );
}
