import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // No trailing slash on /admin — "/admin/" does not match the bare
      // /admin path, which left the admin entry point crawlable.
      disallow: ["/admin", "/api/", "/login", "/checkout", "/orders", "/creator"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
