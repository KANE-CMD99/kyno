import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductsSection from "@/components/ProductsSection";
import StatsRow from "@/components/StatsRow";
import AdSlot from "@/components/AdSlot";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { stats } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <CategorySection />
        <ProductsSection />
        <section className="bg-neutral-100 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <StatsRow stats={stats} />
          </div>
        </section>
        <AdSlot />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
