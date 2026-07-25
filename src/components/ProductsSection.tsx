"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";
import SearchBar from "./SearchBar";
import Link from "next/link";

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

  const productSections = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.map((c) => ({
      title: `Popular ${c}`,
      category: c,
      href: `/categories/${c.toLowerCase()}`,
    }));
  }, [products]);

  const filterAndSort = (items: typeof products) => {
    let filtered = items;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    const sorted = [...filtered];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))); break;
      case "price-desc": sorted.sort((a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))); break;
      case "name-asc": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return sorted;
  };

  // Check if any section is empty after filtering
  const hasAnyResults = useMemo(() => {
    return productSections.some((section) => {
      const filtered = filterAndSort(products.filter((p) => p.category === section.category));
      return filtered.length > 0;
    });
  }, [query, sort]);

  return (
    <AnimatedSection id="products" className="bg-[#FAFAFA] px-6 py-20">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Search + Sort */}
        <div className="mx-auto max-w-2xl">
          <SearchBar
            onSearch={(q, s) => { setQuery(q); setSort(s); }}
            placeholder="Search products..."
          />
        </div>

        {!hasAnyResults && query.trim() && (
          <p className="py-12 text-center text-sm text-neutral-400">
            No products found for &ldquo;{query}&rdquo;
          </p>
        )}

        {productSections.map((section) => {
          const sectionProducts = products.filter((p) => p.category === section.category);
          const filtered = filterAndSort(sectionProducts);
          if (filtered.length === 0 && query.trim()) return null;
          if (sectionProducts.length === 0) return null;

          return (
            <div key={section.category} className="text-center">
              {/* Centered Section Header */}
              <h2 className="text-2xl font-bold text-neutral-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Curated {section.category.toLowerCase()} for your next project
              </p>

              {/* Product Grid */}
              <div className="mt-8 flex flex-wrap justify-center gap-5">
                {filtered.map((product, i) => (
                  <div key={product.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>

              {/* Explore link below grid */}
              {!query.trim() && (
                <a
                  href={section.href}
                  className="mt-6 inline-block text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                >
                  Explore {section.category} &rarr;
                </a>
              )}
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
