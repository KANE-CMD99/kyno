"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "./CurrencyContext";

const categoryEmoji: Record<string, string> = {
  Photos: String.fromCodePoint(0x1F4F7),
  Fonts: String.fromCodePoint(0x1F524),
  Templates: String.fromCodePoint(0x1F4D0),
  Free: "🎁",
};

interface FeaturedProduct {
  id: string; name: string; category: string; price: string;
  originalPrice?: string; thumbnail?: string; creatorId?: string;
}

function PriceLabel({ product }: { product: FeaturedProduct }) {
  const { format } = useCurrency();
  const priceNum = parseFloat(String(product.price || "$0").replace(/\$/g, "")) || 0;
  const isFree = priceNum === 0;
  const hasSale = !!(product.originalPrice && priceNum > 0);
  const origNum = hasSale ? (parseFloat(String(product.originalPrice).replace(/\$/g, "")) || 0) : 0;

  if (isFree) return <span className="text-sm font-bold text-emerald-600">FREE</span>;

  return (
    <span className="text-sm font-bold text-neutral-900">
      {format(priceNum)}
      {hasSale && (
        <span className="ml-1.5 text-xs text-neutral-400 line-through">{format(origNum)}</span>
      )}
    </span>
  );
}

export default function ProductCarousel() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const all: FeaturedProduct[] = d.products || [];
        const creatorProducts = all.filter((p) => p.creatorId);
        const otherProducts = all.filter((p) => !p.creatorId);
        const picked = [...creatorProducts, ...otherProducts].slice(0, 6);
        setFeatured(picked);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white px-4 sm:px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl font-bold text-neutral-900">See what&apos;s inside</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Preview our most popular products
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  <div className="flex h-full items-center justify-center text-6xl transition-transform group-hover:scale-110">
                    {product.thumbnail && (product.thumbnail.startsWith("/") || product.thumbnail.startsWith("http")) ? (
                      <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      product.thumbnail ?? (categoryEmoji[product.category] || String.fromCodePoint(0x1F4E6))
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-neutral-900/60 to-transparent p-5 opacity-0 transition-opacity group-hover:opacity-100">
                    <div>
                      <span className="text-xs font-medium text-white/80">{product.category}</span>
                      <h3 className="text-base font-semibold text-white">{product.name}</h3>
                      {product.creatorId && (
                        <p className="text-xs text-white/60 mt-0.5">Creator upload</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Info row — always visible */}
              <div className="mt-2.5 px-1">
                <h3 className="text-sm font-semibold text-neutral-900 text-left truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-neutral-400">{product.category}</span>
                  <PriceLabel product={product} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
