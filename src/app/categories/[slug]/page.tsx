import type { Metadata } from "next";
import { categories } from "@/data/site";
import CategoryPageClient from "./CategoryPageClient";
import { getAllProducts } from "@/db/products-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";

function slugToCategory(slug: string): string {
  const map: Record<string, string> = {
    photos: "Photos", fonts: "Fonts", templates: "Templates", free: "Free",
  };
  return map[slug] ?? slug;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = slugToCategory(slug);
  const data = categories.find((c) => c.id === slug);
  const description = data?.description || `Browse ${cat} on Kyno — premium digital assets for creators.`;

  return {
    title: `${cat} — Kyno`,
    description,
    alternates: { canonical: `${SITE_URL}/categories/${slug}` },
    openGraph: {
      title: `${cat} — Kyno`,
      description,
      type: "website",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = slugToCategory(slug);
  const categoryData = categories.find((c) => c.id === slug);
  const allProducts = (await getAllProducts()).filter((p) => p.category === category || slug === "free");

  // Convert to site format
  const products = allProducts.map((p) => ({
    id: p.id, name: p.name, category: p.category,
    price: `$${p.price}`,
    originalPrice: p.originalPrice ? `$${p.originalPrice}` : undefined,
    creator: p.creator, thumbnail: p.previewImages?.[0],
  }));

  return (
    <CategoryPageClient
      slug={slug}
      category={category}
      categoryData={categoryData ? { title: categoryData.title, description: categoryData.description, emoji: categoryData.emoji } : null}
      products={products}
    />
  );
}
