"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";
import SearchBar from "./SearchBar";

interface SiteProduct {
  id: string; name: string; category: string; price: string;
  originalPrice?: string; creator: string; thumbnail?: string;
}

export default function ProductsSection() {
  const [products, setProducts] = useState<SiteProduct[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    const sorted = [...result];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))); break;
      case "price-desc": sorted.sort((a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))); break;
      case "name-asc": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return sorted;
  }, [products, query, sort]);

  return (
    <AnimatedSection id="products" className="bg-[#FAFAFA] px-4 sm:px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Search + Sort */}
        <div className="mx-auto max-w-2xl">
          <SearchBar
            onSearch={(q, s) => { setQuery(q); setSort(s); }}
            placeholder="Search products..."
          />
        </div>

        {query.trim() && filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-400">
            No products found for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <>
            {(["Photos", "Fonts", "Templates", "Free"] as const).map((cat) => {
              const items = filtered.filter((p) => p.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="text-center">
                  <h2 className="text-2xl font-bold text-neutral-900">Popular {cat}</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    Curated {cat.toLowerCase()} for your next project
                  </p>
                  <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {items.map((product, i) => (
                      <div key={product.id} className="w-full">
                        <ProductCard product={product} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </AnimatedSection>
  );
}
