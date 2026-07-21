import { products, productSections } from "@/data/site";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";

export default function ProductsSection() {
  return (
    <AnimatedSection id="products" className="bg-[#FAFAFA] px-6 py-16">
      <div className="mx-auto max-w-7xl space-y-20">
        {productSections.map((section) => {
          const sectionProducts = products.filter((p) => p.category === section.category);
          if (sectionProducts.length === 0) return null;

          return (
            <div key={section.category}>
              {/* Section Header */}
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {section.title}
                  </h2>
                </div>
                <a
                  href={section.href}
                  className="shrink-0 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                >
                  Explore {section.category} &rarr;
                </a>
              </div>

              {/* 4-col product grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {sectionProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
