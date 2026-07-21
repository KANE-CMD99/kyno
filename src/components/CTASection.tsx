"use client";

import AnimatedSection from "./AnimatedSection";

export default function CTASection() {
  return (
    <AnimatedSection className="bg-neutral-100 px-6 py-28 text-center">
      <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
        Ready to create?
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-neutral-500">
        Start building with premium assets trusted by thousands of creators.
      </p>
      <a
        href="#products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-10 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
      >
        Browse All Products
      </a>
      <p className="mt-4 text-sm text-neutral-400">
        No subscriptions. Pay once, own forever.
      </p>
    </AnimatedSection>
  );
}
