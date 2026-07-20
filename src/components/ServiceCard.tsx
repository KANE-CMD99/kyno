"use client";

import { motion } from "framer-motion";
import type { ServiceItem } from "@/data/site";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] p-8 transition-all hover:border-white/[0.12] hover:scale-[1.02]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-4 text-4xl">{service.emoji}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">
        {service.description}
      </p>
    </motion.div>
  );
}
