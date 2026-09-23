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
    // The homepage carries the brand itself: title.template only applies to
    // child segments, so a default without it would leave the homepage unbranded.
    default: "Kyno — Resume Templates, Printables & Menu Templates",
    template: "%s — Kyno",
  },
  description:
    "Premium resume templates, printables, and menu templates. Pay once, own forever — from $4.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kyno",
    // Deliberately no title/description here. Setting them at this level makes
    // every page inherit the homepage's, so /about, /blog and friends all
    // shared as the same card. Omitting them lets each page's own title and
    // description flow into og:title / og:description.
    // Inherited by every page that doesn't set its own image. Without it the
    // homepage and the static pages shared as a bare link with no card.
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Kyno — resume templates, printables and menu templates" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
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
