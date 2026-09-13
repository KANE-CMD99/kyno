const SITE_URL = "https://www.kyno.ltd";

/**
 * Site-wide structured data. Emitted as a single @graph so Organization and
 * WebSite are described once and can reference each other by @id, rather than
 * as separate disconnected blobs.
 */
export default function OrganizationStructuredData() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Kyno",
        url: SITE_URL,
        // Google requires a raster logo (favicon.svg does not qualify).
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
        description:
          "Ready-made resume templates, posters and design assets — pay once, own forever.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "33429296@qq.com",
          contactType: "customer service",
          availableLanguage: ["English", "Chinese"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Kyno",
        description:
          "Ready-made resume templates, posters and design assets — pay once, own forever.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
