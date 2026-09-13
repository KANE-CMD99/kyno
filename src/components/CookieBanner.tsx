"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = document.cookie.includes("cookie-consent=accepted");
    if (!dismissed) setVisible(true);
  }, []);

  const accept = () => {
    document.cookie = "cookie-consent=accepted; max-age=" + 365 * 24 * 60 * 60 + "; path=/";
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] border-t border-neutral-200 bg-white px-6 py-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-neutral-600">
          We use essential cookies for authentication, shopping cart, and language preferences. No third-party tracking.{" "}
          <a href="/privacy" className="text-blue-600 underline hover:text-blue-700">Learn more</a>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-neutral-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
