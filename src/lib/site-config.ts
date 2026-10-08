export const SITE = {
  name: "Kyno Studio",
  domain: "kynocreative.com",
  url: "https://www.kynocreative.com",
  contactEmail: process.env.CONTACT_EMAIL || "33429296@qq.com",
  fromEmail: process.env.RESEND_FROM_EMAIL || "Kyno Studio <noreply@kynocreative.com>",
  adminEmail: process.env.ADMIN_EMAIL || "33429296@qq.com",
} as const;
