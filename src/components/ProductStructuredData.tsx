interface Props {
  name: string;
  description: string;
  image?: string;
  price: number;
  category: string;
  productUrl: string;
}

export default function ProductStructuredData({ name, description, image, price, category, productUrl }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd";
  const imageUrl = image?.startsWith("http") ? image : image ? `${baseUrl}${image}` : undefined;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
