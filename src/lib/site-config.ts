export const SITE = {
  name: "Kyno Studio",
  domain: "kynocreative.com",
  url: "https://www.kynocreative.com",
  contactEmail: process.env.CONTACT_EMAIL || "33429296@qq.com",
  fromEmail: process.env.RESEND_FROM_EMAIL || "Kyno Studio <noreply@kynocreative.com>",
  adminEmail: process.env.ADMIN_EMAIL || "33429296@qq.com",
  // The cheapest paid product. The hero and three meta descriptions all make
  // this claim, so it lives here rather than as four literals — the copy said
  // "from $4" for a while after the cheapest product had become $4.90, and the
  // social card still said "$1". One place to change is one place to be wrong.
  // Update this whenever the lowest price changes.
  priceFrom: "$4.90",
} as const;
