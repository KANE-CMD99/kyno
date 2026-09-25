interface Props {
  name: string;
  description: string;
  image?: string;
  price: number;
  category: string;
  productUrl: string;
  /** Display name of the category, for the breadcrumb. */
  categoryLabel: string;
  categoryUrl: string;
}

// Markets the store sells into. Used for shipping/return declarations.
const SELLS_TO = ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL", "IE", "SE", "NZ", "SG", "JP"];

export default function ProductStructuredData({ name, description, image, price, category, productUrl, categoryLabel, categoryUrl }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com";
  const imageUrl = image?.startsWith("http") ? image : image ? `${baseUrl}${image}` : undefined;

  // These are digital downloads: nothing ships, delivery is instant and free.
  // Google flags an Offer that omits shipping/return details, so declare both —
  // the values below mirror what the site actually does and what /terms states.
  const shippingDetails = SELLS_TO.map((country) => ({
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: country },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
    },
  }));

  const product = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name,
    description,
    ...(imageUrl ? { image: imageUrl } : {}),
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: productUrl,
      shippingDetails,
      // Matches /terms: a refund is available for 7 days after purchase, free
      // of charge. This is machine-readable, so it has to track the real policy.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: SELLS_TO,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnFees: "https://schema.org/FreeReturn",
        // `KeepProduct`, and deliberately not one of the three values Google's
        // own documentation lists. Those are ReturnByMail, ReturnInStore and
        // ReturnAtKiosk — every one of them a physical act that cannot happen
        // to a download. Declaring one would be a false statement in
        // machine-readable data that Google may render, which is worse than the
        // non-critical "missing field" warning this replaces. `KeepProduct` is
        // the schema.org value for "the customer keeps it and is refunded",
        // which is exactly what a digital refund is. Google's docs do not list
        // it; the downside of that is bounded — an unrecognised value leaves us
        // no worse off than omitting it, since neither is a critical issue.
        returnMethod: "https://schema.org/KeepProduct",
      },
    },
    category,
    brand: {
      "@type": "Brand",
      name: "Kyno",
    },
    sku: productUrl.split("/").pop() || "",
  };

  // The page shows a Home / Category / Product breadcrumb — mirror it so the
  // SERP can render the same trail.
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    "@id": `${productUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: categoryUrl },
      { "@type": "ListItem", position: 3, name },
    ],
  };

  const ld = {
    "@context": "https://schema.org",
    "@graph": [product, breadcrumbs],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
    />
  );
}
