"use client";

import { motion } from "framer-motion";
import type { ProductItem } from "@/data/site";

interface ProductCardProps {
  product: ProductItem;
  index: number;
}

const categoryEmoji: Record<string, string> = {
  Templates: String.fromCodePoint(0x1F4D0),
  Fonts: String.fromCodePoint(0x1F524),
  Graphics: String.fromCodePoint(0x2728),
  Photos: String.fromCodePoint(0x1F4F7),
  Icons: String.fromCodePoint(0x1F4CC),
  "3D": String.fromCodePoint(0x1F3A8),
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const hasSale = !!product.originalPrice;
  const emoji = categoryEmoji[product.category] ?? String.fromCodePoint(0x1F4E6);

  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-100">
        <div className="flex h-full items-center justify-center text-5xl">
          {product.thumbnail ?? emoji}
        </div>

        {/* Add to Cart overlay on hover */}
        <div className="absolute inset-0 flex items-end p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="w-full rounded-md bg-neutral-900/90 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-neutral-900">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5 text-center">
        <div className="flex items-center justify-center gap-2">
          {hasSale && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
              25% OFF
            </span>
          )}
        </div>
        <h3 className="mt-1 text-sm font-semibold leading-tight text-neutral-900">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          by <span className="font-medium text-neutral-700">{product.creator}</span>
          <span className="mx-1 text-neutral-300">·</span>
          in {product.category}
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-neutral-900">{product.price}</span>
          {hasSale && (
            <span className="text-xs text-neutral-400 line-through">{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
