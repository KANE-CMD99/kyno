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

export default function ProductStructuredData({ name, description, image, price, category, productUrl, categoryLabel, categoryUrl }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";
  const imageUrl = image?.startsWith("http") ? image : image ? `${baseUrl}${image}` : undefined;
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
