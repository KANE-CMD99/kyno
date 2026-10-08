# Kyno Swiss-Minimalist Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Kyno homepage from dark SaaS aesthetic to light Swiss-minimalist style — new color system, Inter font, 2-col hero, category grid, expanded products, ad slot placeholder.

**Architecture:** Incremental component-by-component rewrite. Foundation first (CSS, fonts, data), then leaf components (Logo, cards), then section components (Hero, Categories), then assembly and cleanup. Each task produces a testable, commit-worthy unit.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Framer Motion (keep), Inter font, TypeScript

## Global Constraints

- No gradients anywhere — solid accent color `#1A56DB` only
- No purple (`#a855f7`), no cyan (`#06b6d4`), no dark backgrounds
- All backgrounds: `#FAFAFA` (page), `#FFFFFF` (cards), `#F5F5F5` (subtle)
- Text: `#171717` (primary), `#737373` (secondary), `#A3A3A3` (muted)
- Borders: `#E5E5E5` default, `#D4D4D4` hover
- Font: Inter via `next/font/google`, variable `--font-inter`
- No blob animations or CSS keyframe animations — remove them
- Keep Framer Motion for scroll-reveal and hover effects
- All buttons `rounded-lg`, all cards `rounded-lg border border-neutral-200`

---

### Task 1: Replace design tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS custom properties for light Swiss theme, Tailwind theme tokens

- [ ] **Step 1: Replace globals.css with light Swiss theme**

Replace the entire contents of `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-subtle: #F5F5F5;
  --color-accent: #1A56DB;
  --color-accent-hover: #1E40AF;
  --color-text-primary: #171717;
  --color-text-secondary: #737373;
  --color-text-muted: #A3A3A3;
  --color-border: #E5E5E5;
  --color-border-hover: #D4D4D4;
}

@theme inline {
  --color-kyno-bg: var(--color-bg);
  --color-kyno-surface: var(--color-surface);
  --color-kyno-subtle: var(--color-subtle);
  --color-kyno-accent: var(--color-accent);
  --color-kyno-accent-hover: var(--color-accent-hover);
  --color-kyno-text-primary: var(--color-text-primary);
  --color-kyno-text-secondary: var(--color-text-secondary);
  --color-kyno-text-muted: var(--color-text-muted);
  --color-kyno-border: var(--color-border);
  --color-kyno-border-hover: var(--color-border-hover);
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
}
```

- [ ] **Step 2: Verify the file was written correctly**

Run: `head -5 src/app/globals.css`
Expected: `@import "tailwindcss";`

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: replace dark theme tokens with Swiss light palette"
```

---

### Task 2: Swap Geist for Inter font

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: globals.css (Task 1)
- Produces: Inter font loaded via `--font-inter` CSS variable

- [ ] **Step 1: Replace Geist with Inter and update metadata**

Replace the entire contents of `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kyno — Premium Digital Assets for Creators",
  description:
    "Premium stock photos, templates, icons, and fonts crafted for the global creator economy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify — check that `dark` class is gone and Inter is imported**

Run: `grep -n "dark\|Geist\|Inter" src/app/layout.tsx`
Expected: Only `Inter` appears (import + variable), no `Geist`, no `dark`

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "style: swap Geist for Inter font, remove dark mode class"
```

---

### Task 3: Update site data — products, categories, nav links

**Files:**
- Modify: `src/data/site.ts`

**Interfaces:**
- Produces: `CategoryItem` interface, `categories` array, expanded `products` array (6 items), updated `navLinks`

- [ ] **Step 1: Rewrite site.ts with expanded data**

Replace the entire contents of `src/data/site.ts`:

```ts
export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  emoji: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  thumbnail?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { label: "Products", href: "#products" },
  { label: "Categories", href: "#categories" },
  { label: "Contact", href: "#contact" },
];

export const categories: CategoryItem[] = [
  {
    id: "stock-photos",
    title: "Stock Photos",
    description: "High-resolution images for any project, curated and ready to use.",
    emoji: String.fromCodePoint(0x1F4F7),
    href: "#",
  },
  {
    id: "templates",
    title: "Templates",
    description: "Website, UI & presentation templates to accelerate your workflow.",
    emoji: String.fromCodePoint(0x1F4D0),
    href: "#",
  },
  {
    id: "icons-fonts",
    title: "Icons & Fonts",
    description: "Curated icon sets and typefaces for distinctive design.",
    emoji: String.fromCodePoint(0x1F524),
    href: "#",
  },
  {
    id: "3d-more",
    title: "3D & More",
    description: "3D assets, illustrations, and creative resources.",
    emoji: String.fromCodePoint(0x1F3A8),
    href: "#",
  },
];

export const services: ServiceItem[] = [
  {
    title: "Design Templates",
    description:
      "Professional UI kits, website templates, and design systems to accelerate your workflow.",
    emoji: String.fromCodePoint(0x1F3A8),
  },
  {
    title: "Creative Assets",
    description:
      "High-quality icons, illustrations, fonts, and 3D assets for your projects.",
    emoji: String.fromCodePoint(0x2728),
  },
];

export const products: ProductItem[] = [
  { id: "1", name: "Ultimate UI Kit", category: "Templates", price: "$49" },
  { id: "2", name: "Icon Pack Pro", category: "Icons", price: "$29" },
  { id: "3", name: "Design System Pro", category: "Templates", price: "$99" },
  { id: "4", name: "Photo Presets Bundle", category: "Stock Photos", price: "$39" },
  { id: "5", name: "Modern Font Pack", category: "Fonts", price: "$24" },
  { id: "6", name: "3D Icon Collection", category: "3D", price: "$59" },
];

export const stats: StatItem[] = [
  { value: "50+", label: "Digital Products" },
  { value: "10k+", label: "Happy Customers" },
  { value: "4.9", label: "Average Rating" },
];
```

- [ ] **Step 2: Verify record counts**

Run: `node -e "const m = require('./src/data/site.ts');"` — this may fail due to TS, so instead just visually confirm the file has 6 products and 4 categories.

- [ ] **Step 3: Commit**

```bash
git add src/data/site.ts
git commit -m "feat: expand products to 6 items, add category data, update nav links"
```

---

### Task 4: Rewrite Logo — dark text, no gradient

**Files:**
- Modify: `src/components/Logo.tsx`

**Interfaces:**
- Produces: `<Logo />` — renders "KYNO" in neutral-900, no gradient, no "Technology" sub-label

- [ ] **Step 1: Replace Logo with plain dark text version**

Replace the entire contents of `src/components/Logo.tsx`:

```tsx
export default function Logo() {
  return (
    <span className="select-none text-2xl font-black tracking-tight text-neutral-900">
      KYNO
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Logo.tsx
git commit -m "style: simplify Logo to dark text, remove gradient and sub-label"
```

---

### Task 5: Rewrite SectionHeader — light theme, blue accent

**Files:**
- Modify: `src/components/SectionHeader.tsx`

**Interfaces:**
- Produces: `<SectionHeader label heading subtitle? />` — renders section label in blue-600, heading in neutral-900, subtitle in neutral-500

- [ ] **Step 1: Replace SectionHeader with light theme**

Replace the entire contents of `src/components/SectionHeader.tsx`:

```tsx
interface SectionHeaderProps {
  label: string;
  heading: string;
  subtitle?: string;
}

export default function SectionHeader({
  label,
  heading,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
        {label}
      </span>
      <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">{heading}</h2>
      {subtitle && (
        <p className="mt-3 max-w-lg text-base text-neutral-500">{subtitle}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionHeader.tsx
git commit -m "style: update SectionHeader to light theme with blue accent"
```

---

### Task 6: Rewrite StatsRow — light theme

**Files:**
- Modify: `src/components/StatsRow.tsx`

**Interfaces:**
- Consumes: `StatItem` from `@/data/site`
- Produces: `<StatsRow stats={StatItem[]} />` — renders stat numbers in neutral-900, labels in neutral-400, dividers in neutral-200

- [ ] **Step 1: Replace StatsRow with light theme**

Replace the entire contents of `src/components/StatsRow.tsx`:

```tsx
import type { StatItem } from "@/data/site";

interface StatsRowProps {
  stats: StatItem[];
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="flex items-center justify-center gap-10">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-10">
          <div className="text-center">
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-neutral-400">{stat.label}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="h-10 w-px bg-neutral-200" />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatsRow.tsx
git commit -m "style: update StatsRow to light theme"
```

---

### Task 7: Rewrite ProductCard — light theme, thumbnail support

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `ProductItem` from `@/data/site`
- Produces: `<ProductCard product={ProductItem} index={number} />` — light card with thumbnail placeholder, blue category tag, neutral price, hover lift effect

- [ ] **Step 1: Replace ProductCard with light theme version**

Replace the entire contents of `src/components/ProductCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ProductItem } from "@/data/site";

interface ProductCardProps {
  product: ProductItem;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      className="group cursor-pointer rounded-lg border border-neutral-200 bg-white overflow-hidden transition-all hover:border-neutral-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex h-44 items-center justify-center bg-neutral-100">
        <span className="text-3xl select-none text-neutral-300">
          {product.thumbnail ?? String.fromCodePoint(0x1F4E6)}
        </span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
          {product.category}
        </span>
        <h3 className="mt-1 text-base font-semibold text-neutral-900">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-neutral-900">{product.price}</p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "style: rewrite ProductCard for light Swiss theme with thumbnail placeholder"
```

---

### Task 8: Create CategoryCard component

**Files:**
- Create: `src/components/CategoryCard.tsx`

**Interfaces:**
- Consumes: `CategoryItem` from `@/data/site`
- Produces: `<CategoryCard category={CategoryItem} index={number} />` — clickable card with emoji, title, description, "Browse →" link

- [ ] **Step 1: Create CategoryCard.tsx**

Write `src/components/CategoryCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { CategoryItem } from "@/data/site";

interface CategoryCardProps {
  category: CategoryItem;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.a
      href={category.href}
      className="group rounded-lg border border-neutral-200 bg-white p-8 transition-all hover:border-blue-400"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-4 text-4xl">{category.emoji}</div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900">
        {category.title}
      </h3>
      <p className="text-sm leading-relaxed text-neutral-500">
        {category.description}
      </p>
      <span className="mt-3 inline-block text-sm font-medium text-blue-600">
        Browse &rarr;
      </span>
    </motion.a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryCard.tsx
git commit -m "feat: add CategoryCard component for category browsing cards"
```

---

### Task 9: Create ProductMosaic component (Hero right side)

**Files:**
- Create: `src/components/ProductMosaic.tsx`

**Interfaces:**
- Produces: `<ProductMosaic />` — 3×2 grid of staggered product thumbnail placeholders with emoji icons and labels

- [ ] **Step 1: Create ProductMosaic.tsx**

Write `src/components/ProductMosaic.tsx`:

```tsx
export default function ProductMosaic() {
  const placeholders = [
    { label: "UI Kit", emoji: String.fromCodePoint(0x1F4D0) },
    { label: "Icons", emoji: String.fromCodePoint(0x2728) },
    { label: "Photos", emoji: String.fromCodePoint(0x1F4F7) },
    { label: "Fonts", emoji: String.fromCodePoint(0x1F524) },
    { label: "3D", emoji: String.fromCodePoint(0x1F3A8) },
    { label: "Presets", emoji: String.fromCodePoint(0x1F39A) },
  ];

  const offsets = [
    "md:mt-0",
    "md:-mt-8",
    "md:mt-4",
    "md:mt-0",
    "md:-mt-6",
    "md:mt-2",
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {placeholders.map((item, i) => (
        <div
          key={item.label}
          className={`aspect-[4/3] rounded-lg border border-neutral-200 bg-white shadow-sm flex items-center justify-center ${offsets[i]}`}
        >
          <div className="text-center">
            <span className="text-2xl md:text-3xl">{item.emoji}</span>
            <p className="mt-1 text-[10px] md:text-xs text-neutral-400 font-medium">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductMosaic.tsx
git commit -m "feat: add ProductMosaic component for hero thumbnail grid"
```

---

### Task 10: Full rewrite of HeroSection

**Files:**
- Modify: `src/components/HeroSection.tsx`

**Interfaces:**
- Consumes: `stats` from `@/data/site`, `StatsRow`, `ProductMosaic`
- Produces: `<HeroSection />` — 2-col Swiss layout, text left, mosaic right, no gradients

- [ ] **Step 1: Replace HeroSection with 2-col Swiss layout**

Replace the entire contents of `src/components/HeroSection.tsx`:

```tsx
import { stats } from "@/data/site";
import StatsRow from "./StatsRow";
import ProductMosaic from "./ProductMosaic";

export default function HeroSection() {
  return (
    <section className="flex min-h-[90vh] items-center bg-[#FAFAFA] px-6 pb-24 pt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row md:gap-12">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 md:text-7xl">
            Premium assets
            <br />
            for creators
            <br />
            who ship
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-neutral-500 md:mx-0">
            High-quality stock photos, templates, icons, and fonts — crafted for
            designers and content creators.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
            <a
              href="#products"
              className="rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
            >
              Browse Products
            </a>
            <a
              href="#categories"
              className="rounded-lg border border-neutral-300 px-8 py-3 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            >
              View Categories
            </a>
          </div>

          <p className="mt-4 text-sm text-neutral-400">
            Free updates &middot; Lifetime access &middot; 50+ products
          </p>

          <div className="mt-16">
            <StatsRow stats={stats} />
          </div>
        </div>

        {/* Right: Product mosaic */}
        <div className="w-full max-w-md flex-1 md:max-w-none">
          <ProductMosaic />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: rewrite Hero in 2-col Swiss layout with product mosaic"
```

---

### Task 11: Create CategorySection component

**Files:**
- Create: `src/components/CategorySection.tsx`

**Interfaces:**
- Consumes: `categories` from `@/data/site`, `SectionHeader`, `CategoryCard`, `AnimatedSection`
- Produces: `<CategorySection />` — 4-column category browsing grid

- [ ] **Step 1: Create CategorySection.tsx**

Write `src/components/CategorySection.tsx`:

```tsx
import { categories } from "@/data/site";
import SectionHeader from "./SectionHeader";
import CategoryCard from "./CategoryCard";
import AnimatedSection from "./AnimatedSection";

export default function CategorySection() {
  return (
    <AnimatedSection id="categories" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="What we offer"
          heading="Browse by category"
          subtitle="Find exactly what you need for your next project."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategorySection.tsx
git commit -m "feat: add CategorySection with 4-column category grid"
```

---

### Task 12: Update ProductsSection — 3-col grid, light theme

**Files:**
- Modify: `src/components/ProductsSection.tsx`

**Interfaces:**
- Consumes: `products` from `@/data/site`, `SectionHeader`, `ProductCard` (updated), `AnimatedSection`
- Produces: `<ProductsSection />` — 3-column featured products grid

- [ ] **Step 1: Update ProductsSection to 3-col light layout**

Replace the entire contents of `src/components/ProductsSection.tsx`:

```tsx
import { products } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";

export default function ProductsSection() {
  return (
    <AnimatedSection id="products" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeader label="Products" heading="Featured Products" />
          <a
            href="#"
            className="hidden shrink-0 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 sm:block"
          >
            View All &rarr;
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductsSection.tsx
git commit -m "style: update ProductsSection to 3-col light theme layout"
```

---

### Task 13: Rewrite Nav — light theme

**Files:**
- Modify: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `Logo` (updated), `navLinks` from `@/data/site` (updated)
- Produces: `<Nav />` — fixed light nav with white bg on scroll, blue CTA button

- [ ] **Step 1: Replace Nav with light theme version**

Replace the entire contents of `src/components/Nav.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { navLinks } from "@/data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 py-4 transition-all ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse Products
          </a>
        </div>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-neutral-900 transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-neutral-900 transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-neutral-900 transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-base font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#products"
              onClick={closeMenu}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Browse Products
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "style: rewrite Nav for light Swiss theme"
```

---

### Task 14: Rewrite CTASection — light theme

**Files:**
- Modify: `src/components/CTASection.tsx`

**Interfaces:**
- Consumes: `AnimatedSection`
- Produces: `<CTASection />` — centered CTA on neutral-100 background, blue button

- [ ] **Step 1: Replace CTASection with light theme version**

Replace the entire contents of `src/components/CTASection.tsx`:

```tsx
"use client";

import AnimatedSection from "./AnimatedSection";

export default function CTASection() {
  return (
    <AnimatedSection
      id="contact"
      className="bg-neutral-100 px-6 py-28 text-center"
    >
      <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
        Ready to create?
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-neutral-500">
        Start building with premium assets trusted by thousands of creators.
      </p>
      <a
        href="#products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-10 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
      >
        Browse All Products
      </a>
      <p className="mt-4 text-sm text-neutral-400">
        No subscriptions. Pay once, own forever.
      </p>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CTASection.tsx
git commit -m "style: rewrite CTASection for light Swiss theme"
```

---

### Task 15: Create AdSlot placeholder component

**Files:**
- Create: `src/components/AdSlot.tsx`

**Interfaces:**
- Produces: `<AdSlot />` — centered dashed-border placeholder for Google Ads, hidden by default when no ad active

- [ ] **Step 1: Create AdSlot.tsx**

Write `src/components/AdSlot.tsx`:

```tsx
export default function AdSlot() {
  return (
    <section className="bg-[#FAFAFA] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div
          id="ad-slot"
          className="flex h-24 items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-100"
        >
          <span className="text-sm text-neutral-400">Advertisement</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AdSlot.tsx
git commit -m "feat: add AdSlot placeholder for future Google Ads integration"
```

---

### Task 16: Simplify Footer — light theme

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `Logo` (updated)
- Produces: `<Footer />` — single-row footer with logo, copyright, 3 social links on light background

- [ ] **Step 1: Replace Footer with light simplified version**

Replace the entire contents of `src/components/Footer.tsx`:

```tsx
import Logo from "./Logo";

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Email", href: "mailto:hello@kyno.tech" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#FAFAFA] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Kyno
          </span>
        </div>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-600"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "style: simplify Footer for light Swiss theme"
```

---

### Task 17: Wire up page.tsx and remove old sections

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: All updated section and card components
- Produces: Complete homepage with all 7 sections in order

- [ ] **Step 1: Update page.tsx with new sections**

Replace the entire contents of `src/app/page.tsx`:

```tsx
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductsSection from "@/components/ProductsSection";
import StatsRow from "@/components/StatsRow";
import AdSlot from "@/components/AdSlot";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { stats } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <CategorySection />
        <ProductsSection />
        <section className="bg-neutral-100 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <StatsRow stats={stats} />
          </div>
        </section>
        <AdSlot />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble homepage with Swiss-minimalist sections and ad slot"
```

---

### Task 18: Remove deprecated ServicesSection and ServiceCard

**Files:**
- Delete: `src/components/ServicesSection.tsx`
- Delete: `src/components/ServiceCard.tsx`

**Note:** The `services` array is kept in `site.ts` for potential reuse, but the old section and card components are no longer used.

- [ ] **Step 1: Delete the old files**

```bash
git rm src/components/ServicesSection.tsx src/components/ServiceCard.tsx
```

- [ ] **Step 2: Verify no imports reference the deleted files**

Run: `grep -r "ServicesSection\|ServiceCard" src/`
Expected: No matches (or only in site.ts where `ServiceItem` interface is still defined)

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove deprecated ServicesSection and ServiceCard components"
```

---

### Task 19: Build and verify

- [ ] **Step 1: Install dependencies (if needed) and build**

Run: `npm run build`
Expected: Successful build with no errors

- [ ] **Step 2: Check for any TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

Then open `http://localhost:3000` and verify:
- Page background is light (`#FAFAFA`)
- Hero is 2-column with text left and product mosaic right
- No purple or cyan anywhere
- Nav is transparent on load, white on scroll
- Category cards show 4 items
- Product cards show 6 items
- Ad slot shows dashed border with "Advertisement" text
- CTA has light gray background
- Footer is clean and minimal
- No blob animations or gradients visible

- [ ] **Step 4: Commit any final fixes if needed, then mark complete**

---

## Implementation Order Dependency Graph

```
Task 1 (globals.css) ──┐
                       ├──> Task 4-19 (all visual components depend on tokens)
Task 2 (layout.tsx) ───┤
Task 3 (site.ts) ──────┘

Task 4 (Logo) ────────> Task 13 (Nav), Task 16 (Footer)
Task 5 (SectionHeader) ─> Task 11 (CategorySection), Task 12 (ProductsSection)
Task 6 (StatsRow) ─────> Task 10 (HeroSection), Task 17 (page.tsx)
Task 7 (ProductCard) ──> Task 12 (ProductsSection)
Task 8 (CategoryCard) ─> Task 11 (CategorySection)
Task 9 (ProductMosaic) ─> Task 10 (HeroSection)
Task 10 (HeroSection) ─> Task 17 (page.tsx)
Task 11 (CategorySection) ─> Task 17 (page.tsx)
Task 12 (ProductsSection) ─> Task 17 (page.tsx)
Task 13 (Nav) ─────────> Task 17 (page.tsx)
Task 14 (CTASection) ──> Task 17 (page.tsx)
Task 15 (AdSlot) ──────> Task 17 (page.tsx)
Task 16 (Footer) ──────> Task 17 (page.tsx)
Task 17 (page.tsx) ────> Task 18 (cleanup) ────> Task 19 (verify)
```

Tasks 1-3 must run first (foundation). Tasks 4-9 are leaf components and can run in any order. Tasks 10-16 depend on leaf components. Task 17 depends on all sections. Task 18 is cleanup after assembly. Task 19 is final verification.
