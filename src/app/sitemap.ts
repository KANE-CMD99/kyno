import { MetadataRoute } from "next";
import { getAllProducts } from "@/db/products-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const categoryRoutes = ["photos", "fonts", "templates", "free"].map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let products: Awaited<ReturnType<typeof getAllProducts>>;
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...baseRoutes, ...categoryRoutes, ...productRoutes];
}
