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
      className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] overflow-hidden transition-all hover:border-white/[0.12] hover:scale-[1.02]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex h-44 items-center justify-center bg-white/[0.03]">
        <span className="text-3xl select-none">&#x1F4E6;</span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-purple-400">
          {product.category}
        </span>
        <h3 className="mt-1 text-base font-semibold text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-cyan-400">{product.price}</p>
      </div>
    </motion.div>
  );
}
