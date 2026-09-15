# kyno.top Font Pairing Tool — Design — 2026-09-14

## Overview

Build a second site on **kyno.top**: a free, English-language **font pairing generator** whose job is to earn US organic traffic and backlinks for the Kyno brand, then funnel a small share of that traffic to the store at **kyno.ltd**.

The store today (kyno.ltd) is a new domain with no Google index presence and almost no backlinks. Opening a second store would split an already-zero authority across two domains. A free tool is the one thing that attacks both problems at once: tools are searchable, shareable, and get linked to by third parties — which is exactly what kyno.ltd lacks.

> **Note on where the code lives.** This spec is written to `docs/superpowers/specs/` in the kyno.ltd repo for review, but the implementation goes into a **new, separate repository** (`kyno-top`). The two repos are not coupled: nothing in kyno.ltd imports from kyno.top or vice versa. The only link between the sites is hyperlinks and JSON-LD `sameAs`.

## Requirements (confirmed with user)

- **Role:** free tool site — optimize for organic traffic + backlinks, not for direct revenue.
- **Tool:** font pairing generator.
- **Scope:** programmatic SEO — generator page + one page per pairing + one page per font + one page per style. ~225 pages in phase 1.
- **Brand:** same **Kyno** brand, cross-linked with kyno.ltd.
- **Architecture:** independent **static** site, deployed to a CDN. No second server process.
- **Visual:** dark "stage" theme, site's own type set in **Fraunces** (headings) + **Inter** (UI/body).
- **Generator layout:** editor-first live preview on top, curated pairing card wall below.
- **Pairing page layout:** preview hero + two-column body (sticky sidebar), plus a small "each font's contribution" module.
- **Ads:** none in phase 1.
- **Font licensing:** only open-licensed Google Fonts; kyno.top never hosts or offers font files. See [Font Licensing](#font-licensing).

## Non-Goals (phase 1)

- No user accounts, no favorites, no server-side state.
- No ads.
- No Chinese/multi-language version — English only, US audience.
- No paid/premium fonts — the tool works entirely with free Google Fonts.
- No blog on kyno.top. kyno.ltd already has a blog subsystem; a second content site would split authority again.
- No checkout, no payment, no email capture on kyno.top.

## Information Architecture

Four page types, cross-linked. Each targets a different query family.

| Layer | URL | Target query pattern | Pages (phase 1) |
|---|---|---|---|
| Generator | `/` | `font pairing generator`, `font combination tool` | 1 |
| Pairing index | `/pairings` | `font pairings`, `font combinations` | 1 |
| **Font** | `/fonts/[slug]` | `playfair display pairing`, `what font goes with playfair display` | ~40 |
| **Pairing** | `/pairings/[a]-[b]` | `playfair display and lato`, `playfair display lato combo` | ~170 |
| **Style** | `/styles/[slug]` | `editorial font pairings`, `minimalist font pairings` | ~10 |
| Utility | `/about`, `/privacy`, `/licenses` | brand / trust / licensing | 3 |

**Total ≈ 225 pages.**

The font pages carry the highest-volume queries (`<font> pairing`), which is why the phase-1 catalog is the ~40 most-searched Google Fonts — that set accounts for most of the search volume in this word family. Style pages exist as internal-link hubs and to capture mood-based queries.

A font page is generated for every catalog font that appears in at least one pairing. A font with no pairings gets no page: a "{Font} pairings" page listing nothing is a thin page Google has no reason to keep.

### Internal linking rules

- Generator → pairing page ("View full pairing page →" on the current result).
- Font page → generator (pre-filled via URL params) and → every pairing that includes that font.
- Pairing page → both font pages, related pairings, its style page.
- Style page → its pairings.
- Breadcrumbs on all non-root pages.
- No page is more than 3 clicks from `/`.

### Redirects / canonicals

- Canonical host: **`https://www.kyno.top`** (mirrors kyno.ltd's www canonical). Apex → www, 301.
- Self-referencing canonical on every page, including `/pairings/[a]-[b]`.
- No cross-domain canonicals. kyno.top and kyno.ltd are both indexable, independently.

## Data Model

Data lives in the new repo under `data/`, committed to git. Build reads it; nothing is fetched at build time except Google Fonts CSS.

### `data/fonts.json`

Produced by `scripts/fetch-google-fonts.ts` (run manually, output committed), then hand-curated.

```jsonc
{
  "slug": "playfair-display",
  "name": "Playfair Display",
  "category": "serif",              // serif | sans-serif | display | handwriting | monospace
  "weights": [400, 500, 600, 700],  // from Google Fonts metadata
  "tags": ["editorial", "luxury", "high-contrast"],
  "character": "High-contrast Didone with strong editorial presence; reads as luxury at large sizes.",
  "popularity": 92,                 // 0-100, used for ordering and shuffle weighting
  "license": "OFL-1.1"              // from Google Fonts metadata; open licenses only
}
```

`character` is hand-written, 1-2 sentences, and is the raw material for generated rationale text. **Phase 1 targets ~40 fonts**; the catalog grows toward ~200 in phase 2. Keeping it small in phase 1 is deliberate: it keeps every font page well-populated and keeps the generator's picker honest about what it can actually pair.

**Whitelist filter** (from the ~1500-font Google catalog): must have ≥2 weights; must not be a novelty/display-only face; must carry an `OFL-1.1`, `Apache-2.0`, or `UFL` license; and must rank in the top ~40 by popularity, which is the phase-1 cutoff. The filter proposes and a human disposes — output is reviewed by hand before commit.

### `data/pairings.json`

Produced by `scripts/generate-pairings.ts`, which merges generated candidates with hand-written overrides.

```jsonc
{
  "slug": "playfair-display-lato",     // "{a}-{b}", heading first
  "a": "playfair-display",             // heading font slug
  "b": "lato",                         // body font slug
  "recipe": "didone-humanist",         // which recipe produced this
  "rationale": "Playfair Display's high stroke contrast needs a body face that ...",
  "useCases": ["editorial", "luxury", "wedding"],
  "styles": ["editorial", "luxury"],   // → /styles/[slug]
  "samples": {
    "heading": "A quiet kind of luxury",
    "sub": "Editorial layout, 2026",
    "body": "Lato keeps long paragraphs readable beneath a high-contrast Didone headline."
  },
  "featured": true,                    // true for the ~30 hand-written head-term pairings
  "curated": false                     // true when rationale was written by hand
}
```

`featured` pairings are hand-written end to end, because they carry most of the traffic. Everything else is recipe-generated and must pass the lint gate.

### `data/recipes.ts`

A recipe is a pairing principle, not a font list. ~20 recipes, e.g.:

```ts
{
  id: "didone-humanist",
  heading: { category: "serif", tagsAny: ["high-contrast", "editorial"] },
  body: { category: "sans-serif", tagsAny: ["humanist", "neutral"] },
  forbid: { sameTags: ["high-contrast"] },   // reject pairs whose character overlaps
  rationaleTemplate: [ /* >=4 sentence variants */ ],
  styles: ["editorial", "luxury"]
}
```

Generation cross-applies each recipe over the font whitelist, then filters. Producing a *justified* pairing is the point — a random combination of two fonts is exactly what the competing tools already do badly.

### `data/styles.ts`

~10 style hubs: `editorial`, `luxury`, `minimal`, `startup`, `wedding`, `portfolio`, `bold`, `playful`, `brutalist`, `academic`. Each has a name, one-line description, and derives its pairing list from `pairings[].styles`.

## Pairing Data Pipeline

```
scripts/fetch-google-fonts.ts   → data/fonts.json      (candidates + hand curation)
scripts/generate-pairings.ts    → data/pairings.json   (recipes ∪ data/pairings.curated.json)
scripts/lint-data.ts            → exit 1 on any failure
```

**`lint-data.ts` is the anti-thin-content gate.** It runs before `build` and fails the build on:

- two pairings sharing an identical `rationale` string (template collapse);
- a pairing referencing a font slug that does not exist;
- duplicate `(a, b)` or `(b, a)` pairs;
- a pairing with zero `useCases` or an empty `samples.body`;
- heading and body font in the same `category` with overlapping `tags` (equivalent styles);
- any `a`/`b` pair where both fonts are `display` or both are `handwriting`.

## Font Licensing

Every font on kyno.top is open source, and kyno.top never redistributes font files. Both rules are cheap to honor — which matters, because this site sits next to a store that *sells* fonts, so it invites exactly this scrutiny.

### Rule 1 — Only open-licensed fonts enter the catalog

The Google Fonts directory is entirely open source: OFL-1.1, Apache-2.0, or UFL. All three permit commercial use, web embedding, and modification. `fonts.json` therefore carries a `license` field, and `lint-data.ts` rejects any font whose license is outside that set.

Google prunes non-open fonts from the directory, so this guards against a hand-curation mistake rather than an expected failure.

### Rule 2 — Link to fonts, never host them

kyno.top must **never** offer a font file for download, and must not serve the content fonts from its own CDN. Content fonts load through the Google Fonts CSS API, so **Google performs the distribution**. This keeps kyno.top outside font redistribution entirely, along with the notice-and-license obligations that come with it.

Concretely: no "Download this font" button anywhere; the copyable snippet points at `fonts.googleapis.com`; the font page's specimen is rendered through that stylesheet.

### Chrome fonts are self-hosted — ship the notices

`next/font/google` downloads and self-hosts Fraunces and Inter, which **is** redistribution. Both are OFL-1.1, which requires the copyright notice and license text to accompany the files. So the repo ships:

- `THIRD-PARTY-LICENSES.md` — one entry per self-hosted font: copyright line, license name, license URL;
- the full license texts under `public/licenses/`.

`next/font` also subsets the fonts. Subsetting is a format conversion, and the accepted reading is that it does not engage OFL's Reserved Font Name clause — and since we neither rename nor alter the typefaces, the clause is not triggered either way.

### The store's fonts are a separate question

kyno.ltd sells three fonts (Modern Sans Serif, Handwritten Script, Display Typeface). Putting a font-recommendation tool beside a font store means anyone can compare the two, so: **the fonts sold on kyno.ltd should be original work, or carry a license that permits resale.** OFL does permit selling a font, but only with its license and notice attached and without using a Reserved Font Name — reselling a lightly-repackaged Google Font would satisfy neither the letter nor the branding. This is out of scope for this spec, but should be verified before kyno.top ships, because the two properties will be visibly linked.

### Visible output

- `/licenses` lists the self-hosted fonts and the license covering the Google Fonts catalog, with upstream links.
- The footer links to `/licenses` next to the brand line.

This doubles as a trust signal: on a typography site, knowing the difference between free-to-use and free-to-resell is part of being credible.

## Generator Page (`/`)

**Layout: editor-first preview on top, card wall below.**

### Preview block

- A single editable region containing three sample lines: heading, sub, body.
- `contenteditable` on each line, plain-text only. `textContent` is used to read the value back — never `innerHTML` — so user input cannot inject markup. **No user text ever leaves the browser.**
- Live font switching: heading line renders in font A, sub + body in font B.

### Controls

- `Heading ▾` / `Body ▾` — font pickers over the whitelisted catalog, with a text filter and category chips (All / Serif / Sans / Display / Script / Mono).
- `⇄ Shuffle` — draws from the **validated pairing pool only**, weighted by `popularity` and `featured`. Never produces a pairing that failed lint.
- Size and weight controls for the heading.
- `Copy CSS` — three tabs: Google Fonts `<link>`, CSS custom properties, HTML snippet.

Picking a font that is not yet loaded injects a Google Fonts CSS2 `<link>` for that family on demand (cached in a module-level Set so a family is never injected twice).

### Current-pairing panel

Beneath the controls: the pairing's `useCases` chips, a one-sentence rationale, and **`View full pairing page →`** when the current `(a, b)` exists in `pairings.json`. This is the primary path from tool traffic into indexable pages.

### URL state

- `?h=<slug>&b=<slug>` restores the current pairing. Read on mount, written with `history.replaceState` (no navigation).
- If `(h, b)` does not correspond to a real pairing, the generator still renders it but hides the "full pairing page" link.
- Typed sample text persists in `localStorage` under `kyno-top-sample`. Not in the URL (avoids unbounded URLs).

### Card wall

Below the preview: a responsive grid of pairing cards. Each card renders its own two-line sample in that pairing's actual fonts (so the wall doubles as a live specimen sheet) and links to the pairing page. Sorted by `featured` then `popularity`; a "Load into preview" affordance loads it into the block above without navigating.

## Pairing Page (`/pairings/[a]-[b]`)

Uses `generateStaticParams` over all `pairings.json` entries.

1. **Breadcrumb** — `Home / Pairings / {A} & {B}`.
2. **H1** — `{A} & {B}` (Fraunces), with a subtitle stating the combination in plain words, e.g. "A high-contrast serif headline with a neutral humanist sans."
3. **Preview block** — full-width, real sample text in the two fonts. Same editable component as the generator, so the text is live here too.
4. **Two-column body**:
   - *Left:* "Why it works" (`rationale`); the **contribution module** — the heading face alone and the body face alone, one line each, so a reader can see what each font contributes; "Best for" (use-case chips linking to `/styles/...`); and "Copy the code" (three tabs).
   - *Right (sticky):* a font card for A and B, each linking to its `/fonts/[slug]` page (name, category, weights, `character`); the contextual store module; related pairings (4, same style, different fonts).
5. **JSON-LD** — `WebPage` + `BreadcrumbList`.
6. **Metadata** — `generateMetadata` produces a specific title and description per page, e.g. title `Playfair Display & Lato — Editorial Serif + Sans Pairing`, not a template with tokens swapped. Description is derived from `rationale`'s first sentence and `useCases`.

## Font Page (`/fonts/[slug]`)

- **H1** `{Font} pairings`; opening paragraph from `character`.
- Google Fonts specimen block: the font rendered at 3 sizes, in heading and body roles.
- Font metadata: category, available weights, tags.
- **Grid of every pairing containing this font** — each card links to its pairing page. This is the internal-link hub that makes the ~170 pairing pages reachable.
- `Try it in the generator →` button → `/?h={slug}&b={suggested}` (pre-fills with this font's top partner).
- `generateMetadata` targets `<font> pairing` phrasing directly.

## Style Page (`/styles/[slug]`)

- **H1** `{Style} font pairings`; one-line description; grid of that style's pairings.
- Exists as both a query target and an internal-link hub.

## Visual Design

### Theme tokens (dark stage)

```css
--bg:            #0E0E11;   /* page */
--surface:       #17171C;   /* cards, preview blocks */
--border:        #232329;
--text-primary:  #F5F5F7;
--text-secondary:#9A9AA5;
--text-muted:    #6B6B75;
--accent:        #3B6EF0;   /* kyno.ltd blue, brightened for dark ground */
--accent-hover:  #5580F5;
```

The accent is deliberately the same blue family as kyno.ltd's `#1A56DB`, so the two sites read as siblings despite opposite grounds. Nothing else is shared: kyno.ltd is light and neutral, kyno.top is dark.

### Type

- **Site chrome:** Fraunces (headings, brand) + Inter (UI, body, all controls). Loaded once via `next/font/google` so they are self-hosted and shift-free.
- **Content fonts:** the whitelisted Google Fonts, loaded per page from the Google Fonts CDN — two families per pairing page, injected on demand in the generator.

The split is deliberate: the two *chrome* fonts are on every page and should be self-hosted and CLS-free; the *content* fonts are page-specific, and the generator can render any combination of them, so pre-bundling the catalog would ship far more font data than any one page needs.

### FOUT handling

Every content font is rendered with an explicit fallback stack of the same category (`'Playfair Display', Georgia, 'Times New Roman', serif`) plus `display=swap`, so a swap is a same-category change rather than a jarring reflow.

## Funnel to kyno.ltd

Three placements only. The rule is that a store link appears **only where it is genuinely relevant**; a pairing whose use cases do not map to anything Kyno sells gets no store module at all.

1. **Nav** — a quiet `Kyno Store →` link on every page.
2. **Contextual store module** on pairing pages, rendered only when a use case maps to a Kyno category:

   | Pairing use case | Links to (kyno.ltd) |
   |---|---|
   | `portfolio`, `landing`, `website`, `startup` | `/categories/templates` |
   | `poster`, `branding`, `logo`, `display`, `luxury` | `/categories/fonts` |
   | `social`, `photo`, `background` | `/categories/photos` |

   Copy is written per mapping, e.g. "Need a portfolio site that already uses a pairing like this? → Browse Kyno templates".
3. **Footer** — one brand line: "Kyno Pairings is a free tool by Kyno." + link.

**All kyno.ltd links carry UTM parameters** (`?utm_source=kyno-top&utm_medium=tool|nav|footer&utm_campaign=pairings`) so kyno.ltd's existing analytics can attribute referral traffic.

### Explicitly rejected

- Sitewide keyword-stuffed anchor text.
- Anchor-text variation engineered per page ("best fonts store", "cheap templates", …).
- Reciprocal link farms between the two domains.
- Cross-domain canonical tags.

These are the patterns that get classified as a link scheme and penalize both domains. The brand relationship is expressed the legitimate way instead: `Organization` JSON-LD on kyno.top carries `sameAs: ["https://www.kyno.ltd"]`, and kyno.ltd's existing `OrganizationStructuredData` gains `sameAs: ["https://www.kyno.top"]` pointing back. That second change is a one-line edit in the kyno.ltd repo and is the **only** work this project does in the other repository.

### Success measurement

- **kyno.top:** pages indexed (GSC), organic sessions, referring domains.
- **kyno.ltd:** sessions with `utm_source=kyno-top`, and brand-name search volume.

Direct conversion from tool users is **not** a phase-1 success metric.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router, TypeScript, Tailwind CSS 4 |
| Output mode | `output: 'export'` — fully static HTML. No route handlers, server actions, middleware, or ISR |
| Images | `images.unoptimized` (no optimizer in export mode) — content is typographic, so few images |
| Content fonts | Google Fonts CSS2 `<link>`, two families per page |
| Chrome fonts | `next/font/google` (Fraunces, Inter) |
| Analytics | Cloudflare Web Analytics — **cookie-free**, so kyno.top needs no consent banner |
| Hosting | Cloudflare Pages, connected to the `kyno-top` GitHub repo |
| Build | `npm run build` → `out/` |

### Repo structure

```
kyno-top/
  THIRD-PARTY-LICENSES.md
  public/licenses/          # full license texts for the self-hosted chrome fonts
  data/
    fonts.json  pairings.json  pairings.curated.json  recipes.ts  styles.ts
  scripts/
    fetch-google-fonts.ts  generate-pairings.ts  lint-data.ts
  src/
    app/
      layout.tsx  page.tsx
      pairings/page.tsx  pairings/[slug]/page.tsx
      fonts/[slug]/page.tsx
      styles/[slug]/page.tsx
      about/page.tsx  privacy/page.tsx  licenses/page.tsx
      sitemap.ts  robots.ts  not-found.tsx
    components/
      Generator.tsx  PairingPreview.tsx  PairingCard.tsx  FontCard.tsx
      WhyItWorks.tsx  ContributionSplit.tsx  CodeTabs.tsx
      StoreModule.tsx  Breadcrumbs.tsx  Nav.tsx  Footer.tsx
    lib/
      site.ts  fonts.ts  pairings.ts  seo.ts  analytics.ts
```

### `lib/fonts.ts`

Single source of truth for the font → CSS URL and fallback mapping.

```ts
export function googleFontsHref(families: string[], weights: number[]): string
export function fallbackStack(category: FontCategory): string
```

Collecting the CSS href for a page from `lib/fonts.ts` rather than hand-writing URLs is what keeps a wrong `family=` parameter from shipping.

## SEO

| Item | Implementation |
|---|---|
| Title/description | `generateMetadata` per page, specific per pairing/font/style. No token-swapped template strings |
| Canonical | self-referencing, `https://www.kyno.top` |
| Sitemap | `src/app/sitemap.ts`, all ~225 URLs, absolute www URLs |
| Robots | `robots.ts`, allow all, sitemap reference |
| JSON-LD | `WebSite` + `Organization` (with `sameAs`) sitewide; `WebPage` + `BreadcrumbList` per page |
| OG tags | per-page `og:title` / `og:description` / canonical URL; one branded static OG image shared site-wide |
| Open Graph images | per-page generated images are **phase 2** (they would require a build-time image generator) |
| Internal links | the four-way linking described under Information Architecture |
| `hreflang` | not needed (English only) |
| Noindex | none — every generated page is indexable |
| `trailingSlash` | `false`; canonical URLs match rendered paths |

## Deployment

1. Create the `kyno-top` repo on GitHub; push the scaffold.
2. Cloudflare Pages: connect the repo, build command `npm run build`, output directory `out`.
3. Add `kyno.top` as a custom domain in Pages. Move kyno.top's nameservers to Cloudflare (done at the registrar).
4. Enable Cloudflare Web Analytics and inject the beacon.
5. Configure apex → www redirect at the Cloudflare level.
6. GSC: add `kyno.top` as a **Domain** property (DNS TXT verification), submit `https://www.kyno.top/sitemap.xml` as a **full URL** — the same www/apex lesson learned on kyno.ltd. Then use URL Inspection → "Request indexing" for `/` and the highest-value font pages.

**Fallback if Cloudflare is unusable:** `out/` can be rsynced to the existing VPS and served by nginx as static files. This keeps kyno.top off the Node process either way. The cost is losing the CDN, so it is a fallback, not a plan.

## Testing / Acceptance

**Automated**
- `npm run lint:data` passes.
- `npm run build` succeeds and emits HTML for every entry in `fonts.json`, `pairings.json`, and `styles.ts` — count asserted equal to the data length.
- Every pairing page's referenced font slugs exist in `fonts.json`.
- An internal link check over `out/` finds no broken links and no 404 targets.

**Manual (in browser, against `next dev`)**
- Typing into the preview updates live and survives a font change and a shuffle.
- Shuffle never yields a pairing absent from `pairings.json`.
- Switching a font loads it and the sample re-renders in the new face.
- `Copy CSS` produces a working snippet in all three tabs.
- `/?h=x&b=y` restores the pairing.
- Every pairing page renders its two fonts, its contribution module, and the store module only where a mapping exists.
- Nav, footer, and store links carry UTM parameters and resolve to real kyno.ltd URLs.
- Keyboard-only pass over generator + one pairing page; preview text edits are reachable and announce correctly.

**Performance**
- Lighthouse on `/` and one `/pairings/[slug]` page: performance, accessibility, best practices, SEO all ≥ 90.
- Only the page's fonts are requested over the network (verify in the network panel) — no sitewide font bundle.

**Privacy**
- `/privacy` states plainly: no accounts, no cookies, no email capture, typed text never leaves the browser, and Cloudflare Web Analytics is cookieless.

**Licensing**
- `lint-data.ts` fails on any font whose `license` is outside OFL-1.1 / Apache-2.0 / UFL.
- No "download font" affordance exists anywhere in the built output; content fonts are requested only from `fonts.googleapis.com`.
- `THIRD-PARTY-LICENSES.md` lists every self-hosted font with its copyright line and license URL, and the full texts are committed under `public/licenses/`.
- `/licenses` renders and is linked from the footer.

## Phasing

**Phase 1 (this work) — ~225 pages live**
- Scaffold the repo, static export pipeline, dark theme, Fraunces/Inter chrome.
- Data pipeline: `fetch-google-fonts` → curation → `generate-pairings` → `lint-data`.
- ~40 fonts, ~170 pairings (~30 of them hand-written for the head terms), ~10 style hubs.
- Generator, pairing page, font page, style page, about, privacy, licenses.
- SEO layer, sitemap, JSON-LD, UTM funnel, analytics.
- Deploy to Cloudflare Pages, GSC submit, request indexing.

**Phase 2 (after data, ~4-8 weeks)**
- Grow the font catalog from ~40 toward ~200, and expand to 600+ pages **only if** the phase-1 pages are indexing.
- Per-page generated OG images.
- Ads — only once pages hold real rankings.
- Retention features (favorites, exports) if traffic justifies them.

## Risks

1. **Slow indexing.** A new domain with ~225 programmatic pages on a low-trust TLD may take weeks to index. This is a time-and-backlinks problem, not a configuration problem — kyno.ltd is in the same state today. Mitigations: manual indexing requests, and a tool that is genuinely shareable (design communities, Reddit r/typography, product directories) which brings the backlinks kyno.ltd cannot generate on its own.
   **The failure mode to avoid is panicking at week two and expanding to 1000 pages.**

2. **Google's scaled-content-abuse policy.** Programmatic pages are explicitly in scope for it. Defenses: every page has real utility (live editable preview, working code, genuine rationale), rationale strings are linted for template collapse, the head-term pages are hand-written, and expansion is phased rather than all-at-once. This reduces but does not eliminate the risk — which is why phase 1 is deliberately small and independently valuable even if phase 2 never happens.

3. **`.top` trust.** The TLD has a poor reputation in the US. Accepted for a free tool, which is why no payment or email entry ever happens on kyno.top — those stay on kyno.ltd.

4. **Font licensing exposure.** Small, but self-inflicted if avoided. Two places matter: (a) never host a font file — the moment kyno.top serves a download it becomes a redistributor with notice obligations; (b) the fonts sold on kyno.ltd sit one click from a page explaining what is free to use, so they need to be original or carry a resale-permitting license. Both are gated by the rules in [Font Licensing](#font-licensing).
