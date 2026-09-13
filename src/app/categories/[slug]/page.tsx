import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoryFull } from "@/data/site";
import CategoryPageClient from "./CategoryPageClient";
import { getAllProducts } from "@/db/products-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";

const CATEGORY_MAP: Record<string, string> = {
  photos: "Photos", fonts: "Fonts", templates: "Templates", free: "Free",
};

function isValidSlug(slug: string): boolean {
  return slug in CATEGORY_MAP;
}

function slugToCategory(slug: string): string {
  return CATEGORY_MAP[slug] ?? slug;
}

// Prerender each category (ISR) so generateMetadata's tags land in <head>.
// Category pages stream otherwise, and social crawlers don't run JS.
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSlug(slug)) return { title: "Not Found" };
  const cat = slugToCategory(slug);
  const label = categoryFull(cat);
  const data = categories.find((c) => c.id === slug);
  const description = data?.description || `Browse ${label} on Kyno — premium digital assets for creators.`;

  // Empty categories are thin content. Keep the page reachable (it's linked in
  // the nav for when products land) but keep it out of the index until it has
  // at least one product — indexing resumes automatically.
  const products = await getAllProducts().catch(() => []);
  const isEmpty = !products.some((p) => p.category === cat);

  return {
    title: label,
    description,
    alternates: { canonical: `${SITE_URL}/categories/${slug}` },
    ...(isEmpty ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${label} — Kyno`,
      description,
      type: "website",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();
  const category = slugToCategory(slug);
  const categoryData = categories.find((c) => c.id === slug);
  const allProducts = (await getAllProducts()).filter((p) => p.category === category);

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
