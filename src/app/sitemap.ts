import { MetadataRoute } from "next";
import { getAllProducts } from "@/db/products-store";
import { getPublishedPosts } from "@/db/blog-posts";
import { getCreators } from "@/db/creators";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";

const CATEGORY_SLUGS: { slug: string; category: string }[] = [
  { slug: "photos", category: "Photos" },
  { slug: "fonts", category: "Fonts" },
  { slug: "templates", category: "Templates" },
  { slug: "free", category: "Free" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/free-downloads`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/license`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  let products: Awaited<ReturnType<typeof getAllProducts>>;
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }

  // Only include categories that actually have products — empty category
  // pages are thin content and shouldn't be indexed.
  const populatedCategories = new Set(products.map((p) => p.category));
  const categoryRoutes = CATEGORY_SLUGS.filter(({ category }) => populatedCategories.has(category)).map(({ slug }) => ({
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

  const blogListRoute = { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 };

  const posts = await getPublishedPosts().catch(() => []);
  const blogRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    // Real publish date, so lastmod carries actual change information.
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const creators = await getCreators().catch(() => []);
  const creatorRoutes = creators.map((c) => ({
    url: `${SITE_URL}/${c.username}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...baseRoutes, blogListRoute, ...categoryRoutes, ...productRoutes, ...blogRoutes, ...creatorRoutes];
}
