"use client";

import { useState, useEffect } from "react";
import { CONSENT_EVENT } from "./AdSenseScript";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = document.cookie.includes("cookie-consent=accepted");
    if (!dismissed) setVisible(true);
  }, []);

  const accept = () => {
    document.cookie = "cookie-consent=accepted; max-age=" + 365 * 24 * 60 * 60 + "; path=/";
    setVisible(false);
    // Lets AdSenseScript (and anything else consent-gated) load without a reload.
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const decline = () => {
    // Remember the refusal so we don't ask again; no ad script will load.
    document.cookie = "cookie-consent=declined; max-age=" + 365 * 24 * 60 * 60 + "; path=/";
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-neutral-200 bg-white px-6 py-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-neutral-600">
          We use essential cookies to keep you signed in and remember your cart. With your consent we
          also load Google AdSense, which may set advertising cookies.{" "}
          <a href="/privacy" className="text-blue-600 underline hover:text-blue-700">Learn more</a>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={decline}
            className="rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
