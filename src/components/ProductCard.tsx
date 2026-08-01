"use client";

import { motion } from "framer-motion";
import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";
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
  Free: "🎁",
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const priceNum = parseFloat(String(product.price || "$0").replace(/\$/g, "")) || 0;
  const hasSale = !!(product.originalPrice && priceNum > 0);
  const isFree = priceNum === 0;
  const emoji = categoryEmoji[product.category] ?? String.fromCodePoint(0x1F4E6);
  const { addItem, openCart } = useCart();
  const { format } = useCurrency();

  const displayPrice = isFree ? format(0) : format(priceNum);
  const displayOriginal = product.originalPrice ? format(parseFloat(String(product.originalPrice).replace(/\$/g, "")) || 0) : undefined;
  const discountPercent = hasSale ? Math.round((1 - priceNum / (parseFloat(String(product.originalPrice).replace(/\$/g, "")) || 1)) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: priceNum, category: product.category });
    if (!isFree) openCart();
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
        className={`mt-2.5 sm:mt-3 w-full rounded-lg border py-2 sm:py-2 text-xs font-semibold transition-all ${
          isFree ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
        }`}
      >
        {isFree ? "Download Free" : "Add to Cart"}
      </button>

      {/* Info */}
      <div className="mt-2.5 px-0.5 text-center">
        <div className="flex items-center justify-center gap-2">
          {isFree && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">FREE</span>
          )}
          {hasSale && discountPercent > 0 && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
              {discountPercent}% OFF
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
          <span className="text-sm font-bold text-neutral-900">{displayPrice}</span>
          {hasSale && (
            <span className="text-xs text-neutral-400 line-through">{displayOriginal}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
