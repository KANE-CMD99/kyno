import { products, productSections } from "@/data/site";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";

export default function ProductsSection() {
  return (
    <AnimatedSection id="products" className="bg-[#FAFAFA] px-6 py-20">
      <div className="mx-auto max-w-7xl space-y-24">
        {productSections.map((section) => {
          const sectionProducts = products.filter((p) => p.category === section.category);
          if (sectionProducts.length === 0) return null;

          return (
            <div key={section.category} className="text-center">
              {/* Centered Section Header */}
              <h2 className="text-2xl font-bold text-neutral-900">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Curated {section.category.toLowerCase()} for your next project
              </p>

              {/* Product Grid */}
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {sectionProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {/* Explore link below grid */}
              <a
                href={section.href}
                className="mt-6 inline-block text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Explore {section.category} &rarr;
              </a>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
