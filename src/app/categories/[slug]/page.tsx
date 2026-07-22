"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { products, categories } from "@/data/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugToCategory(slug: string): string {
  const map: Record<string, string> = {
    photos: "Photos",
    fonts: "Fonts",
    templates: "Templates",
  };
  return map[slug] ?? "";
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const category = slugToCategory(slug);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  const categoryData = categories.find((c) => c.id === slug);
  const categoryProducts = products.filter((p) => p.category === category);

  // Search + sort
  let filtered = categoryProducts;
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
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <p className="text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">{category}</span>
            </p>
          </div>
        </div>

        {/* Header */}
        <section className="bg-white px-6 py-12">
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

        {/* Search + Sort */}
        <section className="px-6 pt-0 pb-6">
          <div className="mx-auto max-w-2xl">
            <SearchBar onSearch={(q, s) => { setQuery(q); setSort(s); }} />
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            {sorted.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-neutral-400">
                  {query.trim()
                    ? `No products found for "${query}"`
                    : "No products in this category yet."
                  }
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Browse all products &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-5">
                {sorted.map((product, i) => (
                  <div
                    key={product.id}
                    className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                  >
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
