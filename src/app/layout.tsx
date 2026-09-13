import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import CookieBanner from "@/components/CookieBanner";
import AdSenseScript from "@/components/AdSenseScript";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd"),
  icons: {
    icon: "/favicon.svg",
  },
  // AdSense serves this tag to verify site ownership. Keeping it here means
  // verification does not depend on the (consent-gated) ad script loading.
  other: {
    "google-adsense-account": "ca-pub-9346189548515611",
  },
  title: {
    default: "Kyno — Buy Once, Own Forever | Resume Templates, Posters & Design Assets",
    template: "%s — Kyno",
  },
  description:
    "Premium resume templates, posters, and design assets for creators. Pay once, own forever — from $1.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kyno",
    title: "Kyno — Buy Once, Own Forever",
    description:
      "Premium resume templates, posters, and design assets for creators. Pay once, own forever — from $1.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyno — Buy Once, Own Forever",
    description:
      "Premium resume templates, posters, and design assets for creators. Pay once, own forever — from $1.",
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
