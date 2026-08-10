"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

interface SiteProduct {
  id: string; name: string; category: string; price: string;
  originalPrice?: string; creator: string; thumbnail?: string;
}

interface Props {
  slug: string;
  category: string;
  categoryData: { title: string; description: string; emoji: string } | null;
  products: SiteProduct[];
}

export default function CategoryPageClient({ slug, category, categoryData, products }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  let filtered = products;
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
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

  return (
    <>
      <Nav />
      <main className="bg-[#FAFAFA] pt-[105px]">
        <div className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">{category}</span>
            </p>
          </div>
        </div>

        <section className="bg-white px-4 sm:px-6 py-12">
          <div className="mx-auto max-w-7xl text-center">
            <span className="text-5xl">{categoryData?.emoji}</span>
            <h1 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              {category}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-neutral-500">
              {categoryData?.description}
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 pt-0 pb-6">
          <div className="mx-auto max-w-2xl">
            <SearchBar onSearch={(q, s) => { setQuery(q); setSort(s); }} />
          </div>
        </section>

        <section className="px-4 sm:px-6 py-12">
          <div className="mx-auto max-w-7xl">
            {sorted.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-neutral-400">
                  {query.trim()
                    ? `No products found for "${query}"`
                    : "No products in this category yet."
                  }
                </p>
                <Link href="/" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                  Browse all products &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {sorted.map((product, i) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
