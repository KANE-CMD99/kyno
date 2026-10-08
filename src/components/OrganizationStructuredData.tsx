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
        name: "Kyno Studio",
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
        description: SITE.description,
        // Same operator, second property: a free font-pairing tool whose every
        // page links here. Naming it tells search engines the two sites are one
        // organisation rather than unrelated sites trading links.
        sameAs: ["https://www.kyno.top"],
        // The full registered office, not just the country. A US buyer checking
        // whether this shop is a real company — and a search engine tying this
        // storefront to the Hong Kong entity — both need the address and the
        // company number, which are printed on the incorporation documents.
        address: {
          "@type": "PostalAddress",
          streetAddress: "Unit 1603, 16/F, The L. Plaza, 367-375 Queen's Road Central",
          addressLocality: "Sheung Wan",
          addressRegion: "Hong Kong",
          addressCountry: "HK",
        },
        identifier: {
          "@type": "PropertyValue",
          propertyID: "Hong Kong Company Number",
          value: SITE.companyNumber,
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: SITE.contactEmail,
          contactType: "customer service",
          // English only. The shop sells to US buyers in English; declaring
          // Chinese here advertised "overseas seller" to exactly the audience
          // the store is trying not to look foreign to.
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Kyno Studio",
        description: SITE.description,
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
