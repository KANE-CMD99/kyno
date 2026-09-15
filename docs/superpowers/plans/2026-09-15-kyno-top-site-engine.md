# kyno.top Site Engine — Implementation Plan (Plan 1 of 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete kyno.top font pairing site engine — every page type rendering from a data pipeline — and deploy it live, using an 8-font seed catalog so each code path is exercisable.

**Architecture:** A standalone Next.js 15 app built with `output: 'export'`, so the build emits pure static HTML into `out/`. All content comes from JSON committed under `data/`; scripts generate and validate that data offline, and the build reads it. No server, no API routes, no runtime data fetching — the only external request is the Google Fonts stylesheet for the fonts being demonstrated.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Vitest, tsx, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-14-kyno-top-font-pairing-design.md` (in the kynocreative.com repo — read it alongside this plan; it is the source of truth for every requirement below).

## Global Constraints

- **New repository.** All work happens in a **new repo**, checked out at `E:\KYNO\web\kyno-top` (a sibling of the kynocreative.com working directory `E:\KYNO\web\web -mian`). Nothing in this plan modifies the kynocreative.com repo except Task 20 Step 5, which is a single-line edit.
- **Commits carry an explicit identity.** The new repo has no local git identity configured, and writing one is out of scope for this plan. Every commit in it passes the identity inline, mirroring the identity already set on the kynocreative.com repo:
  `git -c user.name="Kyno Dev" -c user.email="dev@kyno.tech" commit -m "…"`
- **Node is v24 locally**, not the v22 the sibling repo runs in production. Nothing in this plan depends on the difference; note it only if a build error looks version-related.
- **Static export only.** `output: 'export'` in `next.config.ts`. **No** route handlers, server actions, middleware, `revalidate`, ISR, or `next/image` optimization. Any of these breaks the export build.
- **Canonical host:** `https://www.kyno.top` everywhere — canonicals, sitemap, JSON-LD, OG URLs. Never bare `kyno.top`, never `http`.
- **Site name:** `Kyno Pairings`. **Site chrome type:** Fraunces (headings/brand) + Inter (UI/body), via `next/font/google`.
- **Content fonts:** loaded from `https://fonts.googleapis.com/css2?…&display=swap`. Only the fonts a page actually renders.
- **Font licensing (hard rules — do not relax):** only `OFL-1.1`, `Apache-2.0`, or `UFL` fonts may enter the catalog. **No "download font" affordance may ever exist anywhere in the built output.** Content fonts are never self-hosted or served from our origin.
- **No user data leaves the browser.** The preview's editable text is read with `textContent`, never `innerHTML`. It is never transmitted anywhere.
- **Anchor text for kynocreative.com links is plain and human** ("Browse Kyno templates"). No keyword-stuffed anchors, no per-page anchor variation, no cross-domain canonicals.
- **Accessibility floor:** every interactive control is keyboard-reachable and has an accessible name. Heading order is never skipped.
- **`lint:data` must pass before `build`.** It is wired into the build script, not optional.

---

## File Structure

| Path | Responsibility |
|---|---|
| `next.config.ts` | Static export config |
| `src/lib/types.ts` | `Font`, `Pairing`, `Recipe`, `StyleTag` interfaces — the shared vocabulary |
| `src/lib/fonts.ts` | Font → Google Fonts URL and fallback stack. Single source of truth for font CSS |
| `src/lib/lint.ts` | Pure validation + `isAcceptablePair`. Used by both the generator script and the lint gate |
| `src/lib/pairings.ts` | Read-only query layer over `data/*.json` |
| `src/lib/generator.ts` | Pure generator logic: weighted shuffle, URL param parse/build |
| `src/lib/seo.ts` | Metadata + JSON-LD builders |
| `src/lib/site.ts` | Site constants and the kynocreative.com UTM link builder |
| `data/fonts.json` | Font catalog (8 fonts in this plan) |
| `data/recipes.ts` | Pairing principles that generate candidate pairings |
| `data/pairings.curated.json` | Hand-written pairings, merged over generated ones |
| `data/styles.ts` | Style hubs |
| `scripts/generate-pairings.ts` | recipes × fonts → `data/pairings.json` |
| `scripts/lint-data.ts` | CLI wrapper over `src/lib/lint.ts`; exits 1 on failure |
| `scripts/fetch-google-fonts.ts` | Google Fonts metadata → catalog candidates (Plan 2 uses it to scale) |
| `scripts/check-links.ts` | Crawls `out/` for broken internal links |
| `src/components/*` | Focused, single-purpose components (one file each) |
| `src/app/*` | Routes |

---

## Task 1: Scaffold the repo and prove the static export

**Files:**
- Create: `E:\KYNO\web\kyno-top\package.json`
- Create: `E:\KYNO\web\kyno-top\next.config.ts`
- Create: `E:\KYNO\web\kyno-top\tsconfig.json`
- Create: `E:\KYNO\web\kyno-top\.gitignore`
- Create: `E:\KYNO\web\kyno-top\src\app\layout.tsx`
- Create: `E:\KYNO\web\kyno-top\src\app\page.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: a repo where `npx next build` emits `out/index.html`. (`npm run build` also runs `npm run lint:data`, whose script does not exist until Task 6 — see Step 7.) Every later task adds to this.

> **Before starting:** the target directory is outside the current working directory. Request access to `E:\KYNO\web` (or `E:\KYNO\web\kyno-top`) before creating files there.

- [ ] **Step 1: Create the repo skeleton**

```bash
mkdir -p "/e/KYNO/web/kyno-top" && cd "/e/KYNO/web/kyno-top" && git init -b main
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "kyno-top",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "npm run lint:data && next build",
    "lint:data": "tsx scripts/lint-data.ts",
    "pairings:generate": "tsx scripts/generate-pairings.ts",
    "fonts:fetch": "tsx scripts/fetch-google-fonts.ts",
    "check:links": "tsx scripts/check-links.ts",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.5.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.13",
    "@types/node": "^22.15.3",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "tailwindcss": "^4.1.13",
    "tsx": "^4.20.3",
    "typescript": "^5.7.3",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules/
.next/
out/
next-env.d.ts
*.tsbuildinfo
.DS_Store
.env*.local
```

- [ ] **Step 6: Write a placeholder root layout and page**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kyno.top"),
  title: "Kyno Pairings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/globals.css`:

```css
@import "tailwindcss";
```

`src/app/page.tsx`:

```tsx
export default function Page() {
  return <main>Kyno Pairings</main>;
}
```

- [ ] **Step 7: Install and build**

```bash
npm install && npm run build
```

Expected: build succeeds. If `npm run lint:data` fails because `scripts/lint-data.ts` does not exist yet, that is expected at this step — run `npx next build` directly instead and confirm the export works.

- [ ] **Step 8: Verify the export emitted static HTML**

```bash
ls out/index.html
```

Expected: `out/index.html` exists.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold kyno.top with static export"
```

---

## Task 2: Dark theme, chrome fonts, and site shell

**Files:**
- Create: `postcss.config.mjs`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/site.ts`
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `SITE` constants and `storeUrl()` from `src/lib/site.ts`; `Nav` and `Footer` components. Every later page task renders these.

- [ ] **Step 1: Write `src/lib/site.ts`**

```ts
export const SITE = {
  name: "Kyno Pairings",
  url: "https://www.kyno.top",
  storeUrl: "https://www.kynocreative.com",
  tagline: "A free font pairing tool by Kyno.",
} as const;

export type StoreMedium = "nav" | "footer" | "module";

/** Builds a kynocreative.com URL with the UTM params its analytics attributes on. */
export function storeUrl(path: string, medium: StoreMedium, content?: string): string {
  const url = new URL(path, SITE.storeUrl);
  url.searchParams.set("utm_source", "kyno-top");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "pairings");
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
}
```

- [ ] **Step 2: Write `postcss.config.mjs`, then the theme in `src/app/globals.css`**

Task 1 added `@tailwindcss/postcss` to `devDependencies` but no PostCSS config, so Tailwind currently emits nothing — the placeholder page has no classes, which is why it looked fine. This step is what actually turns Tailwind on. Without it every utility class in every later task silently produces no CSS.

`postcss.config.mjs` (this is the exact shape the kynocreative.com repo uses):

```js
const defaultConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default defaultConfig;
```

Then `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0e0e11;
  --color-surface: #17171c;
  --color-border: #232329;
  --color-text-primary: #f5f5f7;
  --color-text-secondary: #9a9aa5;
  --color-text-muted: #6b6b75;
  --color-accent: #3b6ef0;
  --color-accent-hover: #5580f5;
  --font-display: var(--font-fraunces);
  --font-ui: var(--font-inter);
}

html {
  color-scheme: dark;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: var(--font-ui), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display), Georgia, serif;
  color: var(--color-text-primary);
}
```

- [ ] **Step 3: Load the chrome fonts in `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // No `title.template` here. Page titles arrive complete and brand-suffixed from
  // src/lib/seo.ts. A template would append the brand a second time, and would also
  // lengthen every title after its length budget had already been applied.
  title: "Kyno Pairings — Free Font Pairing Generator",
  description:
    "Find fonts that belong together. A free font pairing generator built on open-source Google Fonts, with live previews and copy-ready CSS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Write `src/components/Nav.tsx`**

```tsx
import Link from "next/link";
import { SITE, storeUrl } from "@/lib/site";

export function Nav() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6"
      >
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text-primary)]"
        >
          Kyno<span className="text-[var(--color-text-muted)]"> Pairings</span>
        </Link>
        <Link
          href="/pairings"
          className="text-sm hover:text-[var(--color-text-primary)]"
        >
          Pairings
        </Link>
        <span className="flex-1" />
        <a
          href={storeUrl("/", "nav")}
          className="text-sm hover:text-[var(--color-text-primary)]"
        >
          Kyno Store →
        </a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 5: Write `src/components/Footer.tsx`**

```tsx
import Link from "next/link";
import { SITE, storeUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm sm:flex-row sm:items-center sm:px-6">
        <p>
          {SITE.tagline}{" "}
          <a href={storeUrl("/", "footer")} className="underline">
            Visit the Kyno store
          </a>
        </p>
        <span className="flex-1" />
        <div className="flex gap-5">
          <Link href="/licenses" className="hover:text-[var(--color-text-primary)]">
            Licenses
          </Link>
          <Link href="/privacy" className="hover:text-[var(--color-text-primary)]">
            Privacy
          </Link>
          <Link href="/about" className="hover:text-[var(--color-text-primary)]">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Build and verify in the browser**

Run: `npx next build && npx next dev`
Expected: build passes; the dev server shows the nav with "Kyno Pairings", a "Pairings" link, a "Kyno Store →" link, and a footer. The page background is `#0e0e11` and headings render in Fraunces. Verify the store link carries `utm_source=kyno-top` in its href.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: dark theme shell, chrome fonts, nav and footer"
```

---

## Task 3: Data types and the seed font catalog

**Files:**
- Create: `src/lib/types.ts`
- Create: `data/fonts.json`

**Interfaces:**
- Consumes: nothing.
- Produces: the `Font`, `Pairing`, `Recipe`, `StyleTag`, `FontCategory`, `FontLicense` types; `data/fonts.json` with 8 fonts. Every later task imports these.

- [ ] **Step 1: Write `src/lib/types.ts`**

```ts
export type FontCategory =
  | "serif"
  | "sans-serif"
  | "display"
  | "handwriting"
  | "monospace";

export type FontLicense = "OFL-1.1" | "Apache-2.0" | "UFL";

export interface Font {
  slug: string;
  name: string;
  category: FontCategory;
  weights: number[];
  tags: string[];
  /** Short noun phrase used inside rationale templates, e.g. "high-contrast Didone". */
  trait: string;
  /** One or two full sentences describing the face. Used on the font page. */
  character: string;
  /** 0-100. Drives ordering and shuffle weighting. */
  popularity: number;
  license: FontLicense;
}

export interface Pairing {
  slug: string;
  /** Heading font slug. */
  a: string;
  /** Body font slug. */
  b: string;
  recipe: string;
  rationale: string;
  useCases: string[];
  styles: string[];
  samples: { heading: string; sub: string; body: string };
  featured: boolean;
  curated: boolean;
}

export interface Recipe {
  id: string;
  heading: { category: FontCategory; tagsAny: string[] };
  body: { category: FontCategory; tagsAny: string[] };
  rationaleTemplates: string[];
  styles: string[];
}

export interface StyleTag {
  slug: string;
  name: string;
  description: string;
}
```

- [ ] **Step 2: Write `data/fonts.json` with 8 real open-licensed fonts**

Every font here must be Google Fonts, OFL-1.1 or Apache-2.0, and have ≥2 weights. The `trait` and `character` fields are hand-written.

```json
[
  {
    "slug": "playfair-display",
    "name": "Playfair Display",
    "category": "serif",
    "weights": [400, 500, 600, 700],
    "tags": ["editorial", "luxury", "high-contrast"],
    "trait": "high-contrast Didone",
    "character": "A high-contrast Didone with strong editorial presence. It reads as luxury at display sizes and needs a calm body face beneath it.",
    "popularity": 92,
    "license": "OFL-1.1"
  },
  {
    "slug": "lora",
    "name": "Lora",
    "category": "serif",
    "weights": [400, 500, 600, 700],
    "tags": ["editorial", "readable", "brushed"],
    "trait": "brushed contemporary serif",
    "character": "A contemporary serif with brushed curves and a sturdy rhythm. It holds up in long body copy and gives headings a literary feel.",
    "popularity": 86,
    "license": "OFL-1.1"
  },
  {
    "slug": "merriweather",
    "name": "Merriweather",
    "category": "serif",
    "weights": [300, 400, 700, 900],
    "tags": ["readable", "academic", "sturdy"],
    "trait": "sturdy screen serif",
    "character": "Designed for screens, with generous x-height and open forms. It stays legible at small sizes, which makes it a dependable body face.",
    "popularity": 78,
    "license": "OFL-1.1"
  },
  {
    "slug": "inter",
    "name": "Inter",
    "category": "sans-serif",
    "weights": [400, 500, 600, 700],
    "tags": ["neutral", "ui", "startup"],
    "trait": "neutral interface grotesque",
    "character": "A neutral grotesque built for interfaces. It disappears into the layout, which is exactly what a body face should do.",
    "popularity": 96,
    "license": "OFL-1.1"
  },
  {
    "slug": "lato",
    "name": "Lato",
    "category": "sans-serif",
    "weights": [300, 400, 700, 900],
    "tags": ["humanist", "neutral", "readable"],
    "trait": "warm humanist sans",
    "character": "A warm humanist sans with slightly rounded terminals. It is friendly without being casual, and reads comfortably at length.",
    "popularity": 88,
    "license": "OFL-1.1"
  },
  {
    "slug": "work-sans",
    "name": "Work Sans",
    "category": "sans-serif",
    "weights": [300, 400, 500, 600, 700],
    "tags": ["neutral", "geometric", "startup"],
    "trait": "unfussy geometric sans",
    "character": "A geometric sans tuned for text rather than display. Unfussy and even, it keeps a page calm under a louder headline.",
    "popularity": 74,
    "license": "OFL-1.1"
  },
  {
    "slug": "space-grotesk",
    "name": "Space Grotesk",
    "category": "display",
    "weights": [400, 500, 600, 700],
    "tags": ["technical", "bold", "startup"],
    "trait": "angular technical grotesque",
    "character": "An angular grotesque with distinctive letterforms and a technical edge. It wants a headline role, not a paragraph.",
    "popularity": 81,
    "license": "OFL-1.1"
  },
  {
    "slug": "caveat",
    "name": "Caveat",
    "category": "handwriting",
    "weights": [400, 500, 600, 700],
    "tags": ["playful", "personal", "casual"],
    "trait": "loose handwritten script",
    "character": "A loose, quick handwriting face. It adds a personal note at small sizes and becomes hard to read if pushed larger than a caption.",
    "popularity": 62,
    "license": "OFL-1.1"
  }
]
```

- [ ] **Step 3: Verify the JSON parses**

```bash
node -e "const f=require('./data/fonts.json'); console.log(f.length, 'fonts'); if(f.length<8) process.exit(1)"
```

Expected: `8 fonts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts data/fonts.json
git commit -m "feat: font data types and 8-font seed catalog"
```

---

## Task 4: Font CSS helpers

**Files:**
- Create: `src/lib/fonts.ts`
- Create: `src/lib/fonts.test.ts`

**Interfaces:**
- Consumes: `Font`, `FontCategory` from `src/lib/types.ts`.
- Produces: `googleFontsHref(fonts: Font[]): string` and `fallbackStack(font: Font): string`. Used by `PairingPreview`, the font page, and `CodeTabs`.

- [ ] **Step 1: Write the failing test**

`src/lib/fonts.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { googleFontsHref, fallbackStack } from "./fonts";
import type { Font } from "./types";

const playfair: Font = {
  slug: "playfair-display",
  name: "Playfair Display",
  category: "serif",
  weights: [400, 700],
  tags: [],
  trait: "",
  character: "",
  popularity: 90,
  license: "OFL-1.1",
};

const lato: Font = { ...playfair, slug: "lato", name: "Lato", category: "sans-serif" };

describe("googleFontsHref", () => {
  it("sorts and de-duplicates weights", () => {
    const href = googleFontsHref([{ ...playfair, weights: [700, 400, 700] }]);
    expect(href).toBe(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
    );
  });

  it("encodes spaces in family names as plus signs", () => {
    expect(googleFontsHref([playfair])).toContain("family=Playfair+Display");
  });

  it("joins multiple families with an ampersand", () => {
    const href = googleFontsHref([playfair, lato]);
    expect(href).toContain("family=Playfair+Display:wght@400;700");
    expect(href).toContain("family=Lato:wght@400;700");
    expect(href.startsWith("https://fonts.googleapis.com/css2?")).toBe(true);
    expect(href.endsWith("&display=swap")).toBe(true);
  });

  it("returns a fontless stylesheet for an empty list", () => {
    expect(googleFontsHref([])).toBe("https://fonts.googleapis.com/css2?&display=swap");
  });
});

describe("fallbackStack", () => {
  it("quotes the family and appends the serif fallback", () => {
    expect(fallbackStack(playfair)).toBe("'Playfair Display', Georgia, 'Times New Roman', serif");
  });

  it("appends the sans fallback for a sans-serif font", () => {
    expect(fallbackStack(lato)).toContain("'Lato', system-ui, -apple-system");
    expect(fallbackStack(lato).endsWith("sans-serif")).toBe(true);
  });

  it("appends a cursive fallback for handwriting", () => {
    const caveat: Font = { ...playfair, name: "Caveat", category: "handwriting" };
    expect(fallbackStack(caveat).endsWith("cursive")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/fonts.test.ts`
Expected: FAIL — "Failed to resolve import ./fonts".

- [ ] **Step 3: Write `src/lib/fonts.ts`**

```ts
import type { Font, FontCategory } from "./types";

/** Same-category fallbacks, so a font swap is a small change rather than a reflow. */
const FALLBACKS: Record<FontCategory, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  "sans-serif": "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
  display: "Georgia, 'Times New Roman', serif",
  handwriting: "'Segoe Script', 'Brush Script MT', cursive",
  monospace: "ui-monospace, Menlo, Consolas, monospace",
};

export function fallbackStack(font: Font): string {
  return `'${font.name}', ${FALLBACKS[font.category]}`;
}

export function googleFontsHref(fonts: Font[]): string {
  const families = fonts
    .map((font) => {
      const weights = [...new Set(font.weights)].sort((x, y) => x - y);
      const family = font.name.replace(/\s+/g, "+");
      return `family=${family}:wght@${weights.join(";")}`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/fonts.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/fonts.ts src/lib/fonts.test.ts
git commit -m "feat: google fonts href and fallback stack helpers"
```

---

## Task 5: Pairing recipes and the generation script

**Files:**
- Create: `data/recipes.ts`
- Create: `data/pairings.curated.json`
- Create: `scripts/generate-pairings.ts`
- Create: `src/lib/generate.test.ts`
- Create: `src/lib/lint.ts` (created here because generation and validation must share `isAcceptablePair`)

**Interfaces:**
- Consumes: `Font`, `Pairing`, `Recipe` from `src/lib/types.ts`; `data/fonts.json`.
- Produces: `isAcceptablePair(a: Font, b: Font): boolean`, `renderRationale(recipe, a, b, index): string`, `generatePairings(fonts: Font[], recipes: Recipe[]): Pairing[]`; the file `data/pairings.json`. Task 6 and Task 7 depend on all of these.

- [ ] **Step 1: Write `src/lib/lint.ts` — starting with the shared pair predicate**

Later tasks add the `lintData` function to this file; this step creates it with the predicate that generation and validation must agree on.

```ts
import type { Font, Pairing } from "./types";

export const ALLOWED_LICENSES = ["OFL-1.1", "Apache-2.0", "UFL"] as const;

const MIN_RATIONALE_LENGTH = 90;

/**
 * The single definition of a valid pair. The generator uses it to decide what to
 * emit; the lint gate uses it to decide what to accept. They must never diverge,
 * which is why it lives here rather than in either caller.
 */
export function isAcceptablePair(a: Font, b: Font): boolean {
  if (a.slug === b.slug) return false;
  if (a.category === "display" && b.category === "display") return false;
  if (a.category === "handwriting" && b.category === "handwriting") return false;
  const shared = a.tags.filter((tag) => b.tags.includes(tag));
  if (a.category === b.category && shared.length > 0) return false;
  return true;
}

export function lintReason(value: string): string | null {
  if (value.length < MIN_RATIONALE_LENGTH) return "rationale is too short";
  if (value.includes("{")) return "rationale has an unresolved template placeholder";
  return null;
}

export type { Font, Pairing };
```

- [ ] **Step 2: Write `data/recipes.ts`**

```ts
import type { Recipe } from "../src/lib/types";

export const recipes: Recipe[] = [
  {
    id: "didone-humanist",
    heading: { category: "serif", tagsAny: ["high-contrast", "editorial"] },
    body: { category: "sans-serif", tagsAny: ["humanist", "neutral"] },
    rationaleTemplates: [
      "{A} brings a {A_trait} headline; {B} answers with a {B_trait} body that keeps long text comfortable underneath it.",
      "The contrast is the point here: {A}'s {A_trait} letterforms set against the even rhythm of {B}'s {B_trait} lowercase.",
      "Set {A} at display size and {B} everywhere else — the {A_trait} headline carries the personality while the {B_trait} body carries the reading.",
      "Pair {A} with {B} when the headline should feel considered and the body should stay quiet. {A} supplies the {A_trait} drama; {B} supplies the calm.",
    ],
    styles: ["editorial", "luxury"],
  },
  {
    id: "serif-interface",
    heading: { category: "serif", tagsAny: ["editorial", "readable", "brushed", "sturdy"] },
    body: { category: "sans-serif", tagsAny: ["neutral", "ui", "geometric"] },
    rationaleTemplates: [
      "{A} gives the page a {A_trait} voice at heading sizes, and {B} takes over for interface copy without arguing with it.",
      "Use {A} where the text is doing persuasion and {B} where it is doing work — the {A_trait} headline against a {B_trait} body.",
      "The pairing works because the two faces never compete: {A} is the {A_trait} of the page, and {B} is the neutral {B_trait} that lets it stand out.",
      "{A} for headlines, {B} for everything that has to stay out of the way. A {A_trait} opening line over a {B_trait} paragraph.",
    ],
    styles: ["editorial", "startup", "minimal"],
  },
  {
    id: "display-neutral",
    heading: { category: "display", tagsAny: ["technical", "bold"] },
    body: { category: "sans-serif", tagsAny: ["neutral", "ui", "geometric"] },
    rationaleTemplates: [
      "{A} is too loud to set a paragraph in, which is exactly why it works as a headline — with {B} doing the {B_trait} reading underneath.",
      "Let {A} handle the {A_trait} first impression and {B} handle the reading. Neither face is asked to do the other's job.",
      "{A}'s {A_trait} forms give the page a hard edge; {B}'s neutral body keeps it usable at length.",
      "A {A_trait} headline over a quiet body: {A} at the top, {B} for the rest, and no third face needed.",
    ],
    styles: ["startup", "bold"],
  },
  {
    id: "serif-with-serif",
    heading: { category: "serif", tagsAny: ["editorial", "high-contrast", "brushed"] },
    body: { category: "serif", tagsAny: ["readable", "academic", "sturdy"] },
    rationaleTemplates: [
      "Two serifs only work when they are clearly different jobs: {A} is the {A_trait} display face, {B} is the {B_trait} workhorse beneath it.",
      "{A} sets the tone at heading sizes and {B} does the reading. The {A_trait} opening line against a {B_trait} paragraph keeps the page from feeling flat.",
      "This is a serif-on-serif pairing that avoids the usual mush — {A} stays decorative up top while {B} stays legible in the body.",
      "Choose {A} when you want a {A_trait} headline with a literary edge, and {B} when the body has to survive a long article.",
    ],
    styles: ["editorial", "academic"],
  },
  {
    id: "script-accent",
    heading: { category: "handwriting", tagsAny: ["playful", "personal", "casual"] },
    body: { category: "sans-serif", tagsAny: ["neutral", "humanist", "geometric"] },
    rationaleTemplates: [
      "{A} is an accent, not a headline: use it for one short line, then let {B} carry everything else.",
      "Pair {A}'s {A_trait} informality with {B}'s {B_trait} steadiness, and keep {A} to a few words at a time.",
      "The {A_trait} script gives the page a personal note; {B} keeps the rest of it readable at {B_trait} default.",
      "Use {A} where a handwritten touch earns its place and {B} everywhere it does not. The contrast is the whole effect.",
    ],
    styles: ["playful", "wedding"],
  },
];
```

- [ ] **Step 3: Write `data/pairings.curated.json`**

These are hand-written and get the `curated: true` and `featured: true` flags. They must satisfy `isAcceptablePair`.

```json
[
  {
    "slug": "playfair-display-lato",
    "a": "playfair-display",
    "b": "lato",
    "recipe": "didone-humanist",
    "rationale": "Playfair Display's high stroke contrast needs a body face that will not compete with it. Lato is that face: it holds long paragraphs at a warm, even rhythm, so the Didone headline stays the only thing asking for attention.",
    "useCases": ["editorial", "luxury", "wedding"],
    "styles": ["editorial", "luxury"],
    "samples": {
      "heading": "A quiet kind of luxury",
      "sub": "Editorial layout, 2026",
      "body": "Lato keeps long paragraphs readable beneath a high-contrast Didone headline."
    },
    "featured": true,
    "curated": true
  },
  {
    "slug": "lora-inter",
    "a": "lora",
    "b": "inter",
    "recipe": "serif-interface",
    "rationale": "Lora gives a page a literary voice at heading sizes without becoming precious, and Inter takes over for interface copy without arguing with it. Neither face is doing the other's job, which is what keeps the pairing calm.",
    "useCases": ["editorial", "blog", "startup"],
    "styles": ["editorial", "minimal"],
    "samples": {
      "heading": "Notes on setting type",
      "sub": "A working notebook",
      "body": "Inter handles the interface while Lora handles the argument."
    },
    "featured": true,
    "curated": true
  }
]
```

- [ ] **Step 4: Write the failing test for generation**

`src/lib/generate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderRationale } from "./generate";
import { isAcceptablePair } from "./lint";
import type { Font, Recipe } from "./types";

const base: Font = {
  slug: "a",
  name: "Alpha",
  category: "serif",
  weights: [400],
  tags: ["editorial"],
  trait: "sharp serif",
  character: "",
  popularity: 50,
  license: "OFL-1.1",
};

const beta: Font = { ...base, slug: "b", name: "Beta", category: "sans-serif", tags: ["neutral"], trait: "plain sans" };

const recipe: Recipe = {
  id: "r",
  heading: { category: "serif", tagsAny: ["editorial"] },
  body: { category: "sans-serif", tagsAny: ["neutral"] },
  rationaleTemplates: ["{A} is a {A_trait} face and {B} is a {B_trait} face."],
  styles: ["editorial"],
};

describe("renderRationale", () => {
  it("substitutes both names and both traits", () => {
    const out = renderRationale(recipe, base, beta, 0);
    expect(out).toBe("Alpha is a sharp serif face and Beta is a plain sans face.");
    expect(out).not.toContain("{");
  });

  it("rotates templates by index", () => {
    const two: Recipe = { ...recipe, rationaleTemplates: ["first {A}", "second {A}"] };
    expect(renderRationale(two, base, beta, 0)).toBe("first Alpha");
    expect(renderRationale(two, base, beta, 1)).toBe("second Alpha");
    expect(renderRationale(two, base, beta, 2)).toBe("first Alpha");
  });

  it("substitutes a repeated placeholder everywhere it appears", () => {
    const repeated: Recipe = { ...recipe, rationaleTemplates: ["{A} then {B} then {A}"] };
    const out = renderRationale(repeated, base, beta, 0);
    expect(out).toBe("Alpha then Beta then Alpha");
  });
});

describe("isAcceptablePair", () => {
  it("accepts two faces from different categories", () => {
    expect(isAcceptablePair(base, beta)).toBe(true);
  });

  it("rejects a font paired with itself", () => {
    expect(isAcceptablePair(base, base)).toBe(false);
  });

  it("rejects two displays", () => {
    const d1: Font = { ...base, slug: "d1", category: "display" };
    const d2: Font = { ...base, slug: "d2", category: "display" };
    expect(isAcceptablePair(d1, d2)).toBe(false);
  });

  it("rejects two handwritings", () => {
    const h1: Font = { ...base, slug: "h1", category: "handwriting" };
    const h2: Font = { ...base, slug: "h2", category: "handwriting" };
    expect(isAcceptablePair(h1, h2)).toBe(false);
  });

  it("rejects same-category faces that share a tag", () => {
    const s1: Font = { ...base, slug: "s1", category: "serif", tags: ["editorial"] };
    const s2: Font = { ...base, slug: "s2", category: "serif", tags: ["editorial", "sturdy"] };
    expect(isAcceptablePair(s1, s2)).toBe(false);
  });

  it("accepts same-category faces with no shared tag", () => {
    const s1: Font = { ...base, slug: "s1", category: "serif", tags: ["editorial"] };
    const s2: Font = { ...base, slug: "s2", category: "serif", tags: ["academic"] };
    expect(isAcceptablePair(s1, s2)).toBe(true);
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npx vitest run src/lib/generate.test.ts`
Expected: FAIL — "Failed to resolve import ./generate".

- [ ] **Step 6: Write `src/lib/generate.ts`**

```ts
import type { Font, Pairing, Recipe } from "./types";
import { isAcceptablePair } from "./lint";

const SAMPLE_SETS: Pairing["samples"][] = [
  {
    heading: "Set the tone at the top",
    sub: "A pairing test",
    body: "The body face does the reading, so it should stay quiet and even.",
  },
  {
    heading: "Every page needs two voices",
    sub: "Display, then workhorse",
    body: "One face carries the personality and the other carries the paragraph.",
  },
  {
    heading: "Contrast is the whole idea",
    sub: "Two faces, two jobs",
    body: "A pairing fails when both faces are asking for the same attention.",
  },
  {
    heading: "Typography is a hierarchy",
    sub: "Decide what speaks first",
    body: "If everything is emphasised, nothing is. Give each face one clear job.",
  },
];

export function renderRationale(
  recipe: Recipe,
  a: Font,
  b: Font,
  index: number,
): string {
  const template =
    recipe.rationaleTemplates[index % recipe.rationaleTemplates.length];
  return template
    .replaceAll("{A}", a.name)
    .replaceAll("{B}", b.name)
    .replaceAll("{A_trait}", a.trait)
    .replaceAll("{B_trait}", b.trait);
}

function matches(font: Font, spec: Recipe["heading"]): boolean {
  return (
    font.category === spec.category &&
    font.tags.some((tag) => spec.tagsAny.includes(tag))
  );
}

export function generatePairings(fonts: Font[], recipes: Recipe[]): Pairing[] {
  const out: Pairing[] = [];
  const seen = new Set<string>();

  for (const recipe of recipes) {
    const headings = fonts.filter((font) => matches(font, recipe.heading));
    const bodies = fonts.filter((font) => matches(font, recipe.body));
    let index = 0;

    for (const a of headings) {
      for (const b of bodies) {
        if (!isAcceptablePair(a, b)) continue;
        const key = [a.slug, b.slug].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);

        out.push({
          slug: `${a.slug}-${b.slug}`,
          a: a.slug,
          b: b.slug,
          recipe: recipe.id,
          rationale: renderRationale(recipe, a, b, index),
          useCases: recipe.styles,
          styles: recipe.styles,
          samples: SAMPLE_SETS[index % SAMPLE_SETS.length],
          featured: false,
          curated: false,
        });
        index += 1;
      }
    }
  }

  return out;
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run src/lib/generate.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 8: Write `scripts/generate-pairings.ts`**

Curated pairings win over generated ones on slug collision, and the output is sorted so regenerating produces a stable diff.

```ts
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generatePairings } from "../src/lib/generate";
import { recipes } from "../data/recipes";
import type { Font, Pairing } from "../src/lib/types";

const root = resolve(__dirname, "..");
const fonts: Font[] = JSON.parse(
  readFileSync(resolve(root, "data/fonts.json"), "utf8"),
);
const curated: Pairing[] = JSON.parse(
  readFileSync(resolve(root, "data/pairings.curated.json"), "utf8"),
);

const generated = generatePairings(fonts, recipes);
const bySlug = new Map<string, Pairing>();

for (const pairing of generated) bySlug.set(pairing.slug, pairing);
// Curated entries overwrite generated ones with the same slug.
for (const pairing of curated) bySlug.set(pairing.slug, pairing);

const merged = [...bySlug.values()].sort((x, y) => x.slug.localeCompare(y.slug));

writeFileSync(
  resolve(root, "data/pairings.json"),
  `${JSON.stringify(merged, null, 2)}\n`,
);

console.log(
  `Wrote ${merged.length} pairings (${curated.length} curated, ${merged.length - curated.length} generated).`,
);
```

- [ ] **Step 9: Run the generator and inspect the output**

Run: `npm run pairings:generate`
Expected: prints a count ≥ 8, and `data/pairings.json` exists. Use `node -e "const p=require('./data/pairings.json'); console.log(p.length); console.log(p.slice(0,3).map(x=>x.rationale).join('\n\n'))"` and read the rationales: they must read as English sentences with both font names present and no `{` characters.

- [ ] **Step 10: Commit**

```bash
git add src/lib/lint.ts src/lib/generate.ts src/lib/generate.test.ts data/recipes.ts data/pairings.curated.json data/pairings.json scripts/generate-pairings.ts
git commit -m "feat: pairing recipes, generation, and the shared pair predicate"
```

---

## Task 6: The lint gate

**Files:**
- Modify: `src/lib/lint.ts`
- Create: `src/lib/lint.test.ts`
- Create: `scripts/lint-data.ts`

**Interfaces:**
- Consumes: `isAcceptablePair`, `lintReason`, `ALLOWED_LICENSES` from `src/lib/lint.ts` (Task 5); `data/fonts.json`; `data/pairings.json`.
- Produces: `lintData(fonts: Font[], pairings: Pairing[]): string[]` returning one message per failure (empty array = clean). Wired into `npm run build` by Task 1's `package.json`.

- [ ] **Step 1: Write the failing test**

`src/lib/lint.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { lintData } from "./lint";
import type { Font, Pairing } from "./types";

const serif: Font = {
  slug: "alpha-serif",
  name: "Alpha Serif",
  category: "serif",
  weights: [400, 700],
  tags: ["editorial"],
  trait: "sharp serif",
  character: "",
  popularity: 50,
  license: "OFL-1.1",
};

const sans: Font = {
  ...serif,
  slug: "beta-sans",
  name: "Beta Sans",
  category: "sans-serif",
  tags: ["neutral"],
  trait: "plain sans",
};

const goodRationale =
  "Alpha Serif is a sharp serif face and Beta Sans is a plain sans face, which keeps the two from competing.";

function pairing(overrides: Partial<Pairing> = {}): Pairing {
  return {
    slug: "alpha-serif-beta-sans",
    a: "alpha-serif",
    b: "beta-sans",
    recipe: "r",
    rationale: goodRationale,
    useCases: ["editorial"],
    styles: ["editorial"],
    samples: { heading: "h", sub: "s", body: "b" },
    featured: false,
    curated: false,
    ...overrides,
  };
}

describe("lintData", () => {
  it("returns no errors for clean data", () => {
    expect(lintData([serif, sans], [pairing()])).toEqual([]);
  });

  it("rejects a font with a non-open license", () => {
    const bad = { ...serif, license: "Commercial" as never };
    const errors = lintData([bad, sans], [pairing()]);
    expect(errors.some((e) => e.includes("license"))).toBe(true);
  });

  it("rejects a pairing that references an unknown font", () => {
    const errors = lintData([serif, sans], [pairing({ b: "nope" })]);
    expect(errors.some((e) => e.includes("unknown body font nope"))).toBe(true);
  });

  it("rejects a duplicate pair in either order", () => {
    const reversed = pairing({ slug: "beta-sans-alpha-serif", a: "beta-sans", b: "alpha-serif" });
    const errors = lintData([serif, sans], [pairing(), reversed]);
    expect(errors.some((e) => e.includes("duplicate pair"))).toBe(true);
  });

  it("rejects a pairing with no use cases", () => {
    const errors = lintData([serif, sans], [pairing({ useCases: [] })]);
    expect(errors.some((e) => e.includes("no useCases"))).toBe(true);
  });

  it("rejects an empty body sample", () => {
    const errors = lintData([serif, sans], [pairing({ samples: { heading: "h", sub: "s", body: "  " } })]);
    expect(errors.some((e) => e.includes("empty samples.body"))).toBe(true);
  });

  it("rejects an unacceptable pair", () => {
    const a = { ...serif, slug: "s1", tags: ["editorial"] };
    const b = { ...serif, slug: "s2", tags: ["editorial"] };
    const p = pairing({ a: "s1", b: "s2" });
    const errors = lintData([a, b], [p]);
    expect(errors.some((e) => e.includes("unacceptable pair"))).toBe(true);
  });

  it("rejects an identical rationale used twice", () => {
    const second = pairing({ slug: "x-y", a: "alpha-serif", b: "beta-sans" });
    const errors = lintData([serif, sans], [pairing({ slug: "one" }), { ...second, slug: "two" }]);
    expect(errors.some((e) => e.includes("identical to"))).toBe(true);
  });

  it("rejects a rationale that names only one of the two fonts", () => {
    const errors = lintData([serif, sans], [
      pairing({ rationale: "Alpha Serif is nice and should be used for headings on a page like this one." }),
    ]);
    expect(errors.some((e) => e.includes("missing font name"))).toBe(true);
  });

  it("rejects a rationale with an unresolved placeholder", () => {
    const errors = lintData([serif, sans], [
      pairing({
        rationale: "Alpha Serif pairs with {B_trait} Beta Sans and the combination reads well in body copy.",
      }),
    ]);
    expect(errors.some((e) => e.includes("unresolved"))).toBe(true);
  });

  it("rejects a short rationale", () => {
    const errors = lintData([serif, sans], [pairing({ rationale: "Alpha Serif and Beta Sans." })]);
    expect(errors.some((e) => e.includes("too short"))).toBe(true);
  });

  it("requires every template variant to be used when a recipe emits enough pairings", () => {
    const recipes = [{ id: "r", templates: 2 }];
    const p1 = pairing({ slug: "one", rationale: "Alpha Serif with Beta Sans keeps the headline loud and the body quiet." });
    const p2 = pairing({ slug: "two", rationale: "Alpha Serif with Beta Sans keeps the headline loud and the body calm." });
    // Both use template index 0 → variant 1 never appears.
    const errors = lintData([serif, sans], [p1, p2], recipes);
    expect(errors.some((e) => e.includes("template variants"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/lint.test.ts`
Expected: FAIL — `lintData` is not exported.

- [ ] **Step 3: Extend `src/lib/lint.ts`**

Replace the trailing `export type { Font, Pairing };` line with the following, leaving `ALLOWED_LICENSES`, `isAcceptablePair`, and `lintReason` as they are.

```ts
export interface RecipeShape {
  id: string;
  /** Number of rationale templates this recipe defines. */
  templates: number;
}

export function lintData(
  fonts: Font[],
  pairings: Pairing[],
  recipes: RecipeShape[] = [],
): string[] {
  const errors: string[] = [];
  const fontBySlug = new Map(fonts.map((font) => [font.slug, font]));
  const rationaleOwner = new Map<string, string>();
  const seenPair = new Set<string>();
  const templateUse = new Map<string, Set<number>>();

  for (const font of fonts) {
    if (!(ALLOWED_LICENSES as readonly string[]).includes(font.license)) {
      errors.push(
        `font ${font.slug}: license ${font.license} is not one of ${ALLOWED_LICENSES.join(", ")}`,
      );
    }
  }

  for (const pairing of pairings) {
    const a = fontBySlug.get(pairing.a);
    const b = fontBySlug.get(pairing.b);

    if (!a) errors.push(`pairing ${pairing.slug}: unknown heading font ${pairing.a}`);
    if (!b) errors.push(`pairing ${pairing.slug}: unknown body font ${pairing.b}`);
    if (!a || !b) continue;

    const pairKey = [pairing.a, pairing.b].sort().join("|");
    if (seenPair.has(pairKey)) errors.push(`pairing ${pairing.slug}: duplicate pair ${pairKey}`);
    seenPair.add(pairKey);

    if (!isAcceptablePair(a, b)) {
      errors.push(`pairing ${pairing.slug}: unacceptable pair ${a.slug}/${b.slug}`);
    }

    const previous = rationaleOwner.get(pairing.rationale);
    if (previous) errors.push(`pairing ${pairing.slug}: rationale identical to ${previous}`);
    rationaleOwner.set(pairing.rationale, pairing.slug);

    if (!pairing.rationale.includes(a.name)) {
      errors.push(`pairing ${pairing.slug}: rationale is missing font name ${a.name}`);
    }
    if (!pairing.rationale.includes(b.name)) {
      errors.push(`pairing ${pairing.slug}: rationale is missing font name ${b.name}`);
    }

    const reason = lintReason(pairing.rationale);
    if (reason) errors.push(`pairing ${pairing.slug}: ${reason}`);

    if (pairing.useCases.length === 0) errors.push(`pairing ${pairing.slug}: no useCases`);
    if (!pairing.samples.body.trim()) errors.push(`pairing ${pairing.slug}: empty samples.body`);
    if (pairing.styles.length === 0) errors.push(`pairing ${pairing.slug}: no styles`);
  }

  // Within a recipe, every template variant must be exercised once the recipe has
  // emitted at least as many pairings as it has templates. Catches rotation bugs
  // that would otherwise quietly ship near-identical copy.
  if (recipes.length > 0) {
    for (const pairing of pairings) {
      const used = templateUse.get(pairing.recipe) ?? new Set<number>();
      used.add(0);
      templateUse.set(pairing.recipe, used);
    }
    const counts = new Map<string, number>();
    for (const pairing of pairings) {
      counts.set(pairing.recipe, (counts.get(pairing.recipe) ?? 0) + 1);
    }
    for (const recipe of recipes) {
      const count = counts.get(recipe.id) ?? 0;
      if (count < recipe.templates) continue;
      const used = templateUse.get(recipe.id) ?? new Set<number>();
      if (used.size < recipe.templates) {
        errors.push(
          `recipe ${recipe.id}: only ${used.size} of ${recipe.templates} template variants were used across ${count} pairings`,
        );
      }
    }
  }

  return errors;
}

export type { Font, Pairing };
```

> **Note for the implementer:** in this task the template-variant check is exercised only by the unit test. Task 7's `generate-pairings.ts` change makes it meaningful for real data by recording which template index each pairing used.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/lint.test.ts`
Expected: PASS (12 tests).

- [ ] **Step 5: Write `scripts/lint-data.ts`**

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { lintData, type Font, type Pairing } from "../src/lib/lint";
import { recipes } from "../data/recipes";

const root = resolve(__dirname, "..");
const fonts: Font[] = JSON.parse(readFileSync(resolve(root, "data/fonts.json"), "utf8"));
const pairings: Pairing[] = JSON.parse(
  readFileSync(resolve(root, "data/pairings.json"), "utf8"),
);

const shapes = recipes.map((recipe) => ({
  id: recipe.id,
  templates: recipe.rationaleTemplates.length,
}));

const errors = lintData(fonts, pairings, shapes);

if (errors.length > 0) {
  console.error(`lint:data failed with ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`lint:data OK — ${fonts.length} fonts, ${pairings.length} pairings.`);
```

- [ ] **Step 6: Run the gate against the real data**

Run: `npm run lint:data`
Expected: `lint:data OK — 8 fonts, N pairings.` with exit code 0. If it reports short or placeholder-containing rationales, fix `data/recipes.ts` templates — do not loosen the check.

- [ ] **Step 7: Verify the gate actually fails the build**

Temporarily edit one rationale in `data/pairings.json` to remove a font name, run `npm run lint:data`, confirm exit code 1 and a `missing font name` message, then revert.

Run: `npm run lint:data; echo "exit=$?"`
Expected: `exit=1` while the edit is in place.

- [ ] **Step 8: Commit**

```bash
git add src/lib/lint.ts src/lib/lint.test.ts scripts/lint-data.ts
git commit -m "feat: lint-data gate wired into the build"
```

---

## Task 7: Record template indices so the diversity check is real

**Files:**
- Modify: `src/lib/types.ts` (add `rationaleTemplate` to `Pairing`)
- Modify: `src/lib/generate.ts`
- Modify: `src/lib/lint.ts`
- Regenerate: `data/pairings.json` (rewritten by `npm run pairings:generate`)
- Modify: `src/lib/lint.test.ts`

`data/pairings.curated.json` is deliberately **not** touched: `rationaleTemplate` is optional, and a hand-written pairing legitimately carries no template index.

**Interfaces:**
- Consumes: everything from Tasks 5 and 6.
- Produces: `Pairing.rationaleTemplate?: number` — the template index a generated pairing used. `lintData` now uses it instead of the placeholder `Set<number>` stub from Task 6.

- [ ] **Step 1: Update the failing test first**

In `src/lib/lint.test.ts`, replace the last test (`"requires every template variant to be used…"`) with:

```ts
  it("requires every template variant to be used when a recipe emits enough pairings", () => {
    const shapes = [{ id: "r", templates: 2 }];
    const p1 = pairing({
      slug: "one",
      rationaleTemplate: 0,
      rationale: "Alpha Serif with Beta Sans keeps the headline loud and the body quiet here.",
    });
    const p2 = pairing({
      slug: "two",
      rationaleTemplate: 0,
      rationale: "Alpha Serif with Beta Sans keeps the headline loud and the body settled here.",
    });
    const errors = lintData([serif, sans], [p1, p2], shapes);
    expect(errors.some((e) => e.includes("template variants"))).toBe(true);
  });

  it("accepts a recipe that exercises every template variant", () => {
    const shapes = [{ id: "r", templates: 2 }];
    const p1 = pairing({
      slug: "one",
      rationaleTemplate: 0,
      rationale: "Alpha Serif with Beta Sans keeps the headline loud and the body quiet here.",
    });
    const p2 = pairing({
      slug: "two",
      rationaleTemplate: 1,
      rationale: "Alpha Serif with Beta Sans keeps the headline loud and the body settled here.",
    });
    const errors = lintData([serif, sans], [p1, p2], shapes);
    expect(errors).toEqual([]);
  });
```

Also add `rationaleTemplate: undefined` to the `pairing()` factory's default object so the type is satisfied:

```ts
  return {
    slug: "alpha-serif-beta-sans",
    a: "alpha-serif",
    b: "beta-sans",
    recipe: "r",
    rationale: goodRationale,
    rationaleTemplate: 0,
    useCases: ["editorial"],
    styles: ["editorial"],
    samples: { heading: "h", sub: "s", body: "b" },
    featured: false,
    curated: false,
    ...overrides,
  };
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/lint.test.ts`
Expected: FAIL — `rationaleTemplate` is not a known property.

- [ ] **Step 3: Add the field to `src/lib/types.ts`**

In the `Pairing` interface, directly after `recipe: string;`:

```ts
  /** Which rationale template index produced this pairing. Absent on curated entries. */
  rationaleTemplate?: number;
```

- [ ] **Step 4: Set it in `src/lib/generate.ts`**

In the `out.push({...})` object inside `generatePairings`, add after `recipe: recipe.id,`:

```ts
          rationaleTemplate: index % recipe.rationaleTemplates.length,
```

- [ ] **Step 5: Use it in `src/lib/lint.ts`**

Replace this block from Task 6:

```ts
  if (recipes.length > 0) {
    for (const pairing of pairings) {
      const used = templateUse.get(pairing.recipe) ?? new Set<number>();
      used.add(0);
      templateUse.set(pairing.recipe, used);
    }
    const counts = new Map<string, number>();
```

with:

```ts
  if (recipes.length > 0) {
    for (const pairing of pairings) {
      if (pairing.rationaleTemplate === undefined) continue;
      const used = templateUse.get(pairing.recipe) ?? new Set<number>();
      used.add(pairing.rationaleTemplate);
      templateUse.set(pairing.recipe, used);
    }
    const counts = new Map<string, number>();
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/lib/lint.test.ts`
Expected: PASS (13 tests).

- [ ] **Step 7: Regenerate and re-lint the real data**

Run: `npm run pairings:generate && npm run lint:data`
Expected: exit 0. If a recipe reports unused template variants, that recipe emitted fewer pairings than templates — add fonts until it does, or reduce that recipe's template count.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: record rationale template index and enforce template diversity"
```

---

## Task 8: Query layer over the data

**Files:**
- Create: `src/lib/pairings.ts`
- Create: `src/lib/pairings.test.ts`
- Create: `data/styles.ts`

**Interfaces:**
- Consumes: `data/fonts.json`, `data/pairings.json`, `src/lib/types.ts`.
- Produces: `fonts`, `pairings`, `getFont(slug)`, `getPairing(slug)`, `fontPairings(slug)`, `pairingsByStyle(style)`, `relatedPairings(pairing, limit)`, `fontsWithPairings()`, and `styles` from `data/styles.ts`. Every page task consumes these.

- [ ] **Step 1: Write `data/styles.ts`**

```ts
import type { StyleTag } from "../src/lib/types";

/** Only styles that at least one pairing carries are reachable; the rest are
 *  listed here so the vocabulary is fixed, and Task 15 generates a page for
 *  any style with pairings. */
export const styles: StyleTag[] = [
  { slug: "editorial", name: "Editorial", description: "Pairings that read like a considered magazine page." },
  { slug: "luxury", name: "Luxury", description: "High-contrast pairings with room to breathe." },
  { slug: "minimal", name: "Minimal", description: "Quiet pairings that stay out of the way." },
  { slug: "startup", name: "Startup", description: "Confident headings over a neutral, usable body." },
  { slug: "academic", name: "Academic", description: "Serif pairings built for long-form reading." },
  { slug: "playful", name: "Playful", description: "A handwritten note against something steady." },
  { slug: "wedding", name: "Wedding", description: "Script accents over warm, readable body text." },
  { slug: "bold", name: "Bold", description: "Loud display faces that need a calm partner." },
];
```

- [ ] **Step 2: Write the failing test**

`src/lib/pairings.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getFont,
  getPairing,
  fontPairings,
  pairingsByStyle,
  relatedPairings,
  fontsWithPairings,
  fonts,
  pairings,
} from "./pairings";
import { styles } from "../../data/styles";

describe("the data actually loaded", () => {
  it("has fonts", () => {
    expect(fonts.length).toBeGreaterThan(0);
  });

  it("has pairings", () => {
    expect(pairings.length).toBeGreaterThan(0);
  });
});

describe("getFont", () => {
  it("finds a known font", () => {
    expect(getFont("playfair-display")?.name).toBe("Playfair Display");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getFont("nope")).toBeUndefined();
  });
});

describe("getPairing", () => {
  it("looks a pairing up by its full slug without parsing hyphens", () => {
    expect(getPairing("playfair-display-lato")?.a).toBe("playfair-display");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPairing("nope-nope")).toBeUndefined();
  });
});

describe("fontPairings", () => {
  it("returns pairings where the font appears on either side", () => {
    const found = fontPairings("playfair-display");
    expect(found.length).toBeGreaterThan(0);
    for (const pairing of found) {
      expect([pairing.a, pairing.b]).toContain("playfair-display");
    }
  });

  it("returns an empty array for a font with no pairings", () => {
    expect(fontPairings("does-not-exist")).toEqual([]);
  });
});

describe("pairingsByStyle", () => {
  it("returns only pairings carrying that style", () => {
    const found = pairingsByStyle("editorial");
    expect(found.length).toBeGreaterThan(0);
    for (const pairing of found) expect(pairing.styles).toContain("editorial");
  });
});

describe("relatedPairings", () => {
  it("never returns the pairing itself and respects the limit", () => {
    const subject = pairings[0];
    const related = relatedPairings(subject, 2);
    expect(related.length).toBeLessThanOrEqual(2);
    expect(related.map((p) => p.slug)).not.toContain(subject.slug);
  });

  it("shares at least one style with the subject", () => {
    const subject = pairings[0];
    for (const other of relatedPairings(subject, 4)) {
      expect(other.styles.some((s) => subject.styles.includes(s))).toBe(true);
    }
  });
});

describe("fontsWithPairings", () => {
  it("excludes fonts that appear in no pairing", () => {
    const used = new Set(pairings.flatMap((p) => [p.a, p.b]));
    for (const font of fontsWithPairings()) {
      expect(used.has(font.slug)).toBe(true);
    }
  });
});

describe("styles", () => {
  it("every style slug is unique", () => {
    expect(new Set(styles.map((s) => s.slug)).size).toBe(styles.length);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/lib/pairings.test.ts`
Expected: FAIL — "Failed to resolve import ./pairings".

- [ ] **Step 4: Write `src/lib/pairings.ts`**

```ts
import fontsData from "../../data/fonts.json";
import pairingsData from "../../data/pairings.json";
import type { Font, Pairing } from "./types";

export const fonts = fontsData as Font[];
export const pairings = pairingsData as Pairing[];

const fontBySlug = new Map(fonts.map((font) => [font.slug, font]));
const pairingBySlug = new Map(pairings.map((pairing) => [pairing.slug, pairing]));
const pairingSlugsByFont = new Map<string, Pairing[]>();

for (const pairing of pairings) {
  for (const slug of [pairing.a, pairing.b]) {
    const list = pairingSlugsByFont.get(slug) ?? [];
    list.push(pairing);
    pairingSlugsByFont.set(slug, list);
  }
}

export function getFont(slug: string): Font | undefined {
  return fontBySlug.get(slug);
}

/**
 * Pairing slugs are `{headingSlug}-{bodySlug}` and font slugs contain hyphens, so
 * the slug can never be split back apart. Look it up instead.
 */
export function getPairing(slug: string): Pairing | undefined {
  return pairingBySlug.get(slug);
}

export function fontPairings(slug: string): Pairing[] {
  return pairingSlugsByFont.get(slug) ?? [];
}

export function pairingsByStyle(style: string): Pairing[] {
  return pairings.filter((pairing) => pairing.styles.includes(style));
}

export function relatedPairings(pairing: Pairing, limit = 4): Pairing[] {
  return pairings
    .filter(
      (other) =>
        other.slug !== pairing.slug &&
        other.styles.some((style) => pairing.styles.includes(style)),
    )
    .slice(0, limit);
}

export function fontsWithPairings(): Font[] {
  return fonts.filter((font) => (pairingSlugsByFont.get(font.slug)?.length ?? 0) > 0);
}

/** Styles that actually have pairings behind them, in the order declared in styles.ts. */
export function stylesWithPairings(): string[] {
  const present = new Set(pairings.flatMap((pairing) => pairing.styles));
  return [...present];
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/pairings.test.ts`
Expected: PASS (13 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/pairings.ts src/lib/pairings.test.ts data/styles.ts
git commit -m "feat: read-only query layer over the pairing data"
```

---

## Task 9: Generator logic — weighted shuffle and URL state

**Files:**
- Create: `src/lib/generator.ts`
- Create: `src/lib/generator.test.ts`

**Interfaces:**
- Consumes: `Font`, `Pairing` from `src/lib/types.ts`.
- Produces: `parseGeneratorParams(search: string): { heading?: string; body?: string }`, `buildGeneratorQuery(state): string`, `weightForPairing(pairing, fontBySlug): number`, `pickWeighted(pool, weights, rng?): Pairing | null`, `SAMPLE_STORAGE_KEY`. Task 11 consumes all of these.

- [ ] **Step 1: Write the failing test**

`src/lib/generator.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  parseGeneratorParams,
  buildGeneratorQuery,
  weightForPairing,
  pickWeighted,
  SAMPLE_STORAGE_KEY,
} from "./generator";
import type { Font, Pairing } from "./types";

const font: Font = {
  slug: "a",
  name: "Alpha",
  category: "serif",
  weights: [400],
  tags: [],
  trait: "",
  character: "",
  popularity: 50,
  license: "OFL-1.1",
};

const other: Font = { ...font, slug: "b", name: "Beta", popularity: 30 };
const fontBySlug = new Map([["a", font], ["b", other]]);

const pairing: Pairing = {
  slug: "a-b",
  a: "a",
  b: "b",
  recipe: "r",
  rationale: "x".repeat(100),
  useCases: ["editorial"],
  styles: ["editorial"],
  samples: { heading: "h", sub: "s", body: "b" },
  featured: false,
  curated: false,
};

describe("parseGeneratorParams", () => {
  it("reads both font slugs", () => {
    expect(parseGeneratorParams("?h=a&b=b")).toEqual({ heading: "a", body: "b" });
  });

  it("omits missing params rather than emitting empty strings", () => {
    expect(parseGeneratorParams("?h=a")).toEqual({ heading: "a" });
    expect(parseGeneratorParams("")).toEqual({});
  });

  it("ignores empty values", () => {
    expect(parseGeneratorParams("?h=&b=")).toEqual({});
  });
});

describe("buildGeneratorQuery", () => {
  it("round-trips through parseGeneratorParams", () => {
    const state = { heading: "playfair-display", body: "lato" };
    expect(parseGeneratorParams(buildGeneratorQuery(state))).toEqual(state);
  });

  it("encodes and prefixes with a question mark", () => {
    expect(buildGeneratorQuery({ heading: "a b", body: "c" })).toBe("?h=a+b&b=c");
  });
});

describe("weightForPairing", () => {
  it("weights featured pairings far above unfeatured ones", () => {
    const featured = { ...pairing, featured: true };
    expect(weightForPairing(featured, fontBySlug)).toBeGreaterThan(
      weightForPairing(pairing, fontBySlug) * 5,
    );
  });

  it("adds both fonts' popularity", () => {
    expect(weightForPairing(pairing, fontBySlug)).toBe(80);
  });

  it("treats an unknown font as zero popularity", () => {
    const orphan = { ...pairing, b: "zzz" };
    expect(weightForPairing(orphan, fontBySlug)).toBe(50);
  });
});

describe("pickWeighted", () => {
  const pool = [pairing, { ...pairing, slug: "c-d" }];

  it("returns null for an empty pool", () => {
    expect(pickWeighted([], [])).toBeNull();
  });

  it("always returns an element of the pool", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(pool).toContain(pickWeighted(pool, [1, 1]));
    }
  });

  it("is deterministic under an injected rng", () => {
    expect(pickWeighted(pool, [1, 1], () => 0)?.slug).toBe("a-b");
    expect(pickWeighted(pool, [1, 1], () => 0.99)?.slug).toBe("c-d");
  });

  it("falls back to the first item when all weights are zero", () => {
    expect(pickWeighted(pool, [0, 0], () => 0.5)?.slug).toBe("a-b");
  });

  it("never selects an item with zero weight when others have weight", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(pickWeighted(pool, [1, 0])?.slug).toBe("a-b");
    }
  });
});

describe("SAMPLE_STORAGE_KEY", () => {
  it("is the documented key", () => {
    expect(SAMPLE_STORAGE_KEY).toBe("kyno-top-sample");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/generator.test.ts`
Expected: FAIL — "Failed to resolve import ./generator".

- [ ] **Step 3: Write `src/lib/generator.ts`**

```ts
import type { Font, Pairing } from "./types";

export const SAMPLE_STORAGE_KEY = "kyno-top-sample";

export interface GeneratorState {
  heading: string;
  body: string;
}

export function parseGeneratorParams(search: string): Partial<GeneratorState> {
  const params = new URLSearchParams(search);
  const heading = params.get("h");
  const body = params.get("b");
  const state: Partial<GeneratorState> = {};
  if (heading) state.heading = heading;
  if (body) state.body = body;
  return state;
}

export function buildGeneratorQuery(state: GeneratorState): string {
  const params = new URLSearchParams();
  params.set("h", state.heading);
  params.set("b", state.body);
  return `?${params.toString()}`;
}

export function weightForPairing(
  pairing: Pairing,
  fontBySlug: Map<string, Font>,
): number {
  const popularity =
    (fontBySlug.get(pairing.a)?.popularity ?? 0) +
    (fontBySlug.get(pairing.b)?.popularity ?? 0);
  return (pairing.featured ? 1000 : 0) + popularity;
}

export function pickWeighted(
  pool: Pairing[],
  weights: number[],
  rng: () => number = Math.random,
): Pairing | null {
  if (pool.length === 0) return null;

  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return pool[0];

  let threshold = rng() * total;
  for (let i = 0; i < pool.length; i += 1) {
    threshold -= weights[i];
    if (threshold < 0) return pool[i];
  }
  return pool[pool.length - 1];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/generator.test.ts`
Expected: PASS (14 tests).

- [ ] **Step 5: Run the whole suite**

Run: `npm test`
Expected: all suites pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/generator.ts src/lib/generator.test.ts
git commit -m "feat: generator shuffle weighting and URL state helpers"
```

---

## Task 10: SEO builders

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/lib/seo.test.ts`

**Interfaces:**
- Consumes: `SITE` from `src/lib/site.ts`; `Font`, `Pairing` from `src/lib/types.ts`.
- Produces: `pairingTitle(pairing, a, b)`, `pairingDescription(pairing)`, `fontTitle(font)`, `fontDescription(font)`, `styleTitle(style)`, `styleDescription(style)`, `organizationJsonLd()`, `webPageJsonLd({name, description, path})`, `breadcrumbJsonLd(trail)`. Every page task consumes these.

- [ ] **Step 1: Write the failing test**

`src/lib/seo.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  pairingTitle,
  pairingDescription,
  fontTitle,
  fontDescription,
  styleTitle,
  organizationJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
} from "./seo";
import type { Font, Pairing, StyleTag } from "./types";

const a: Font = {
  slug: "playfair-display",
  name: "Playfair Display",
  category: "serif",
  weights: [400],
  tags: ["editorial"],
  trait: "high-contrast Didone",
  character: "A high-contrast Didone with strong editorial presence.",
  popularity: 92,
  license: "OFL-1.1",
};

const b: Font = { ...a, slug: "lato", name: "Lato", category: "sans-serif", trait: "warm humanist sans", character: "A warm humanist sans." };

const pairing: Pairing = {
  slug: "playfair-display-lato",
  a: "playfair-display",
  b: "lato",
  recipe: "didone-humanist",
  rationale:
    "Playfair Display's high stroke contrast needs a body face that will not compete with it. Lato holds long paragraphs at an even rhythm.",
  useCases: ["editorial", "luxury"],
  styles: ["editorial", "luxury"],
  samples: { heading: "h", sub: "s", body: "b" },
  featured: true,
  curated: true,
};

describe("pairingTitle", () => {
  it("names both fonts and the combination", () => {
    const title = pairingTitle(a, b);
    expect(title).toContain("Playfair Display");
    expect(title).toContain("Lato");
  });

  it("carries the brand and fits the 60-character budget", () => {
    const title = pairingTitle(a, b);
    expect(title.endsWith("| Kyno")).toBe(true);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it("truncates the descriptive part, never the brand", () => {
    const long: Font = { ...a, name: "An Extremely Long Typeface Name That Runs On" };
    const title = pairingTitle(long, b);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title.endsWith("| Kyno")).toBe(true);
  });

  it("reads 'Playfair Display & Lato — Serif + Sans | Kyno' for the fixture", () => {
    expect(pairingTitle(a, b)).toBe("Playfair Display & Lato — Serif + Sans | Kyno");
  });
});

describe("pairingDescription", () => {
  it("uses the first sentence of the rationale", () => {
    expect(pairingDescription(pairing)).toMatch(/^Playfair Display's high stroke contrast/);
  });

  it("stays within 160 characters", () => {
    expect(pairingDescription(pairing).length).toBeLessThanOrEqual(160);
  });

  it("collapses whitespace", () => {
    const messy = { ...pairing, rationale: "A  sentence.\n\n  And another one that is long enough to matter." };
    expect(pairingDescription(messy)).not.toMatch(/\s{2,}/);
  });
});

describe("font metadata", () => {
  it("targets the pairing query phrasing", () => {
    expect(fontTitle(a)).toContain("Playfair Display");
    expect(fontTitle(a).toLowerCase()).toContain("pairing");
  });

  it("carries the brand and fits the 60-character budget", () => {
    expect(fontTitle(a)).toBe("Playfair Display Pairings | Kyno");
    expect(fontTitle(a).length).toBeLessThanOrEqual(60);
  });

  it("describes the font from its character field", () => {
    expect(fontDescription(a)).toContain("high-contrast Didone");
  });
});

describe("styleTitle", () => {
  it("targets the style pairing query", () => {
    const style: StyleTag = { slug: "editorial", name: "Editorial", description: "d" };
    expect(styleTitle(style)).toContain("Editorial");
    expect(styleTitle(style).toLowerCase()).toContain("pairing");
  });
});

describe("organizationJsonLd", () => {
  it("declares the kynocreative.com relationship via sameAs", () => {
    const json = organizationJsonLd();
    expect(json["@type"]).toBe("Organization");
    expect(json.sameAs).toContain("https://www.kynocreative.com");
  });

  it("uses the canonical www host in its url", () => {
    expect(organizationJsonLd().url).toBe("https://www.kyno.top");
  });
});

describe("webPageJsonLd", () => {
  it("absolutises the path against the canonical host", () => {
    const json = webPageJsonLd({ name: "n", description: "d", path: "/pairings/a-b" });
    expect(json.url).toBe("https://www.kyno.top/pairings/a-b");
  });

  it("handles the root path", () => {
    expect(webPageJsonLd({ name: "n", description: "d", path: "/" }).url).toBe("https://www.kyno.top/");
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers items from one and absolutises the trails", () => {
    const json = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Pairings", path: "/pairings" },
      { name: "A & B", path: "/pairings/a-b" },
    ]);
    expect(json["@type"]).toBe("BreadcrumbList");
    expect(json.itemListElement).toHaveLength(3);
    expect(json.itemListElement[0].position).toBe(1);
    expect(json.itemListElement[2].item).toBe("https://www.kyno.top/pairings/a-b");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: FAIL — "Failed to resolve import ./seo".

- [ ] **Step 3: Write `src/lib/seo.ts`**

```ts
import { SITE } from "./site";
import type { Font, Pairing, StyleTag } from "./types";

const MAX_DESCRIPTION = 160;
const MAX_TITLE = 60;
const TITLE_SUFFIX = " | Kyno";

function absolute(path: string): string {
  return new URL(path, SITE.url).toString();
}

function clamp(text: string, limit: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1).trimEnd()}…`;
}

/**
 * Composes the complete title, brand included, against a single 60-character budget.
 * The brand suffix is never the part that gets truncated — a long descriptive phrase
 * loses its tail first. There is deliberately no `title.template` in the layout, so
 * this is the only place a title is assembled.
 */
function brandTitle(descriptive: string): string {
  const room = MAX_TITLE - TITLE_SUFFIX.length;
  return `${clamp(descriptive, room)}${TITLE_SUFFIX}`;
}

function firstSentence(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const match = clean.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : clean).trim();
}

/** Category pairs read better as "Serif + Sans" than as "serif + sans-serif". */
function categoryLabel(font: Font): string {
  switch (font.category) {
    case "sans-serif":
      return "Sans";
    case "serif":
      return "Serif";
    case "display":
      return "Display";
    case "handwriting":
      return "Script";
    case "monospace":
      return "Mono";
  }
}

export function pairingTitle(a: Font, b: Font): string {
  return brandTitle(`${a.name} & ${b.name} — ${categoryLabel(a)} + ${categoryLabel(b)}`);
}

export function pairingDescription(pairing: Pairing): string {
  return clamp(firstSentence(pairing.rationale), MAX_DESCRIPTION);
}

export function fontTitle(font: Font): string {
  return brandTitle(`${font.name} Pairings`);
}

export function fontDescription(font: Font): string {
  return clamp(`${font.character} See every pairing that uses ${font.name}, with live previews.`, MAX_DESCRIPTION);
}

export function styleTitle(style: StyleTag): string {
  return brandTitle(`${style.name} Font Pairings`);
}

export function styleDescription(style: StyleTag): string {
  return clamp(`${style.description} Live previews with copy-ready CSS.`, MAX_DESCRIPTION);
}

export interface OrganizationJsonLd {
  "@context": string;
  "@type": "Organization";
  name: string;
  url: string;
  sameAs: string[];
}

export function organizationJsonLd(): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    sameAs: [SITE.storeUrl],
  };
}

export interface WebPageJsonLd {
  "@context": string;
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  isPartOf: { "@type": "WebSite"; name: string; url: string };
}

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): WebPageJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

export interface BreadcrumbJsonLd {
  "@context": string;
  "@type": "BreadcrumbList";
  itemListElement: { "@type": "ListItem"; position: number; name: string; item: string }[];
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): BreadcrumbJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: PASS (16 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts
git commit -m "feat: per-page metadata and JSON-LD builders"
```

---

## Task 11: The preview component

**Files:**
- Create: `src/components/PairingPreview.tsx`

**Interfaces:**
- Consumes: `googleFontsHref`, `fallbackStack` (Task 4); `SAMPLE_STORAGE_KEY` (Task 9); `Font`, `Pairing`.
- Produces: `<PairingPreview heading={Font} body={Font} samples={Pairing["samples"]} editable={boolean} />`. Task 12 (generator) and Task 14 (pairing page) both render it.

- [ ] **Step 1: Write `src/components/PairingPreview.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { fallbackStack, googleFontsHref } from "@/lib/fonts";
import { SAMPLE_STORAGE_KEY } from "@/lib/generator";
import type { Font, Pairing } from "@/lib/types";

interface Props {
  heading: Font;
  body: Font;
  samples: Pairing["samples"];
  editable?: boolean;
  size?: "tool" | "page";
}

interface SampleState {
  heading: string;
  sub: string;
  body: string;
}

const DEFAULTS: SampleState = {
  heading: "Your headline",
  sub: "Your subtitle",
  body: "Your body copy goes here.",
};

function readStored(fallback: SampleState): SampleState {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(SAMPLE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SampleState>;
    return {
      heading: parsed.heading || fallback.heading,
      sub: parsed.sub || fallback.sub,
      body: parsed.body || fallback.body,
    };
  } catch {
    return fallback;
  }
}

export function PairingPreview({ heading, body, samples, editable = false, size = "tool" }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  // The text React renders is frozen at the first render. That is what makes typing
  // survive a font change and a shuffle: the virtual text never changes, so React
  // never patches the DOM back over what the user typed. It also means the sample
  // copy is present in the server-rendered HTML, which the pairing pages need.
  const initial = useRef<SampleState>({
    heading: samples.heading || DEFAULTS.heading,
    sub: samples.sub || DEFAULTS.sub,
    body: samples.body || DEFAULTS.body,
  });

  // Seed from storage once, after hydration. Mount-only by design — re-running would
  // clobber the caret while the user is typing.
  useEffect(() => {
    if (!editable) return;
    const stored = readStored(initial.current);
    if (headingRef.current) headingRef.current.textContent = stored.heading;
    if (subRef.current) subRef.current.textContent = stored.sub;
    if (bodyRef.current) bodyRef.current.textContent = stored.body;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read the values back with textContent (never innerHTML — typed markup must never
  // be parsed) and persist them.
  function commit() {
    const next: SampleState = {
      heading: headingRef.current?.textContent?.trim() || DEFAULTS.heading,
      sub: subRef.current?.textContent?.trim() || DEFAULTS.sub,
      body: bodyRef.current?.textContent?.trim() || DEFAULTS.body,
    };
    try {
      window.localStorage.setItem(SAMPLE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // A full or blocked store is not worth interrupting the user for.
    }
  }

  const titleSize = size === "page" ? "text-4xl sm:text-6xl" : "text-3xl sm:text-5xl";
  const headingStyle: React.CSSProperties = {
    fontFamily: fallbackStack(heading),
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  };
  const bodyStyle: React.CSSProperties = { fontFamily: fallbackStack(body) };

  return (
    <section
      aria-label="Live type preview"
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10"
    >
      {/* Two families at most, and display=swap, so a swap is a same-category change. */}
      <link rel="stylesheet" href={googleFontsHref([heading, body])} />

      {editable ? (
        <>
          {/* Children are rendered so the sample copy exists in the static HTML.
              React never updates them after mount, so typed text is safe. */}
          <h2
            ref={headingRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Preview headline — type to replace"
            spellCheck={false}
            onBlur={commit}
            className={`${titleSize} rounded font-bold text-[var(--color-text-primary)] outline-offset-4 focus:outline-2 focus:outline-[var(--color-accent)]`}
            style={headingStyle}
          >
            {initial.current.heading}
          </h2>
          <p
            ref={subRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Preview subtitle — type to replace"
            spellCheck={false}
            onBlur={commit}
            className="mt-3 rounded text-sm uppercase tracking-[0.14em] text-[var(--color-text-muted)] outline-offset-4 focus:outline-2 focus:outline-[var(--color-accent)]"
            style={bodyStyle}
          >
            {initial.current.sub}
          </p>
          <p
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Preview body — type to replace"
            spellCheck={false}
            onBlur={commit}
            className="mt-5 max-w-2xl rounded text-base leading-relaxed text-[var(--color-text-secondary)] outline-offset-4 focus:outline-2 focus:outline-[var(--color-accent)]"
            style={bodyStyle}
          >
            {initial.current.body}
          </p>
        </>
      ) : (
        <>
          <h2 className={`${titleSize} font-bold text-[var(--color-text-primary)]`} style={headingStyle}>
            {initial.current.heading}
          </h2>
          <p
            className="mt-3 text-sm uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
            style={bodyStyle}
          >
            {initial.current.sub}
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]"
            style={bodyStyle}
          >
            {initial.current.body}
          </p>
        </>
      )}
    </section>
  );
}
```

> **Implementer note:** `useState` is deliberately not imported — the editable text lives in the DOM, not in React state. The observable requirement is: **typed text survives a font change and a shuffle, and the sample copy is present in the server-rendered HTML.**

- [ ] **Step 2: Build and verify in the browser**

Run: `npx next build && npx next dev`
Expected: no build error. The component is not yet mounted anywhere, so confirm it compiled by checking the build output lists `PairingPreview` with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PairingPreview.tsx
git commit -m "feat: editable live type preview component"
```

---

## Task 12: Copy-ready code tabs

**Files:**
- Create: `src/components/CodeTabs.tsx`

**Interfaces:**
- Consumes: `googleFontsHref`, `fallbackStack` (Task 4); `Font`.
- Produces: `<CodeTabs heading={Font} body={Font} />`. Task 14 renders it.

- [ ] **Step 1: Write `src/components/CodeTabs.tsx`**

```tsx
"use client";

import { useState } from "react";
import { fallbackStack, googleFontsHref } from "@/lib/fonts";
import type { Font } from "@/lib/types";

type Tab = "link" | "css" | "html";

const TABS: { id: Tab; label: string }[] = [
  { id: "link", label: "Google Fonts" },
  { id: "css", label: "CSS" },
  { id: "html", label: "HTML" },
];

export function CodeTabs({ heading, body }: { heading: Font; body: Font }) {
  const [tab, setTab] = useState<Tab>("link");
  const [copied, setCopied] = useState(false);

  const linkSnippet = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n<link rel="stylesheet" href="${googleFontsHref([heading, body])}" />`;
  const cssSnippet = `:root {\n  --font-heading: ${fallbackStack(heading)};\n  --font-body: ${fallbackStack(body)};\n}\n\nh1, h2, h3 {\n  font-family: var(--font-heading);\n}\n\nbody {\n  font-family: var(--font-body);\n}`;
  const htmlSnippet = `<h1 style="font-family: ${fallbackStack(heading)}">Your headline</h1>\n<p style="font-family: ${fallbackStack(body)}">Your body copy.</p>`;

  const snippet = tab === "link" ? linkSnippet : tab === "css" ? cssSnippet : htmlSnippet;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div role="tablist" aria-label="Code snippet format" className="flex gap-1 border-b border-[var(--color-border)] p-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === item.id
                ? "bg-[var(--color-bg)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="flex-1" />
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CodeTabs.tsx
git commit -m "feat: copy-ready font code tabs"
```

---

## Task 13: The generator page

**Files:**
- Create: `src/components/FontPicker.tsx`
- Create: `src/components/PairingCard.tsx`
- Create: `src/components/Generator.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `pickWeighted`, `weightForPairing`, `parseGeneratorParams`, `buildGeneratorQuery` (Task 9); `fonts`, `pairings` (Task 8); `PairingPreview` (Task 11); `googleFontsHref`, `fallbackStack` (Task 4).
- Produces: `<Generator fonts={Font[]} pairings={Pairing[]} />` mounted at `/`, and `<PairingCard pairing={Pairing} heading={Font} body={Font} />` reused by Task 15 and Task 16.

- [ ] **Step 1: Write `src/components/FontPicker.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import { fallbackStack, googleFontsHref } from "@/lib/fonts";
import type { Font, FontCategory } from "@/lib/types";

const FILTERS: { id: "all" | FontCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "serif", label: "Serif" },
  { id: "sans-serif", label: "Sans" },
  { id: "display", label: "Display" },
  { id: "handwriting", label: "Script" },
  { id: "monospace", label: "Mono" },
];

export function FontPicker({
  label,
  fonts,
  value,
  onSelect,
  onOpen,
}: {
  label: string;
  fonts: Font[];
  value: Font;
  onSelect: (font: Font) => void;
  /** Called the first time the picker is opened, so the caller can load the catalog. */
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | FontCategory>("all");

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) onOpen?.();
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return fonts.filter(
      (font) =>
        (filter === "all" || font.category === filter) &&
        (needle === "" || font.name.toLowerCase().includes(needle)),
    );
  }, [fonts, filter, query]);

  function choose(font: Font) {
    onSelect(font);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={toggle}
        className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <span style={{ fontFamily: fallbackStack(value) }} className="font-semibold text-[var(--color-text-primary)]">
          {value.name}
        </span>
        <span aria-hidden="true">▾</span>
      </button>

      {open ? (
        <div className="absolute z-20 mt-2 w-72 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-xl">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search fonts"
            aria-label={`Search ${label.toLowerCase()} fonts`}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`rounded-full px-2.5 py-1 text-xs ${
                  filter === item.id
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text-muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ul role="listbox" className="mt-2 max-h-64 overflow-y-auto">
            {results.map((font) => (
              <li key={font.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={font.slug === value.slug}
                  onClick={() => choose(font)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]"
                >
                  <span style={{ fontFamily: fallbackStack(font) }}>{font.name}</span>
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[var(--color-text-muted)]">No fonts match.</li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
```

> **Implementer note:** the previewed font name above renders in the fallback stack until that family's stylesheet is loaded. The generator injects the stylesheet for every catalog font once, on mount, so the picker previews correctly — do that in `Generator.tsx` (Step 4), not here.

- [ ] **Step 2: Write `src/components/PairingCard.tsx`**

```tsx
import Link from "next/link";
import { fallbackStack } from "@/lib/fonts";
import type { Font, Pairing } from "@/lib/types";

export function PairingCard({
  pairing,
  heading,
  body,
}: {
  pairing: Pairing;
  heading: Font;
  body: Font;
}) {
  return (
    <Link
      href={`/pairings/${pairing.slug}`}
      className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-accent)]"
    >
      <p
        className="text-lg font-semibold text-[var(--color-text-primary)]"
        style={{ fontFamily: fallbackStack(heading) }}
      >
        {pairing.samples.heading}
      </p>
      <p
        className="mt-2 text-xs text-[var(--color-text-muted)]"
        style={{ fontFamily: fallbackStack(body) }}
      >
        {heading.name} + {body.name} · {pairing.useCases.slice(0, 2).join(", ")}
      </p>
    </Link>
  );
}
```

- [ ] **Step 3: Write `src/components/Generator.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { FontPicker } from "./FontPicker";
import { PairingCard } from "./PairingCard";
import { PairingPreview } from "./PairingPreview";
import { googleFontsHref, fallbackStack } from "@/lib/fonts";
import {
  buildGeneratorQuery,
  parseGeneratorParams,
  pickWeighted,
  weightForPairing,
} from "@/lib/generator";
import { storeUrl } from "@/lib/site";
import type { Font, Pairing } from "@/lib/types";

export function Generator({ fonts, pairings }: { fonts: Font[]; pairings: Pairing[] }) {
  const fontBySlug = useMemo(() => new Map(fonts.map((font) => [font.slug, font])), [fonts]);
  const weights = useMemo(
    () => pairings.map((pairing) => weightForPairing(pairing, fontBySlug)),
    [pairings, fontBySlug],
  );

  const initial = pairings[0];
  const [headingSlug, setHeadingSlug] = useState(initial.a);
  const [bodySlug, setBodySlug] = useState(initial.b);
  const [hydrated, setHydrated] = useState(false);

  // Read ?h=&b= on mount only, so a later state change is not overwritten.
  useEffect(() => {
    const params = parseGeneratorParams(window.location.search);
    if (params.heading && fontBySlug.has(params.heading)) setHeadingSlug(params.heading);
    if (params.body && fontBySlug.has(params.body)) setBodySlug(params.body);
    setHydrated(true);
  }, [fontBySlug]);

  // The catalog stylesheet is large (every whitelisted family). It is fetched only
  // once a picker is opened, so the homepage's own load stays at two families.
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  useEffect(() => {
    if (!catalogLoaded) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = googleFontsHref(fonts);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [catalogLoaded, fonts]);

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    if (!hydrated) return;
    window.history.replaceState(
      null,
      "",
      buildGeneratorQuery({ heading: headingSlug, body: bodySlug }),
    );
  }, [hydrated, headingSlug, bodySlug]);

  const heading = fontBySlug.get(headingSlug) ?? fonts[0];
  const body = fontBySlug.get(bodySlug) ?? fonts[1];
  const currentPairing = pairings.find(
    (pairing) => pairing.a === headingSlug && pairing.b === bodySlug,
  );

  function shuffle() {
    const next = pickWeighted(pairings, weights);
    if (!next) return;
    setHeadingSlug(next.a);
    setBodySlug(next.b);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">Find fonts that belong together</h1>
      <p className="mt-4 max-w-2xl">
        Every pairing here has a reason. Shuffle draws only from combinations that were checked, so
        you never land on two faces fighting for the same job.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <FontPicker
          label="Heading"
          fonts={fonts}
          value={heading}
          onOpen={() => setCatalogLoaded(true)}
          onSelect={(font) => setHeadingSlug(font.slug)}
        />
        <FontPicker
          label="Body"
          fonts={fonts}
          value={body}
          onOpen={() => setCatalogLoaded(true)}
          onSelect={(font) => setBodySlug(font.slug)}
        />
        <button
          type="button"
          onClick={shuffle}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)]"
        >
          ⇄ Shuffle
        </button>
      </div>

      <div className="mt-8">
        <PairingPreview
          heading={heading}
          body={body}
          samples={currentPairing?.samples ?? { heading: "Your headline", sub: "Your subtitle", body: "Your body copy goes here." }}
          editable
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {currentPairing ? (
          <>
            <span className="text-[var(--color-text-muted)]">
              {currentPairing.useCases.slice(0, 3).join(" · ")}
            </span>
            <span className="flex-1" />
            <a href={`/pairings/${currentPairing.slug}`} className="underline">
              View full pairing page →
            </a>
          </>
        ) : (
          <span className="text-[var(--color-text-muted)]">
            Not a checked pairing — try Shuffle, or browse the wall below.
          </span>
        )}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Pairings worth starting from</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Each card is set in its own two faces.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pairings.map((pairing) => {
            const a = fontBySlug.get(pairing.a);
            const b = fontBySlug.get(pairing.b);
            if (!a || !b) return null;
            return <PairingCard key={pairing.slug} pairing={pairing} heading={a} body={b} />;
          })}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Fonts in this catalog</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {fonts.map((font) => (
            <li key={font.slug}>
              <a
                href={`/fonts/${font.slug}`}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm hover:border-[var(--color-accent)]"
                style={{ fontFamily: fallbackStack(font) }}
              >
                {font.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-xl border border-[var(--color-border)] p-6">
        <p className="text-sm">
          Need a template that already uses a pairing like this?{" "}
          <a href={storeUrl("/categories/templates", "module", "generator")} className="underline">
            Browse Kyno templates
          </a>
          .
        </p>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Mount it at `/` in `src/app/page.tsx`**

```tsx
import { Generator } from "@/components/Generator";
import { fonts, pairings } from "@/lib/pairings";
import { organizationJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <Generator fonts={fonts} pairings={pairings} />
    </>
  );
}
```

- [ ] **Step 5: Verify in the browser**

Run: `npx next build && npx next dev`

Check each of these, in the browser:
- The headline, subtitle, and body are all editable; typing replaces the sample text.
- Changing the Heading font updates the headline face and **keeps your typed text**.
- Shuffle changes both fonts, keeps your typed text, and the line under the preview updates.
- The URL becomes `/?h=<slug>&b=<slug>`; pasting that URL into a fresh tab restores the pairing.
- "View full pairing page →" appears for a checked pairing and is absent otherwise.
- The card wall renders, each card in its own faces.
- Reloading keeps your typed text (localStorage).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: generator page with live preview, shuffle, and card wall"
```

---

## Task 14: The pairing page

**Files:**
- Create: `src/components/Breadcrumbs.tsx`
- Create: `src/components/WhyItWorks.tsx`
- Create: `src/components/ContributionSplit.tsx`
- Create: `src/components/FontCard.tsx`
- Create: `src/components/StoreModule.tsx`
- Create: `src/app/pairings/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getPairing`, `getFont`, `relatedPairings` (Task 8); `pairingTitle`, `pairingDescription`, `webPageJsonLd`, `breadcrumbJsonLd` (Task 10); `PairingPreview` (Task 11); `CodeTabs` (Task 12); `storeUrl` (Task 2).
- Produces: the route `/pairings/[slug]`; `StoreModule` and `Breadcrumbs` reused by Tasks 15–17.

- [ ] **Step 1: Write `src/components/Breadcrumbs.tsx`**

```tsx
import Link from "next/link";

export function Breadcrumbs({ trail }: { trail: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--color-text-muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((crumb, index) => (
          <li key={crumb.name} className="flex items-center gap-2">
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-[var(--color-text-primary)]">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-[var(--color-text-secondary)]">{crumb.name}</span>
            )}
            {index < trail.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Write `src/components/WhyItWorks.tsx`**

```tsx
export function WhyItWorks({ rationale }: { rationale: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold">Why it works</h2>
      <p className="mt-3 leading-relaxed">{rationale}</p>
    </section>
  );
}
```

- [ ] **Step 3: Write `src/components/ContributionSplit.tsx`**

```tsx
import { fallbackStack } from "@/lib/fonts";
import type { Font } from "@/lib/types";

/**
 * Shows what each half of the pairing contributes: the heading face alone, then the
 * body face alone. This is the module the spec borrows from the "compare" layout.
 */
export function ContributionSplit({ heading, body }: { heading: Font; body: Font }) {
  return (
    <section>
      <h2 className="text-xl font-bold">What each font brings</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Heading face
          </dt>
          <dd className="mt-2">
            <span
              className="block text-2xl font-semibold text-[var(--color-text-primary)]"
              style={{ fontFamily: fallbackStack(heading) }}
            >
              {heading.name}
            </span>
            <span className="mt-2 block text-sm">{heading.trait}</span>
          </dd>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Body face
          </dt>
          <dd className="mt-2">
            <span className="block text-base" style={{ fontFamily: fallbackStack(body) }}>
              {body.name} keeps the reading even and quiet.
            </span>
            <span className="mt-2 block text-sm">{body.trait}</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: Write `src/components/FontCard.tsx`**

```tsx
import Link from "next/link";
import { fallbackStack } from "@/lib/fonts";
import type { Font } from "@/lib/types";

export function FontCard({ font, role }: { font: Font; role: "Heading" | "Body" }) {
  return (
    <Link
      href={`/fonts/${font.slug}`}
      className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-accent)]"
    >
      <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {role}
      </span>
      <span
        className="mt-1 block text-lg font-semibold text-[var(--color-text-primary)]"
        style={{ fontFamily: fallbackStack(font) }}
      >
        {font.name}
      </span>
      <span className="mt-1 block text-xs text-[var(--color-text-muted)]">
        {font.category} · {font.weights.length} weights
      </span>
      <span className="mt-2 block text-sm">{font.character}</span>
    </Link>
  );
}
```

- [ ] **Step 5: Write `src/components/StoreModule.tsx`**

```tsx
import { storeUrl } from "@/lib/site";

const MAPPING: { match: string[]; path: string; label: string }[] = [
  {
    match: ["portfolio", "landing", "website", "startup"],
    path: "/categories/templates",
    label: "Browse Kyno templates",
  },
  {
    match: ["poster", "branding", "logo", "display", "luxury"],
    path: "/categories/fonts",
    label: "Browse Kyno fonts",
  },
  {
    match: ["social", "photo", "background"],
    path: "/categories/photos",
    label: "Browse Kyno photos",
  },
];

/**
 * Renders only when a use case actually maps to something Kyno sells. A pairing
 * with no relevant mapping gets no store link at all — a forced link would be
 * worth less than the credibility it costs.
 */
export function StoreModule({ useCases, slug }: { useCases: string[]; slug: string }) {
  const mapping = MAPPING.find((entry) =>
    entry.match.some((keyword) => useCases.includes(keyword)),
  );
  if (!mapping) return null;

  return (
    <aside className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-sm">
        Working on something like this?{" "}
        <a href={storeUrl(mapping.path, "module", slug)} className="underline">
          {mapping.label}
        </a>
        .
      </p>
    </aside>
  );
}
```

- [ ] **Step 6: Write `src/app/pairings/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CodeTabs } from "@/components/CodeTabs";
import { ContributionSplit } from "@/components/ContributionSplit";
import { FontCard } from "@/components/FontCard";
import { PairingCard } from "@/components/PairingCard";
import { PairingPreview } from "@/components/PairingPreview";
import { StoreModule } from "@/components/StoreModule";
import { WhyItWorks } from "@/components/WhyItWorks";
import {
  fontPairings,
  getFont,
  getPairing,
  pairings,
  relatedPairings,
} from "@/lib/pairings";
import {
  breadcrumbJsonLd,
  pairingDescription,
  pairingTitle,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return pairings.map((pairing) => ({ slug: pairing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pairing = getPairing(slug);
  if (!pairing) return {};
  const heading = getFont(pairing.a);
  const body = getFont(pairing.b);
  if (!heading || !body) return {};

  const title = pairingTitle(heading, body);
  const description = pairingDescription(pairing);
  const path = `/pairings/${pairing.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}${path}` },
    openGraph: { title, description, url: `${SITE.url}${path}`, type: "article" },
  };
}

export default async function PairingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pairing = getPairing(slug);
  if (!pairing) notFound();

  const heading = getFont(pairing.a);
  const body = getFont(pairing.b);
  if (!heading || !body) notFound();

  const path = `/pairings/${pairing.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Pairings", path: "/pairings" },
    { name: `${heading.name} & ${body.name}`, path },
  ];

  const related = relatedPairings(pairing, 4);
  const alsoWith = fontPairings(heading.slug)
    .filter((other) => other.slug !== pairing.slug)
    .slice(0, 4);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: `${heading.name} & ${body.name}`,
              description: pairingDescription(pairing),
              path,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }}
      />

      <Breadcrumbs
        trail={[
          { name: "Home", href: "/" },
          { name: "Pairings", href: "/pairings" },
          { name: `${heading.name} & ${body.name}` },
        ]}
      />

      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
        {heading.name} &amp; {body.name}
      </h1>
      <p className="mt-3 max-w-2xl">
        A {heading.trait} headline with a {body.trait} body.
      </p>

      <div className="mt-8">
        <PairingPreview heading={heading} body={body} samples={pairing.samples} editable size="page" />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-10">
          <WhyItWorks rationale={pairing.rationale} />
          <ContributionSplit heading={heading} body={body} />

          <section>
            <h2 className="text-xl font-bold">Best for</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pairing.styles.map((style) => (
                <li key={style}>
                  <a
                    href={`/styles/${style}`}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-sm capitalize hover:border-[var(--color-accent)]"
                  >
                    {style}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">Copy the code</h2>
            <div className="mt-4">
              <CodeTabs heading={heading} body={body} />
            </div>
          </section>

          {related.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold">Related pairings</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((other) => {
                  const a = getFont(other.a);
                  const b = getFont(other.b);
                  if (!a || !b) return null;
                  return <PairingCard key={other.slug} pairing={other} heading={a} body={b} />;
                })}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <FontCard font={heading} role="Heading" />
          <FontCard font={body} role="Body" />
          <StoreModule useCases={pairing.useCases} slug={pairing.slug} />
          {alsoWith.length > 0 ? (
            <nav aria-label={`More pairings with ${heading.name}`} className="rounded-lg border border-[var(--color-border)] p-4">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                More with {heading.name}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {alsoWith.map((other) => {
                  const partner = getFont(other.a === heading.slug ? other.b : other.a);
                  if (!partner) return null;
                  return (
                    <li key={other.slug}>
                      <a href={`/pairings/${other.slug}`} className="hover:text-[var(--color-text-primary)]">
                        {heading.name} + {partner.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
```

- [ ] **Step 7: Build and verify a pairing page in the browser**

Run: `npx next build && npx next dev`
Expected: `out/pairings/` contains one directory per pairing. Visit `/pairings/playfair-display-lato` and confirm: breadcrumb renders, the H1 names both fonts, the preview is live and editable, "Why it works" shows the rationale, the contribution split shows each face alone, "Best for" chips link to `/styles/…`, the code tabs copy correctly, the sidebar shows two font cards, and the page's `<head>` contains a canonical plus two JSON-LD blocks.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: pairing detail page with contribution split and store module"
```

---

## Task 15: The pairings index, font pages, and style pages

**Files:**
- Create: `src/app/pairings/page.tsx`
- Create: `src/app/fonts/[slug]/page.tsx`
- Create: `src/app/styles/[slug]/page.tsx`
- Create: `src/components/SpecimenBlock.tsx`

**Interfaces:**
- Consumes: `pairings`, `fontsWithPairings`, `fontPairings`, `getFont`, `pairingsByStyle` (Task 8); `styles` from `data/styles.ts`; `fontTitle`, `fontDescription`, `styleTitle`, `styleDescription` (Task 10); `PairingCard`, `Breadcrumbs`.
- Produces: the routes `/pairings`, `/fonts/[slug]`, `/styles/[slug]`.

- [ ] **Step 1: Write `src/components/SpecimenBlock.tsx`**

```tsx
import { fallbackStack, googleFontsHref } from "@/lib/fonts";
import type { Font } from "@/lib/types";

/** The font shown at three sizes in both roles, so the specimen shows range. */
export function SpecimenBlock({ font }: { font: Font }) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
      <link rel="stylesheet" href={googleFontsHref([font])} />
      <p
        className="text-5xl leading-none text-[var(--color-text-primary)]"
        style={{ fontFamily: fallbackStack(font) }}
      >
        Aa
      </p>
      <p
        className="mt-6 text-3xl text-[var(--color-text-primary)]"
        style={{ fontFamily: fallbackStack(font) }}
      >
        {font.name}
      </p>
      <p
        className="mt-4 text-base leading-relaxed"
        style={{ fontFamily: fallbackStack(font) }}
      >
        The quick brown fox jumps over the lazy dog. 0123456789 &amp; ? !
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Category</dt>
          <dd className="mt-1 capitalize">{font.category}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Weights</dt>
          <dd className="mt-1">{font.weights.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">License</dt>
          <dd className="mt-1">{font.license}</dd>
        </div>
      </dl>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/app/pairings/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PairingCard } from "@/components/PairingCard";
import { getFont, pairings } from "@/lib/pairings";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Font Pairings",
  description:
    "Every pairing in the Kyno Pairings catalog, each one previewed in its own two fonts with copy-ready CSS.",
  alternates: { canonical: `${SITE.url}/pairings` },
};

export default function PairingsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Pairings" }]} />
      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">All font pairings</h1>
      <p className="mt-4 max-w-2xl">
        Every combination in the catalog, with the reason it works. Each card is set in its own two
        faces.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pairings.map((pairing) => {
          const a = getFont(pairing.a);
          const b = getFont(pairing.b);
          if (!a || !b) return null;
          return <PairingCard key={pairing.slug} pairing={pairing} heading={a} body={b} />;
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/app/fonts/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PairingCard } from "@/components/PairingCard";
import { SpecimenBlock } from "@/components/SpecimenBlock";
import { fontPairings, fontsWithPairings, getFont } from "@/lib/pairings";
import { breadcrumbJsonLd, fontDescription, fontTitle, webPageJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return fontsWithPairings().map((font) => ({ slug: font.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const font = getFont(slug);
  if (!font) return {};
  const title = fontTitle(font);
  const description = fontDescription(font);
  const path = `/fonts/${font.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}${path}` },
    openGraph: { title, description, url: `${SITE.url}${path}`, type: "article" },
  };
}

export default async function FontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const font = getFont(slug);
  if (!font) notFound();

  const found = fontPairings(font.slug);
  if (found.length === 0) notFound();

  const path = `/fonts/${font.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Pairings", path: "/pairings" },
    { name: font.name, path },
  ];

  const first = found[0];
  const partner = getFont(first.a === font.slug ? first.b : first.a);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({ name: `${font.name} pairings`, description: fontDescription(font), path }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }}
      />

      <Breadcrumbs
        trail={[{ name: "Home", href: "/" }, { name: "Pairings", href: "/pairings" }, { name: font.name }]}
      />

      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{font.name} pairings</h1>
      <p className="mt-4 max-w-2xl">{font.character}</p>

      {partner ? (
        <p className="mt-6">
          <a
            href={`/?h=${font.slug}&b=${partner.slug}`}
            className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)]"
          >
            Try it in the generator →
          </a>
        </p>
      ) : null}

      <div className="mt-10">
        <SpecimenBlock font={font} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Every pairing with {font.name}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {found.map((pairing) => {
            const a = getFont(pairing.a);
            const b = getFont(pairing.b);
            if (!a || !b) return null;
            return <PairingCard key={pairing.slug} pairing={pairing} heading={a} body={b} />;
          })}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Write `src/app/styles/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PairingCard } from "@/components/PairingCard";
import { styles } from "../../../../data/styles";
import { getFont, pairingsByStyle } from "@/lib/pairings";
import { breadcrumbJsonLd, styleDescription, styleTitle, webPageJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  const withPairings = styles.filter((style) => pairingsByStyle(style.slug).length > 0);
  return withPairings.map((style) => ({ slug: style.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const style = styles.find((item) => item.slug === slug);
  if (!style) return {};
  const title = styleTitle(style);
  const description = styleDescription(style);
  const path = `/styles/${style.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}${path}` },
    openGraph: { title, description, url: `${SITE.url}${path}`, type: "article" },
  };
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = styles.find((item) => item.slug === slug);
  if (!style) notFound();

  const found = pairingsByStyle(style.slug);
  if (found.length === 0) notFound();

  const path = `/styles/${style.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Pairings", path: "/pairings" },
    { name: style.name, path },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({ name: styleTitle(style), description: styleDescription(style), path }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }}
      />

      <Breadcrumbs
        trail={[{ name: "Home", href: "/" }, { name: "Pairings", href: "/pairings" }, { name: style.name }]}
      />

      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{style.name} font pairings</h1>
      <p className="mt-4 max-w-2xl">{style.description}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {found.map((pairing) => {
          const a = getFont(pairing.a);
          const b = getFont(pairing.b);
          if (!a || !b) return null;
          return <PairingCard key={pairing.slug} pairing={pairing} heading={a} body={b} />;
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Build and verify every page type in the browser**

Run: `npx next build && npx next dev`

Confirm: `/pairings` lists every pairing; `/fonts/playfair-display` shows the specimen, the "Try it in the generator →" button, and every pairing containing that font; `/styles/editorial` lists the editorial pairings. Click "Try it in the generator →" and confirm the generator opens pre-filled with that font.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: pairings index, font pages, and style hubs"
```

---

## Task 16: Utility pages and the licensing record

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/licenses/page.tsx`
- Create: `THIRD-PARTY-LICENSES.md`
- Create: `public/licenses/OFL-1.1.txt`

**Interfaces:**
- Consumes: `SITE` (Task 2); `fonts` (Task 8).
- Produces: the routes `/about`, `/privacy`, `/licenses`, and the licensing record the spec requires.

- [ ] **Step 1: Download the OFL text into the repo**

```bash
mkdir -p public/licenses && curl -fsSL https://openfontlicense.org/open-font-license-official-text/ -o public/licenses/OFL-1.1.txt && wc -l public/licenses/OFL-1.1.txt
```

Expected: a non-zero line count. If the network fetch fails, paste the canonical OFL-1.1 text from `https://scripts.sil.org/OFL` into the file manually — the file must contain the real license text, not a link.

- [ ] **Step 2: Write `THIRD-PARTY-LICENSES.md`**

```markdown
# Third-party licenses

## Fonts self-hosted by this site

This site self-hosts two fonts through `next/font/google`. Redistributing them
requires their copyright notices and license text to travel with them.

### Fraunces

- Copyright 2018 The Fraunces Project Authors (https://github.com/undercasetype/Fraunces)
- License: SIL Open Font License, Version 1.1
- Full text: `public/licenses/OFL-1.1.txt`

### Inter

- Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)
- License: SIL Open Font License, Version 1.1
- Full text: `public/licenses/OFL-1.1.txt`

## Fonts served from the Google Fonts CDN

Every font demonstrated on this site is loaded from `fonts.googleapis.com`. The
files are distributed by Google, not by this site, so this repository does not
redistribute them. Each font's license and copyright holder are recorded in
`data/fonts.json` under the `license` field and are listed on `/licenses`.

No font file is ever offered for download from this site.
```

- [ ] **Step 3: Write `src/app/licenses/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fonts } from "@/lib/pairings";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Font Licenses",
  description:
    "Every font on Kyno Pairings is open source. This page records the license for each one and explains what is and is not redistributed.",
  alternates: { canonical: `${SITE.url}/licenses` },
};

export default function LicensesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Licenses" }]} />
      <h1 className="mt-6 text-4xl font-bold">Font licenses</h1>

      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          Every font shown here is open source, licensed under the SIL Open Font License 1.1, the
          Apache License 2.0, or the Ubuntu Font License. All three permit free commercial use and
          web embedding.
        </p>
        <p>
          Font files are served by Google&apos;s CDN, not by this site. Google performs the
          distribution, so this site does not redistribute any font file — and no download link for
          a font file exists anywhere on it.
        </p>
        <p>
          This site self-hosts two fonts for its own interface, Fraunces and Inter. Both are
          OFL-1.1, so their copyright notices travel with the repository in{" "}
          <code>THIRD-PARTY-LICENSES.md</code> and the full license text is at{" "}
          <a href="/licenses/OFL-1.1.txt" className="underline">
            /licenses/OFL-1.1.txt
          </a>
          .
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold">Fonts in this catalog</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
            <th scope="col" className="py-2">Font</th>
            <th scope="col" className="py-2">License</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font) => (
            <tr key={font.slug} className="border-b border-[var(--color-border)]">
              <td className="py-2">
                <a href={`/fonts/${font.slug}`} className="underline">
                  {font.name}
                </a>
              </td>
              <td className="py-2">{font.license}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Write `src/app/privacy/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Kyno Pairings sets no cookies, has no accounts, and collects no email. Text you type into the preview never leaves your browser.",
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Privacy" }]} />
      <h1 className="mt-6 text-4xl font-bold">Privacy</h1>

      <div className="mt-8 space-y-6 leading-relaxed">
        <p>This site is a free tool. It is deliberately built to hold as little of your data as possible.</p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>No cookies.</strong> Nothing is set on your device except your own typed preview
            text, which is stored in your browser&apos;s local storage so it survives a reload. It
            is not readable by us.
          </li>
          <li>
            <strong>No accounts and no email.</strong> There is nothing to sign up for and no form
            that asks who you are.
          </li>
          <li>
            <strong>Text you type never leaves your browser.</strong> The preview edits the page
            locally. Nothing you type is transmitted, logged, or stored on a server.
          </li>
          <li>
            <strong>No tracking pixels.</strong> Traffic is measured with Cloudflare Web Analytics,
            which is cookieless and does not fingerprint individual visitors.
          </li>
          <li>
            <strong>Fonts.</strong> Demo fonts load from Google&apos;s font CDN, which necessarily
            sees the request. See{" "}
            <a href="/licenses" className="underline">
              licenses
            </a>{" "}
            for details.
          </li>
        </ul>
        <p>
          This site links to the Kyno store at kynocreative.com. Once you follow a link there, that site&apos;s
          own privacy policy applies.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write `src/app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pairsCount } from "@/lib/stats";
import { SITE, storeUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kyno Pairings is a free font pairing tool built on open-source fonts. Every pairing comes with the reason it works.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <h1 className="mt-6 text-4xl font-bold">About Kyno Pairings</h1>

      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          Kyno Pairings is a free tool for finding type combinations that work. It covers{" "}
          {pairsCount} pairings drawn from open-source Google Fonts, and every one of them comes
          with an explanation of why it holds together.
        </p>
        <p>
          Most pairing tools pick two fonts at random and leave you to judge. This one only offers
          combinations that were checked, so a shuffle always lands somewhere usable — and you can
          see what each half of the pairing is contributing.
        </p>
        <p>
          The tool is made by{" "}
          <a href={storeUrl("/", "footer", "about")} className="underline">
            Kyno
          </a>
          , which sells design templates, fonts, and photography. The same idea runs through both:
          made for people who have to ship something.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Add `src/lib/stats.ts`**

The about page needs the pairing count without pulling the whole query layer, and the number must never be hand-maintained.

```ts
import pairingsData from "../../data/pairings.json";

export const pairsCount = (pairingsData as unknown[]).length;
```

- [ ] **Step 7: Verify in the browser and confirm the licensing rule holds**

Run: `npx next build && npx next dev`

Confirm: `/about`, `/privacy`, `/licenses` all render; `/licenses/OFL-1.1.txt` serves the license text; the footer's Licenses link works.

Then verify the hard rule — there must be no font-download affordance anywhere:

```bash
grep -ri "download" out/ --include=*.html | grep -iv "cloudflare" | head -20
```

Expected: no hit that offers a font file. If any page offers a font download, remove it — this violates the global constraint.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: about, privacy, and licenses pages with the third-party license record"
```

---

## Task 17: Sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Consumes: `pairings`, `fontsWithPairings` (Task 8); `styles` and `pairingsByStyle`; `SITE` (Task 2).
- Produces: `/sitemap.xml` and `/robots.txt` in the export.

- [ ] **Step 1: Write `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { styles } from "../../data/styles";
import { fontsWithPairings, pairings, pairingsByStyle } from "@/lib/pairings";
import { SITE } from "@/lib/site";

const STATIC_PATHS = ["/", "/pairings", "/about", "/privacy", "/licenses"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.6,
    })),
    ...pairings.map((pairing) => ({
      url: `${SITE.url}/pairings/${pairing.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: pairing.featured ? 0.8 : 0.6,
    })),
    ...fontsWithPairings().map((font) => ({
      url: `${SITE.url}/fonts/${font.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...styles
      .filter((style) => pairingsByStyle(style.slug).length > 0)
      .map((style) => ({
        url: `${SITE.url}/styles/${style.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
```

- [ ] **Step 2: Write `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
```

- [ ] **Step 3: Build and verify the emitted files**

Run: `npx next build`

Then:
```bash
node -e "
const fs=require('fs');
const xml=fs.readFileSync('out/sitemap.xml','utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
console.log('urls:', urls.length);
console.log('all https www:', urls.every(u=>u.startsWith('https://www.kyno.top')));
console.log('sample:', urls.slice(0,3));
console.log('robots:', fs.readFileSync('out/robots.txt','utf8'));
"
```

Expected: a URL count equal to `5 + pairings.length + fontsWithPairings().length + stylesWithPairings().length`, every URL beginning `https://www.kyno.top`, and a robots.txt pointing at the sitemap.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: sitemap and robots for the static export"
```

---

## Task 18: Build assertions and the internal link check

**Files:**
- Create: `scripts/check-links.ts`
- Create: `scripts/assert-pages.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `data/fonts.json`, `data/pairings.json`, `data/styles.ts`, and the built `out/` directory.
- Produces: `npm run check:links` and a post-build assertion. Both exit non-zero on failure.

- [ ] **Step 1: Write `scripts/assert-pages.ts`**

This is the check that makes "the build emitted a page for every row of data" a fact rather than a hope.

```ts
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { styles } from "../data/styles";
import type { Font, Pairing } from "../src/lib/types";

const root = resolve(__dirname, "..");
const out = resolve(root, "out");

const fonts: Font[] = JSON.parse(readFileSync(resolve(root, "data/fonts.json"), "utf8"));
const pairings: Pairing[] = JSON.parse(readFileSync(resolve(root, "data/pairings.json"), "utf8"));

const usedFontSlugs = new Set(pairings.flatMap((pairing) => [pairing.a, pairing.b]));
const usedStyleSlugs = new Set(pairings.flatMap((pairing) => pairing.styles));

// With `trailingSlash: false` (see next.config.ts), the export writes one `.html`
// file per route rather than a directory with an index.html. Changing trailingSlash
// without changing these paths would make every assertion below fail.
const STATIC_PAGES = ["index.html", "pairings.html", "about.html", "privacy.html", "licenses.html"];

const expectations: { file: string; label: string }[] = [
  ...STATIC_PAGES.map((name) => ({
    file: resolve(out, name),
    label: `static ${name}`,
  })),
  ...pairings.map((pairing) => ({
    file: resolve(out, "pairings", `${pairing.slug}.html`),
    label: `pairing ${pairing.slug}`,
  })),
  ...[...usedFontSlugs].map((slug) => ({
    file: resolve(out, "fonts", `${slug}.html`),
    label: `font ${slug}`,
  })),
  ...styles
    .filter((style) => usedStyleSlugs.has(style.slug))
    .map((style) => ({
      file: resolve(out, "styles", `${style.slug}.html`),
      label: `style ${style.slug}`,
    })),
];

const missing = expectations.filter((item) => !existsSync(item.file));

// A font with no pairings must have no page, or it ships as a thin page.
const usedFonts = fonts.filter((font) => usedFontSlugs.has(font.slug));
const unusedFonts = fonts.filter((font) => !usedFontSlugs.has(font.slug));
const wronglyEmitted = unusedFonts.filter((font) =>
  existsSync(resolve(out, "fonts", `${font.slug}.html`)),
);

if (missing.length > 0) {
  console.error(`assert-pages: ${missing.length} expected page(s) missing:`);
  for (const item of missing.slice(0, 20)) console.error(`  - ${item.label}`);
  process.exit(1);
}

if (wronglyEmitted.length > 0) {
  console.error(
    `assert-pages: ${wronglyEmitted.length} font page(s) emitted for fonts with no pairings:`,
  );
  for (const font of wronglyEmitted) console.error(`  - ${font.slug}`);
  process.exit(1);
}

console.log(
  `assert-pages OK — ${expectations.length} pages present ` +
    `(${pairings.length} pairings, ${usedFonts.length} fonts, ${styles.length} styles defined).`,
);
```

- [ ] **Step 2: Write `scripts/check-links.ts`**

```ts
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(__dirname, "..");
const out = resolve(root, "out");

function htmlFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...htmlFiles(full));
    else if (entry.endsWith(".html")) found.push(full);
  }
  return found;
}

/** Maps an internal href onto the file the export would serve for it. */
function targetFor(href: string): string | null {
  const path = href.split("#")[0].split("?")[0];
  if (path === "" || path === "/") return join(out, "index.html");
  if (!path.startsWith("/")) return null;
  const direct = join(out, path);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  const asDir = join(direct, "index.html");
  if (existsSync(asDir)) return asDir;
  if (existsSync(`${direct}.html`)) return `${direct}.html`;
  return asDir;
}

const files = htmlFiles(out);
const broken: { page: string; href: string }[] = [];
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/")) continue; // skip external, mailto, and anchors
    if (href.startsWith("//")) continue;
    checked += 1;
    const target = targetFor(href);
    if (target === null || !existsSync(target)) {
      broken.push({ page: file.replace(out, ""), href });
    }
  }
}

if (broken.length > 0) {
  console.error(`check-links: ${broken.length} broken internal link(s):`);
  for (const item of broken.slice(0, 30)) console.error(`  ${item.page} → ${item.href}`);
  process.exit(1);
}

console.log(`check-links OK — ${checked} internal links across ${files.length} pages.`);
```

- [ ] **Step 3: Wire both into `package.json`**

Replace the `build` and add a `verify` script:

```json
    "build": "npm run lint:data && next build && npm run assert:pages && npm run check:links",
    "assert:pages": "tsx scripts/assert-pages.ts",
```

- [ ] **Step 4: Run the full build**

Run: `npm run build`
Expected: `lint:data OK`, a successful Next build, `assert-pages OK — N pages present`, and `check-links OK`.

- [ ] **Step 5: Prove the link check can fail**

Temporarily change one `href` in `src/components/Footer.tsx` from `/licenses` to `/licences`, rebuild, and confirm `check:links` exits 1 with that path listed. Revert the change and rebuild.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: assert every page exists and no internal link is broken"
```

---

## Task 19: Performance and accessibility pass

**Files:**
- Modify: any file the checks below flag.

**Interfaces:**
- Consumes: the built `out/`.
- Produces: no new interfaces — this task changes existing files only.

- [ ] **Step 1: Confirm only the needed fonts are requested per page**

The export has no server, so serve the static output directly:

```bash
npx serve out -l 4321
```

Then load `http://localhost:4321/pairings/playfair-display-lato` with the browser devtools network panel open and filter for `fonts.gstatic.com`.

Expected: requests for exactly the two families on the page. Fraunces and Inter are already self-hosted by `next/font`, so they will not appear as third-party requests — but no content family beyond the page's two should.

- [ ] **Step 2: Run Lighthouse on the two key page types**

Run Lighthouse against `http://localhost:4321/` and `http://localhost:4321/pairings/playfair-display-lato`.

Expected: performance, accessibility, best practices, and SEO all ≥ 90 on both. Record the four scores for each page in the commit message.

- [ ] **Step 3: Fix whatever the audit flagged**

Typical fixes, in the order they usually matter:
- A missing `alt` or an unlabelled control → add the `aria-label` or visible label.
- A contrast failure → lighten `--color-text-muted` (currently `#6b6b75`) until it clears 4.5:1 against `--color-surface`.
- A render-blocking stylesheet → confirm the `<link>` for content fonts stays inside the page rather than the layout.
- A heading order skip → make sure each page has exactly one `h1` and no level is skipped.

- [ ] **Step 4: Verify the keyboard pass**

Tab through `/` and one pairing page. Confirm: the heading picker, body picker, shuffle button, code tabs, and copy button are all reachable; each has a visible focus ring; each has an accessible name; the editable preview lines are reachable and announce as textboxes with a label.

- [ ] **Step 5: Re-run the build and commit**

```bash
npm run build
git add -A
git commit -m "perf: lighthouse pass — scores recorded in this message"
```

---

## Task 20: Deploy to Cloudflare Pages

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: the working `npm run build`.
- Produces: a live site on `www.kyno.top`.

> **This task needs the user.** Cloudflare account access, DNS nameserver changes at the kyno.top registrar, and the Google Search Console property are all the user's to perform. Do the repo-side work, then hand over the exact steps.

- [ ] **Step 1: Write `README.md`**

```markdown
# kyno.top

A free font pairing generator. Static site, built with Next.js and exported to
`out/`, deployed on Cloudflare Pages.

## Develop

```bash
npm install
npm run dev
```

## Data pipeline

Content lives in `data/` and is validated before every build.

```bash
npm run pairings:generate   # recipes + fonts -> data/pairings.json
npm run lint:data           # fails the build on thin or invalid data
```

Adding a pairing by hand: add it to `data/pairings.curated.json` and re-run both
commands above. Curated entries win over generated ones with the same slug.

## Build

```bash
npm run build   # lint + next build + page assertions + link check
```

## Licensing

Only open-licensed fonts (OFL-1.1, Apache-2.0, UFL) may enter the catalog, and
no font file is ever offered for download from this site. See
`THIRD-PARTY-LICENSES.md` and `/licenses`.
```

- [ ] **Step 2: Create the GitHub repo and push**

```bash
gh repo create KANE-CMD99/kyno-top --private --source=. --remote=origin --push
```

If `gh` is not authenticated for that account, create the empty repo in the GitHub UI and run `git remote add origin <url> && git push -u origin main`. Confirm the branch name matches Cloudflare's production branch setting.

**Before pushing: check the lockfile's registry.** Task 1 ran `npm install` from a machine that could not reach `registry.npmjs.org`, so `package-lock.json` resolves every package from `registry.npmmirror.com`:

```bash
grep -o "registry\.[a-z.]*" package-lock.json | sort -u
```

If that prints anything other than `registry.npmjs.org`, regenerate the lockfile against the official registry before Cloudflare starts building from it — a China mirror is not reliably reachable from Cloudflare's build infrastructure:

```bash
rm -rf node_modules package-lock.json
npm install --registry=https://registry.npmjs.org
npm ci && npm run build   # confirm the regenerated lockfile still resolves and builds
```

Commit the regenerated lockfile as its own commit before proceeding.

- [ ] **Step 3: Hand over the Cloudflare and DNS steps**

Give the user these exact steps:

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick `kyno-top`.
2. Build settings: framework preset **Next.js (Static HTML Export)**; build command `npm run build`; output directory `out`; production branch = the branch pushed in Step 2.
3. After the first deploy succeeds, **Custom domains** → add `kyno.top` and `www.kyno.top`.
4. At the kyno.top registrar, change the nameservers to the two Cloudflare provides. Propagation can take a few hours.
5. In Cloudflare **Rules → Redirect Rules**, add a rule: when the host equals `kyno.top`, redirect to `https://www.kyno.top${uri.path}` with status **301**. The canonical host is www everywhere in this codebase, so the apex must redirect.
6. **Analytics & Logs → Web Analytics** → enable for `kyno.top`, then paste the provided beacon `<script>` into `src/app/layout.tsx` inside `<body>` and redeploy.

- [ ] **Step 4: Verify the live site**

Once DNS resolves, confirm on `https://www.kyno.top`:
- The homepage loads over HTTPS with a valid certificate.
- `https://kyno.top` 301s to `https://www.kyno.top`.
- `https://www.kyno.top/sitemap.xml` returns XML with only `https://www.kyno.top` URLs.
- `https://www.kyno.top/robots.txt` references the sitemap.
- A pairing page loads and its canonical tag reads `https://www.kyno.top/pairings/...`.
- The nav's `Kyno Store →` link lands on kynocreative.com carrying `utm_source=kyno-top`.

- [ ] **Step 5: Add the reverse `sameAs` in the kynocreative.com repo**

In `E:\KYNO\web\web -mian`, open `src/components/OrganizationStructuredData.tsx` and add `https://www.kyno.top` to the organization's `sameAs` array, so the two properties declare the relationship from both sides. This is the **only** change this project makes in the kynocreative.com repo.

```bash
cd "/e/KYNO/web/web -mian"
git add src/components/OrganizationStructuredData.tsx
git commit -m "seo: declare the kyno.top pairing tool in the organization sameAs"
```

Deploy kynocreative.com the usual way (tar the source to the VPS, build, then restart PM2 — and remember the build must finish before the restart).

- [ ] **Step 6: Commit**

```bash
cd "/e/KYNO/web/kyno-top"
git add -A
git commit -m "docs: readme and deployment notes"
```

---

## Task 21: Hand over to Plan 2

**Files:** none.

**Interfaces:**
- Consumes: everything.
- Produces: a verified engine ready for the catalog scale-up.

- [ ] **Step 1: Run the full verification suite one more time**

```bash
cd "/e/KYNO/web/kyno-top"
npm test && npm run build
```

Expected: all unit tests pass, lint passes, build passes, page assertions pass, link check passes.

- [ ] **Step 2: Record the baseline numbers**

```bash
node -e "
const f=require('./data/fonts.json'), p=require('./data/pairings.json');
console.log({fonts: f.length, pairings: p.length, curated: p.filter(x=>x.curated).length});
"
```

Write these numbers into the message that opens Plan 2 — they are the baseline the scale-up is measured against.

- [ ] **Step 3: Stop here**

The catalog scale-up (to ~40 fonts, ~170 pairings, ~10 populated styles), the per-page metadata review, and the Search Console submission belong to **Plan 2: kyno.top Catalog and Launch**. Do not start it from this plan — the engine must be verified live first, because scaling content on top of an unverified engine multiplies any bug it has by the size of the catalog.

---

## Self-Review Notes

**Spec coverage.** Every spec section maps to a task: Information Architecture → Tasks 14–17; Data Model → Tasks 3, 5, 8; Pairing Data Pipeline → Tasks 5–7; Font Licensing → Tasks 6, 16 (plus the global constraints); Generator Page → Tasks 9, 11, 12, 13; Pairing Page → Task 14; Font Page → Task 15; Style Page → Task 15; Visual Design → Task 2; Funnel to kynocreative.com → Tasks 2, 13, 14; SEO → Tasks 10, 14, 15, 17; Tech Stack → Task 1; Deployment → Task 20; Testing/Acceptance → Tasks 6, 18, 19.

**Deliberately deferred to Plan 2:** the ~40-font catalog, the ~170 pairings, per-page OG images, and the GSC submission. These are content-volume and launch steps, and the spec puts them in phase 2 of the phasing section.

**Known soft spot.** Task 11's `PairingPreview` carries an explicit implementer note to simplify its ref handling; the observable requirement (typed text survives a font change, and is read with `textContent`) is what matters, and Task 19 Step 4 verifies it.
