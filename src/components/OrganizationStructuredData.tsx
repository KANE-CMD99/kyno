export default function OrganizationStructuredData() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kyno",
    url: "https://www.kyno.ltd",
    logo: "https://www.kyno.ltd/favicon.svg",
    description: "Premium stock photos, fonts, and design templates crafted for the global creator economy. Pay once, own forever.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "33429296@qq.com",
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
