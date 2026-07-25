"use client";

import { motion } from "framer-motion";
import { useCart } from "./CartContext";
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
  const { addItem, openCart } = useCart();

  const priceNum = parseInt(product.price.replace("$", ""), 10);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: priceNum, category: product.category });
    openCart();
  };

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Image / Placeholder — wraps in a Link to product detail */}
      <a href={`/products/${product.id}`} className="block cursor-pointer">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-neutral-100">
          <div className="flex h-full items-center justify-center text-5xl">
            {product.thumbnail && (product.thumbnail.startsWith("/") || product.thumbnail.startsWith("http")) ? (
              <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              product.thumbnail ?? emoji
            )}
          </div>

          {/* Hover overlay — "View Details" */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-900/0 transition-colors group-hover:bg-neutral-900/10">
            <span className="rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-neutral-900 opacity-0 transition-opacity group-hover:opacity-100 shadow-sm">
              View Details
            </span>
          </div>
        </div>
      </a>

      {/* Add to Cart button — outside the Link */}
      <button
        onClick={handleAddToCart}
        className="mt-3 w-full rounded-lg border border-neutral-300 bg-white py-2 text-xs font-semibold text-neutral-700 transition-all hover:border-neutral-900 hover:text-neutral-900"
      >
        Add to Cart
      </button>

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
