import { services } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#0a0a0f] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="What We Do"
          heading="Digital Products, Crafted with Precision"
          subtitle="Every product we ship goes through rigorous design and development to ensure it meets the highest standards."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
