"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/site";

export default function TestimonialsSection() {
  return (
    <section className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
          Testimonials
        </span>
        <h2 className="mt-2 text-2xl font-bold text-neutral-900">
          Trusted by creators worldwide
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          What our customers say about Kyno products
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="rounded-xl border border-neutral-200 bg-white p-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {/* Stars */}
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-neutral-600">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Avatar + Info */}
              <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
