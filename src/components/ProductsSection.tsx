import { products } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";

export default function ProductsSection() {
  return (
    <AnimatedSection id="products" className="bg-[#0d0d14] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeader label="Products" heading="Featured Products" />
          <a
            href="#"
            className="hidden shrink-0 text-sm text-cyan-400 transition-colors hover:text-cyan-300 sm:block"
          >
            View All &rarr;
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
