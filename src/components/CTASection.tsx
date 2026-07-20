"use client";

import AnimatedSection from "./AnimatedSection";

export default function CTASection() {
  return (
    <AnimatedSection
      id="contact"
      className="bg-gradient-to-br from-[#110526] to-[#0a1020] px-6 py-28 text-center"
    >
      <h2 className="text-3xl font-bold text-white md:text-4xl">
        Ready to Elevate Your Work?
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
        Join thousands of creators using Kyno products worldwide.
      </p>
      <a
        href="mailto:hello@kyno.tech"
        className="mt-8 inline-block rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-10 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
      >
        Get in Touch
      </a>
    </AnimatedSection>
  );
}
