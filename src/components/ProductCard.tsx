"use client";

import { motion } from "framer-motion";
import type { ProductItem } from "@/data/site";

interface ProductCardProps {
  product: ProductItem;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      className="group cursor-pointer rounded-lg border border-neutral-200 bg-white overflow-hidden transition-all hover:border-neutral-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex h-44 items-center justify-center bg-neutral-100">
        <span className="text-3xl select-none text-neutral-300">
          {product.thumbnail ?? String.fromCodePoint(0x1F4E6)}
        </span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
          {product.category}
        </span>
        <h3 className="mt-1 text-base font-semibold text-neutral-900">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-neutral-900">{product.price}</p>
      </div>
    </motion.div>
  );
}
