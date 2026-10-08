import type { Metadata } from "next";
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import { getPublishedPosts } from "@/db/blog-posts";
import { getAllProducts } from "@/db/products-store";
import ProductCarousel from "@/components/ProductCarousel";
import ProductsSection from "@/components/ProductsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [posts, allProducts] = await Promise.all([
    getPublishedPosts(),
    getAllProducts().catch(() => []),
  ]);

  const products = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: `$${p.price}`,
    ...(p.originalPrice ? { originalPrice: `$${p.originalPrice}` } : {}),
    creator: p.creator,
    thumbnail: p.previewImages?.[0],
  }));

  return (
    <>
      <Nav />
      <main>
        <HeroSection posts={posts} />
        <ProductCarousel />
        <ProductsSection initialProducts={products} />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
