import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Only /api/ is disallowed. The private pages (/admin, /login, /checkout,
      // /orders, /creator) carry a noindex meta tag instead: a Disallow would
      // stop Google crawling them, which means it would never see the noindex,
      // and it also blocks Search Console's Change of Address from verifying
      // that they redirect to the new domain.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
