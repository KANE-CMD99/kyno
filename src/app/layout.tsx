import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import CookieBanner from "@/components/CookieBanner";
import OrganizationStructuredData from "@/components/OrganizationStructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyno.ltd"),
  icons: {
    icon: "/favicon.svg",
  },
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9346189548515611"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
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
