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

/**
 * The root layout renders child titles through a "%s — Kyno" template. On pages
 * whose name is already long, appending the brand pushes the title past what
 * Google displays and truncates the part that actually carries the keywords.
 * Returning an absolute title keeps the name intact and drops the redundant
 * brand instead — the domain already shows the brand in the SERP.
 */
export function pageTitle(name: string): string | { absolute: string } {
  if (name.length + BRAND_SUFFIX.length <= SERP_TITLE_BUDGET) return name;
  return { absolute: name };
}
