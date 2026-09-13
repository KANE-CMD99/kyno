export const SITE = {
  name: "Kyno",
  domain: "kyno.ltd",
  url: "https://www.kyno.ltd",
  contactEmail: process.env.CONTACT_EMAIL || "33429296@qq.com",
  fromEmail: process.env.RESEND_FROM_EMAIL || "Kyno <noreply@kyno.ltd>",
  adminEmail: process.env.ADMIN_EMAIL || "33429296@qq.com",
} as const;
