import type { ServiceItem } from "@/data/site";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] p-8 transition-all hover:border-white/[0.12] hover:bg-[#0d0d14]/80 hover:scale-[1.02]">
      <div className="mb-4 text-4xl">{service.emoji}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">
        {service.description}
      </p>
    </div>
  );
}
