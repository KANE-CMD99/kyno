"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ADSENSE_CLIENT = "ca-pub-9346189548515611";

// Payment and private pages never get ad tech.
const EXCLUDED_PREFIXES = ["/checkout", "/admin", "/login", "/orders", "/creator"];

export const CONSENT_EVENT = "kyno:consent";

/**
 * Loads Google AdSense only after the visitor accepts cookies, and never on
 * checkout or other private pages. Ad scripts set tracking cookies, so loading
 * them before consent is a GDPR problem for EU visitors.
 *
 * Site verification is handled separately by the google-adsense-account meta
 * tag in the root layout, so the crawler doesn't depend on this script running.
 */
export default function AdSenseScript() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(document.cookie.includes("cookie-consent=accepted"));
    sync();
    // The banner writes the cookie without navigating, so listen for its event.
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!consented) return null;
  if (EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
