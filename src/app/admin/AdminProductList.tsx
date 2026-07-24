"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminGetProducts, adminDeleteProduct } from "./product-actions";
import type { ProductRecord } from "@/db/products-store";

interface AdminProductListProps {
  onEdit: (product: ProductRecord) => void;
  onAdd: (category?: string) => void;
}

const CATEGORIES = ["Photos", "Fonts", "Templates"] as const;

const categoryEmoji: Record<string, string> = {
  Photos: String.fromCodePoint(0x1F4F7),
  Fonts: String.fromCodePoint(0x1F524),
  Templates: String.fromCodePoint(0x1F4D0),
};

export default function AdminProductList({ onEdit, onAdd }: AdminProductListProps) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await adminGetProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminDeleteProduct(id);
    await loadProducts();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-neutral-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {CATEGORIES.map((category) => {
        const catProducts = products.filter((p) => p.category === category);

        return (
          <div key={category} className="text-center">
            {/* Category Header — same as homepage */}
            <div className="mb-2 text-5xl">{categoryEmoji[category]}</div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {category}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {catProducts.length} {catProducts.length === 1 ? "product" : "products"}
            </p>

            {/* Product Cards Grid — 4 cols like homepage */}
            <div className="mt-8">
              {catProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16">
                  <p className="text-sm text-neutral-400">No products in this category yet</p>
                  <button
                    onClick={() => onAdd(category)}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    + Add your first {category} product
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-5">
                  {catProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group relative w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                    >
                      {/* Card — mirrors ProductCard visual exactly */}
                      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden transition-shadow hover:shadow-md">
                        {/* Thumbnail */}
                        <div className="aspect-[3/2] bg-neutral-100 flex items-center justify-center text-5xl">
                          {categoryEmoji[p.category]}
                        </div>

                        {/* Info */}
                        <div className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {p.originalPrice && (
                              <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                                {Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                              </span>
                            )}
                            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                              ID: {p.id}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                            {p.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            by {p.creator} · {p.category}
                          </p>
                          <div className="mt-1.5 flex items-center justify-center gap-2">
                            <span className="text-sm font-bold text-neutral-900">${p.price}</span>
                            {p.originalPrice && (
                              <span className="text-xs text-neutral-400 line-through">${p.originalPrice}</span>
                            )}
                          </div>

                          {/* Admin actions — visible on hover */}
                          <div className="mt-3 flex items-center justify-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => onEdit(p)}
                              className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* "+ New" placeholder card — same size, dashed border */}
                  <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
                    <button
                      onClick={() => onAdd(category)}
                      className="flex h-full min-h-[280px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-white text-neutral-400 transition-colors hover:border-blue-400 hover:text-blue-600"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span className="text-sm font-medium">Add Product</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
