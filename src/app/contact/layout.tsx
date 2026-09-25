import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about an order, a product, or a custom request? Get in touch with Kyno and we'll reply by email.",
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
