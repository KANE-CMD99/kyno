import { MetadataRoute } from "next";
import { products } from "@/data/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kyno.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const categoryRoutes = ["photos", "fonts", "templates"].map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...baseRoutes, ...categoryRoutes, ...productRoutes];
}
