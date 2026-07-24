import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import ProductCarousel from "@/components/ProductCarousel";
import ProductsSection from "@/components/ProductsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <ProductCarousel />
        <ProductsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
