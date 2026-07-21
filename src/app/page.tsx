import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <ProductsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
