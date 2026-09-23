/**
 * Build a clean meta description from arbitrary body copy: collapse the
 * newlines and extra spaces that product/blog content contains, and cut at a
 * word boundary rather than mid-word.
 */
export function metaDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const clipped = clean.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

// Must match the root layout's title.template.
const BRAND_SUFFIX = " — Kyno";
const SERP_TITLE_BUDGET = 60;
// Segments shorter than this identify nothing on their own, so they are never
// worth keeping as the whole title — better to fall back to cutting the name.
const MIN_TITLE_LENGTH = 30;

/** Longest prefix of `name` ending on a word boundary within `budget`. */
function truncateAtWord(name: string, budget: number): string {
  const clipped = name.slice(0, budget + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const cut = lastSpace > budget * 0.5 ? clipped.slice(0, lastSpace) : name.slice(0, budget);
  return cut.trimEnd().replace(/[\s,;:—–|-]+$/, "");
}

/**
 * Product names on this store are keyword strings assembled from segments
 * ("… | Instant Download"). The words that identify the product come first, so
 * an over-budget title drops trailing segments before it cuts any real name.
 */
function shortenName(name: string, budget: number): string {
  let out = name;
  for (const separator of [" | ", " — ", " – "]) {
    while (out.length > budget) {
      const at = out.lastIndexOf(separator);
      if (at <= 0) break;
      const next = out.slice(0, at).trimEnd();
      if (next.length < MIN_TITLE_LENGTH) break;
      out = next;
    }
    if (out.length <= budget) return out;
  }
  return truncateAtWord(out, budget);
}

/**
 * The root layout renders child titles through a "%s — Kyno" template. On pages
 * whose name is already long, appending the brand pushes the title past what
 * Google displays and truncates the part that actually carries the keywords.
 * Returning an absolute title drops the redundant brand instead — the domain
 * already shows the brand in the SERP — and trims the name to fit.
 */
export function pageTitle(name: string): string | { absolute: string } {
  const clean = name.replace(/\s+/g, " ").trim();
  if (clean.length + BRAND_SUFFIX.length <= SERP_TITLE_BUDGET) return clean;
  return { absolute: shortenName(clean, SERP_TITLE_BUDGET) };
}
