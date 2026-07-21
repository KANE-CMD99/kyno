"use client";

import { motion } from "framer-motion";
import type { CategoryItem } from "@/data/site";

interface CategoryCardProps {
  category: CategoryItem;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.a
      href={category.href}
      className="group rounded-lg border border-neutral-200 bg-white p-8 transition-all hover:border-blue-400"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-4 text-4xl">{category.emoji}</div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900">
        {category.title}
      </h3>
      <p className="text-sm leading-relaxed text-neutral-500">
        {category.description}
      </p>
      <span className="mt-3 inline-block text-sm font-medium text-blue-600">
        Browse &rarr;
      </span>
    </motion.a>
  );
}
