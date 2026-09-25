"use client";

import { useEffect } from "react";
import { referralFromUrl, rememberReferral } from "@/lib/referral";

/**
 * Reports one pageview to /api/visit with the context needed to say where the
 * visitor came from. The body used to be empty — the server recorded only an
 * IP — so the UTM scheme across both sites was written to nothing and no
 * channel could be compared against another.
 */
export default function VisitTracker() {
  useEffect(() => {
    const referral = referralFromUrl(window.location.search);

    // First touch wins, so someone who lands from kyno.top and then browses the
    // store is still credited to kyno.top if they buy later in this tab.
    rememberReferral(referral);

    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || "",
        ...referral,
      }),
    }).catch(() => {});
  }, []);

  return null;
}
