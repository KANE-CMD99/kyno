# Kyno Technology Homepage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page marketing homepage for Kyno Technology Limited using Next.js 15, Tailwind CSS, and Framer Motion.

**Architecture:** Next.js App Router with a single page at `/` composing 6 sections (Nav, Hero, Services, Products, CTA, Footer). All data is static — sourced from local constants. Components are server-rendered with Framer Motion client-side animations.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, Geist font

## Global Constraints

- Next.js 15 with App Router (not Pages Router)
- Tailwind CSS v4 (not v3)
- Framer Motion for scroll-triggered and hover animations
- Geist font from `next/font/google`
- Color palette: background `#0a0a0f`, surface `#0d0d14`, deep surface `#06060a`, purple `#a855f7`, cyan `#06b6d4`
- No external API calls — all data from local constants
- Responsive: mobile 1-col, tablet 2-col, desktop 3/4-col grids
- No CMS, no auth, no i18n, no product detail pages
- Use `npx` for all scaffolding commands (do NOT install create-next-app globally)

## File Map

```
kyno-homepage/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout — font, metadata, global shell
│   │   ├── page.tsx            # Homepage — composes all sections
│   │   └── globals.css         # Tailwind imports + theme custom properties
│   ├── components/
│   │   ├── Logo.tsx            # Gradient "K" + KYNO wordmark
│   │   ├── Nav.tsx             # Sticky top bar (client component)
│   │   ├── SectionHeader.tsx   # Reusable section label + heading + subtitle
│   │   ├── AnimatedSection.tsx # Framer Motion scroll wrapper (client)
│   │   ├── HeroSection.tsx     # Hero with blobs, headline, CTA, stats
│   │   ├── StatsRow.tsx        # 50+ / 10k+ / 4.9 stat items
│   │   ├── ServicesSection.tsx # "What We Do" 3-card grid
│   │   ├── ServiceCard.tsx     # Individual service card
│   │   ├── ProductsSection.tsx # "Featured Products" 4-col grid
│   │   ├── ProductCard.tsx     # Individual product preview card
│   │   ├── CTASection.tsx      # Gradient banner + CTA button
│   │   └── Footer.tsx          # Copyright + social links
│   └── data/
│       └── site.ts             # Services, products, nav links constants
├── tailwind.config.ts          # (if needed for v4 theme extensions)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: entire project scaffold

- [ ] **Step 1: Run create-next-app**

```bash
cd "E:/KYNO/web/web -mian"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --no-git
```

Expected: project scaffolds successfully with `package.json`, `src/`, `tailwind.config.ts`, etc.

- [ ] **Step 2: Install Framer Motion**

```bash
cd "E:/KYNO/web/web -mian"
npm install framer-motion
```

Expected: `framer-motion` added to `package.json` dependencies.

- [ ] **Step 3: Verify dev server starts**

```bash
cd "E:/KYNO/web/web -mian"
npm run dev
```

Expected: dev server starts on `http://localhost:3000`, shows default Next.js page.

- [ ] **Step 4: Stop dev server and commit**

Stop the server (Ctrl+C), then verify the scaffold:

```bash
cd "E:/KYNO/web/web -mian"
ls src/app/layout.tsx src/app/page.tsx src/app/globals.css package.json
```

Expected: all three files exist.

---

### Task 2: Configure Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Produces:** CSS custom properties for colors, configured Geist font, dark background shell.

- [ ] **Step 1: Write globals.css with theme tokens**

Replace the entire content of `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --color-bg: #0a0a0f;
  --color-surface: #0d0d14;
  --color-deep: #06060a;
  --color-purple: #a855f7;
  --color-cyan: #06b6d4;
  --color-text-primary: #ffffff;
  --color-text-secondary: #9090a0;
  --color-text-muted: #666666;
}

/* Allow Tailwind to use these as arbitrary values via theme */
@theme inline {
  --color-kyno-bg: var(--color-bg);
  --color-kyno-surface: var(--color-surface);
  --color-kyno-deep: var(--color-deep);
  --color-kyno-purple: var(--color-purple);
  --color-kyno-cyan: var(--color-cyan);
  --color-kyno-text-primary: var(--color-text-primary);
  --color-kyno-text-secondary: var(--color-text-secondary);
  --color-kyno-text-muted: var(--color-text-muted);
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
}

/* Subtle light blob animations */
@keyframes blob-float-purple {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes blob-float-cyan {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, -20px) scale(0.95); }
  66% { transform: translate(20px, 25px) scale(1.05); }
}

.animate-blob-purple {
  animation: blob-float-purple 8s ease-in-out infinite;
}

.animate-blob-cyan {
  animation: blob-float-cyan 10s ease-in-out infinite;
}
```

- [ ] **Step 2: Update layout.tsx with Geist font and metadata**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Kyno Technology — Digital Products for Creators",
  description:
    "Premium templates, courses & assets crafted for the global creator economy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000` — page should render with dark background and Geist font.

---

### Task 3: Create Site Data Constants

**Files:**
- Create: `src/data/site.ts`

**Produces:** Typed arrays for nav links, services, products. Used by all section components.

- [ ] **Step 1: Write site data file**

Create `src/data/site.ts`:

```ts
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
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
];

export const services: ServiceItem[] = [
  {
    title: "Design Templates",
    description:
      "Professional UI kits, website templates, and design systems to accelerate your workflow.",
    emoji: "🎨",
  },
  {
    title: "Online Courses",
    description:
      "In-depth video courses on design, development, and digital business strategies.",
    emoji: "📚",
  },
  {
    title: "Creative Assets",
    description:
      "High-quality icons, illustrations, fonts, and 3D assets for your projects.",
    emoji: "✨",
  },
];

export const products: ProductItem[] = [
  { id: "1", name: "Ultimate UI Kit", category: "Design", price: "$49" },
  { id: "2", name: "Webflow Masterclass", category: "Course", price: "$79" },
  { id: "3", name: "Icon Pack Pro", category: "Assets", price: "$29" },
  { id: "4", name: "Design System Pro", category: "Design", price: "$99" },
];

export const stats: StatItem[] = [
  { value: "50+", label: "Digital Products" },
  { value: "10k+", label: "Happy Customers" },
  { value: "4.9", label: "Average Rating" },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 4: Logo Component

**Files:**
- Create: `src/components/Logo.tsx`

**Produces:** `<Logo />` — gradient "K" + "YNO" wordmark. Used by Nav and Footer.

- [ ] **Step 1: Write Logo component**

Create `src/components/Logo.tsx`:

```tsx
export default function Logo() {
  return (
    <div className="select-none">
      <span className="text-2xl font-black tracking-tight text-white">
        <span className="bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          K
        </span>
        YNO
      </span>
      <span className="ml-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">
        Technology
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verify import compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 5: Nav Component

**Files:**
- Create: `src/components/Nav.tsx`
- Consumes: `src/data/site.ts` (navLinks), `src/components/Logo.tsx`

**Produces:** `<Nav />` — sticky top bar with logo, nav links, and "Get Started" CTA. Client component (uses scroll state).

- [ ] **Step 1: Write Nav component**

Create `src/components/Nav.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import { navLinks } from "@/data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 py-4 transition-colors ${
        scrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.06]"
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
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 6: SectionHeader Component

**Files:**
- Create: `src/components/SectionHeader.tsx`

**Produces:** `<SectionHeader label={...} heading={...} subtitle={...} />` — reusable section title block. Used by ServicesSection, ProductsSection.

- [ ] **Step 1: Write SectionHeader component**

Create `src/components/SectionHeader.tsx`:

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
      <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-purple-400">
        {label}
      </span>
      <h2 className="text-3xl font-bold text-white md:text-4xl">{heading}</h2>
      {subtitle && (
        <p className="mt-3 max-w-lg text-base text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 7: StatsRow Component

**Files:**
- Create: `src/components/StatsRow.tsx`
- Consumes: `src/data/site.ts` (stats, StatItem)

**Produces:** `<StatsRow stats={...} />` — horizontal stat items separated by subtle dividers. Used inside HeroSection.

- [ ] **Step 1: Write StatsRow component**

Create `src/components/StatsRow.tsx`:

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
            <div className="text-4xl font-extrabold tracking-tight text-white">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="h-10 w-px bg-white/[0.08]" />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 8: HeroSection Component

**Files:**
- Create: `src/components/HeroSection.tsx`
- Consumes: `src/data/site.ts` (stats), `src/components/StatsRow.tsx`

**Produces:** `<HeroSection />` — full hero with gradient background, animated blobs, gradient headline, CTA buttons, and stats row.

- [ ] **Step 1: Write HeroSection component**

Create `src/components/HeroSection.tsx`:

```tsx
import { stats } from "@/data/site";
import StatsRow from "./StatsRow";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#07071a] via-[#110526] to-[#0a1020]" />

      {/* Purple glow blob — top right */}
      <div className="animate-blob-purple absolute -top-24 -right-16 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-500/30 to-transparent blur-3xl" />

      {/* Cyan glow blob — bottom left */}
      <div className="animate-blob-cyan absolute -bottom-20 -left-12 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-cyan-400/25 to-transparent blur-3xl" />

      {/* Geometric accent — rotated square */}
      <div className="absolute left-[8%] top-[15%] h-20 w-20 rotate-[15deg] rounded-2xl border border-purple-400/10" />

      {/* Geometric accent — small diamond */}
      <div className="absolute right-[18%] top-[25%] h-6 w-6 rotate-45 rounded-md bg-purple-400/10" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white md:text-7xl">
          <span className="bg-gradient-to-br from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Digital
          </span>
          <br />
          Products for
          <br />
          Creators
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
          Premium templates, courses &amp; assets crafted for the global creator
          economy.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#products"
            className="rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore Products
          </a>
          <a
            href="#services"
            className="rounded-lg border border-white/20 px-8 py-3 text-base font-medium text-gray-300 transition-colors hover:border-white/40 hover:text-white"
          >
            View Showcase →
          </a>
        </div>

        <div className="mt-16">
          <StatsRow stats={stats} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 9: ServiceCard + ServicesSection

**Files:**
- Create: `src/components/ServiceCard.tsx`
- Create: `src/components/ServicesSection.tsx`
- Consumes: `src/data/site.ts` (services, ServiceItem), `src/components/SectionHeader.tsx`

**Produces:** `<ServicesSection />` — "What We Do" section with 3 service cards in a responsive grid.

- [ ] **Step 1: Write ServiceCard component**

Create `src/components/ServiceCard.tsx`:

```tsx
import type { ServiceItem } from "@/data/site";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] p-8 transition-all hover:border-white/[0.12] hover:bg-[#0d0d14]/80 hover:scale-[1.02]">
      <div className="mb-4 text-4xl">{service.emoji}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">
        {service.description}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Write ServicesSection component**

Create `src/components/ServicesSection.tsx`:

```tsx
import { services } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#0a0a0f] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="What We Do"
          heading="Digital Products, Crafted with Precision"
          subtitle="Every product we ship goes through rigorous design and development to ensure it meets the highest standards."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 10: ProductCard + ProductsSection

**Files:**
- Create: `src/components/ProductCard.tsx`
- Create: `src/components/ProductsSection.tsx`
- Consumes: `src/data/site.ts` (products, ProductItem), `src/components/SectionHeader.tsx`

**Produces:** `<ProductsSection />` — "Featured Products" section with 4 product cards.

- [ ] **Step 1: Write ProductCard component**

Create `src/components/ProductCard.tsx`:

```tsx
import type { ProductItem } from "@/data/site";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] overflow-hidden transition-all hover:border-white/[0.12] hover:scale-[1.02]">
      {/* Placeholder thumbnail */}
      <div className="flex h-44 items-center justify-center bg-white/[0.03]">
        <span className="text-3xl select-none">📦</span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-purple-400">
          {product.category}
        </span>
        <h3 className="mt-1 text-base font-semibold text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-cyan-400">
          {product.price}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write ProductsSection component**

Create `src/components/ProductsSection.tsx`:

```tsx
import { products } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  return (
    <section id="products" className="bg-[#0d0d14] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeader
            label="Products"
            heading="Featured Products"
          />
          <a
            href="#"
            className="hidden shrink-0 text-sm text-cyan-400 transition-colors hover:text-cyan-300 sm:block"
          >
            View All →
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 11: CTASection Component

**Files:**
- Create: `src/components/CTASection.tsx`

**Produces:** `<CTASection />` — gradient banner section with heading, subtitle, and "Get in Touch" button.

- [ ] **Step 1: Write CTASection component**

Create `src/components/CTASection.tsx`:

```tsx
export default function CTASection() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-[#110526] to-[#0a1020] px-6 py-28 text-center"
    >
      <h2 className="text-3xl font-bold text-white md:text-4xl">
        Ready to Elevate Your Work?
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
        Join thousands of creators using Kyno products worldwide.
      </p>
      <a
        href="mailto:hello@kyno.tech"
        className="mt-8 inline-block rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-10 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
      >
        Get in Touch
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 12: Footer Component

**Files:**
- Create: `src/components/Footer.tsx`
- Consumes: `src/components/Logo.tsx`

**Produces:** `<Footer />` — copyright text + social links.

- [ ] **Step 1: Write Footer component**

Create `src/components/Footer.tsx`:

```tsx
import Logo from "./Logo";

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:hello@kyno.tech" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#06060a] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Kyno Technology Limited
          </span>
        </div>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

### Task 13: Page Composition

**Files:**
- Modify: `src/app/page.tsx`

**Consumes:** All section components (HeroSection, ServicesSection, ProductsSection, CTASection), Nav, Footer.

**Produces:** Complete homepage at `/` composing all sections.

- [ ] **Step 1: Write homepage page**

Replace `src/app/page.tsx` with:

```tsx
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify full TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify render**

```bash
npm run dev
```

Visit `http://localhost:3000`. All sections should render in order with correct styling.

---

### Task 14: Framer Motion Animations

**Files:**
- Create: `src/components/AnimatedSection.tsx`
- Modify: `src/components/ServicesSection.tsx`
- Modify: `src/components/ProductsSection.tsx`
- Modify: `src/components/CTASection.tsx`
- Modify: `src/components/HeroSection.tsx`

**Produces:** Scroll-triggered fade-in + slide-up animations for each section.

- [ ] **Step 1: Write AnimatedSection wrapper**

Create `src/components/AnimatedSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function AnimatedSection({
  children,
  className,
  id,
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 2: Wrap ServicesSection in AnimatedSection**

Modify `src/components/ServicesSection.tsx`:

```tsx
import { services } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";
import AnimatedSection from "./AnimatedSection";

export default function ServicesSection() {
  return (
    <AnimatedSection id="services" className="bg-[#0a0a0f] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="What We Do"
          heading="Digital Products, Crafted with Precision"
          subtitle="Every product we ship goes through rigorous design and development to ensure it meets the highest standards."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 3: Wrap ProductsSection in AnimatedSection**

Modify `src/components/ProductsSection.tsx`:

```tsx
import { products } from "@/data/site";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";
import AnimatedSection from "./AnimatedSection";

export default function ProductsSection() {
  return (
    <AnimatedSection id="products" className="bg-[#0d0d14] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeader label="Products" heading="Featured Products" />
          <a
            href="#"
            className="hidden shrink-0 text-sm text-cyan-400 transition-colors hover:text-cyan-300 sm:block"
          >
            View All →
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 4: Wrap CTASection in AnimatedSection**

Modify `src/components/CTASection.tsx`:

```tsx
"use client";

import AnimatedSection from "./AnimatedSection";

export default function CTASection() {
  return (
    <AnimatedSection
      id="contact"
      className="bg-gradient-to-br from-[#110526] to-[#0a1020] px-6 py-28 text-center"
    >
      <h2 className="text-3xl font-bold text-white md:text-4xl">
        Ready to Elevate Your Work?
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
        Join thousands of creators using Kyno products worldwide.
      </p>
      <a
        href="mailto:hello@kyno.tech"
        className="mt-8 inline-block rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-10 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
      >
        Get in Touch
      </a>
    </AnimatedSection>
  );
}
```

- [ ] **Step 5: Add staggered card animations for ServiceCard**

Modify `src/components/ServiceCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ServiceItem } from "@/data/site";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] p-8 transition-all hover:border-white/[0.12] hover:scale-[1.02]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-4 text-4xl">{service.emoji}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">
        {service.description}
      </p>
    </motion.div>
  );
}
```

Update ServicesSection to pass `index`:

In `src/components/ServicesSection.tsx`, change the map to:
```tsx
{services.map((service, i) => (
  <ServiceCard key={service.title} service={service} index={i} />
))}
```

- [ ] **Step 6: Add staggered card animations for ProductCard**

Modify `src/components/ProductCard.tsx`:

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
      className="group rounded-xl border border-white/[0.06] bg-[#0d0d14] overflow-hidden transition-all hover:border-white/[0.12] hover:scale-[1.02]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex h-44 items-center justify-center bg-white/[0.03]">
        <span className="text-3xl select-none">📦</span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-purple-400">
          {product.category}
        </span>
        <h3 className="mt-1 text-base font-semibold text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-cyan-400">{product.price}</p>
      </div>
    </motion.div>
  );
}
```

Update ProductsSection to pass `index`:

In `src/components/ProductsSection.tsx`, change the map to:
```tsx
{products.map((product, i) => (
  <ProductCard key={product.id} product={product} index={i} />
))}
```

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit
npm run dev
```

Scroll through the page at `http://localhost:3000`. Sections should animate in with fade+slide-up. Cards should stagger.

---

### Task 15: Responsive Polish & Mobile Nav

**Files:**
- Modify: `src/components/Nav.tsx` (add mobile hamburger menu)
- Modify: `src/components/Footer.tsx` (stack on mobile)
- Modify: `src/components/HeroSection.tsx` (adjust text sizes)

**Produces:** Proper responsive layout across mobile, tablet, desktop.

- [ ] **Step 1: Add mobile hamburger menu to Nav**

Replace `src/components/Nav.tsx` with:

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
      className={`fixed top-0 z-50 w-full px-6 py-4 transition-colors ${
        scrolled
          ? "bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#0d0d14] p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-base text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={closeMenu}
              className="rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-medium text-white"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Verify responsive layout**

```bash
npm run dev
```

Resize browser to 375px, 768px, 1280px widths. Verify:
- Nav collapses to hamburger on mobile
- Hero text scales down on mobile
- Service grid: 1 col mobile, 2 col tablet, 3 col desktop
- Product grid: 1 col mobile, 2 col tablet, 4 col desktop
- Footer stacks vertically on mobile

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

---

### Task 16: Final Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: successful build with no errors or warnings.

- [ ] **Step 2: Verify Lighthouse via dev server**

```bash
npm run dev
```

Check `http://localhost:3000`:
- All 4 sections render
- Logo gradient displays correctly
- Hero blobs animate
- Scroll animations fire
- Mobile hamburger menu works
- Stats row shows 3 stats with dividers
- Footer shows copyright + social links
- Color contrast readable (white on dark)

---

## Verification Checklist

Before marking implementation complete:

- [ ] `npm run build` succeeds with zero errors
- [ ] Dev server renders homepage without console errors
- [ ] Nav: sticky, transparent→solid on scroll, hamburger on mobile
- [ ] Hero: gradient background, animated blobs, gradient "Digital" text, stats row
- [ ] Services: 3 cards in responsive grid, hover effects
- [ ] Products: 4 cards in responsive grid, placeholder thumbnails
- [ ] CTA: gradient banner, "Get in Touch" button
- [ ] Footer: logo + copyright + social links
- [ ] Framer Motion: sections fade in on scroll, cards stagger
- [ ] Responsive: mobile (375px), tablet (768px), desktop (1280px) all look correct
- [ ] `npx tsc --noEmit` passes

