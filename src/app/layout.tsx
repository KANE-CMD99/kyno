import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import CookieBanner from "@/components/CookieBanner";
import AdSenseScript from "@/components/AdSenseScript";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kynocreative.com"),
  icons: {
    icon: "/favicon.svg",
  },
  // AdSense serves this tag to verify site ownership. Keeping it here means
  // verification does not depend on the (consent-gated) ad script loading.
  other: {
    "google-adsense-account": "ca-pub-9346189548515611",
  },
  title: {
    default: "Kyno — Buy Once, Own Forever | Resume Templates, Printables & Menu Templates",
    template: "%s — Kyno",
  },
  description:
    "Premium resume templates, printables, and menu templates. Pay once, own forever — from $4.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kyno",
    title: "Kyno — Buy Once, Own Forever",
    description:
      "Premium resume templates, printables, and menu templates. Pay once, own forever — from $4.",
    // Inherited by every page that doesn't set its own image. Without it the
    // homepage and the static pages shared as a bare link with no card.
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Kyno — resume templates, printables and menu templates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyno — Buy Once, Own Forever",
    description:
      "Premium resume templates, printables, and menu templates. Pay once, own forever — from $4.",
    images: ["/og-default.png"],
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
        <AdSenseScript />
        <OrganizationStructuredData />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <ClientLayout>
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
        </ClientLayout>
        <CookieBanner />
      </body>
    </html>
  );
}
