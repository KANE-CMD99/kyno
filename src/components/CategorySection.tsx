import { categories } from "@/data/site";
import SectionHeader from "./SectionHeader";
import CategoryCard from "./CategoryCard";
import AnimatedSection from "./AnimatedSection";

export default function CategorySection() {
  return (
    <AnimatedSection id="categories" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="What we offer"
          heading="Browse by category"
          subtitle="Find exactly what you need for your next project."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
