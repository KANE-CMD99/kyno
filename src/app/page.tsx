import type { Metadata } from "next";
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import { getPublishedPosts } from "@/db/blog-posts";
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
  const posts = await getPublishedPosts();
  return (
    <>
      <Nav />
      <main>
        <HeroSection posts={posts} />
        <ProductCarousel />
        <ProductsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
