import { SITE } from "@/lib/site-config";

const SITE_URL = "https://www.kynocreative.com";

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
        // The trading name and the registered entity are not the same thing;
        // declaring both lets search engines tie the storefront to the company.
        legalName: "Kyno Technology Limited",
        url: SITE_URL,
        // Google requires a raster logo (favicon.svg does not qualify).
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
        description:
          "Ready-made resume templates, printables and menu templates — pay once, own forever.",
        // Same operator, second property: a free font-pairing tool whose every
        // page links here. Naming it tells search engines the two sites are one
        // organisation rather than unrelated sites trading links.
        sameAs: ["https://www.kyno.top"],
        address: {
          "@type": "PostalAddress",
          addressCountry: "HK",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: SITE.contactEmail,
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
          "Ready-made resume templates, printables and menu templates — pay once, own forever.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
    />
  );
}
