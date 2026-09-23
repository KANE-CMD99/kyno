/**
 * First-touch referral for the current tab.
 *
 * Deliberately sessionStorage rather than a cookie: it dies with the tab,
 * carries no identifier of its own, and so stays clear of the consent banner's
 * remit (that gate exists for AdSense's advertising cookies). The affiliate
 * cookie in /r/[code] is a separate, longer-lived mechanism and is untouched.
 *
 * Everything here is client-only — `sessionStorage` does not exist on the
 * server, and every accessor is wrapped so a blocked store degrades to "no
 * referral" instead of throwing inside a render.
 */
export const REFERRAL_KEY = "kyno_ref";

export interface Referral {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

export const EMPTY_REFERRAL: Referral = { source: "", medium: "", campaign: "", content: "" };

/** The campaign parameters on the current URL, if any. */
export function referralFromUrl(search: string): Referral {
  const params = new URLSearchParams(search);
  return {
    source: params.get("utm_source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
  };
}

/** Records the first tagged arrival for this tab. Later arrivals do not overwrite it. */
export function rememberReferral(referral: Referral): void {
  if (!referral.source) return;
  try {
    if (!sessionStorage.getItem(REFERRAL_KEY)) {
      sessionStorage.setItem(REFERRAL_KEY, JSON.stringify(referral));
    }
  } catch {
    /* storage can be blocked or full; measurement must not break the page */
  }
}

/** The referral recorded earlier in this tab, or empty. */
export function readReferral(): Referral {
  try {
    const raw = sessionStorage.getItem(REFERRAL_KEY);
    if (!raw) return EMPTY_REFERRAL;
    const parsed = JSON.parse(raw) as Partial<Referral>;
    return {
      source: parsed.source || "",
      medium: parsed.medium || "",
      campaign: parsed.campaign || "",
      content: parsed.content || "",
    };
  } catch {
    return EMPTY_REFERRAL;
  }
}
