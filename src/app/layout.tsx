import type { Metadata } from "next";
import { CartProvider } from "@/components/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kyno.dev"),
  title: {
    default: "Kyno — Premium Digital Assets for Creators",
    template: "%s — Kyno",
  },
  description:
    "Premium stock photos, fonts, and design templates crafted for the global creator economy. Pay once, own forever.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kyno",
    title: "Kyno — Premium Digital Assets for Creators",
    description:
      "Premium stock photos, fonts, and design templates crafted for the global creator economy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyno — Premium Digital Assets for Creators",
    description:
      "Premium stock photos, fonts, and design templates crafted for the global creator economy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
