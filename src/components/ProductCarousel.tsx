"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/site";

const categoryEmoji: Record<string, string> = {
  Photos: String.fromCodePoint(0x1F4F7),
  Fonts: String.fromCodePoint(0x1F524),
  Templates: String.fromCodePoint(0x1F4D0),
};

export default function ProductCarousel() {
  const featured = products.slice(0, 6);

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl font-bold text-neutral-900">See what&apos;s inside</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Preview our most popular products
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Link href={`/products/${product.id}`} className="flex h-full items-center justify-center text-6xl transition-transform group-hover:scale-110">
                {product.thumbnail ?? (categoryEmoji[product.category] || String.fromCodePoint(0x1F4E6))}
              </Link>

              {/* Overlay on hover */}
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-neutral-900/60 to-transparent p-5 opacity-0 transition-opacity group-hover:opacity-100">
                <div>
                  <span className="text-xs font-medium text-white/80">{product.category}</span>
                  <h3 className="text-base font-semibold text-white">{product.name}</h3>
                  <p className="text-sm font-bold text-white">{product.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
