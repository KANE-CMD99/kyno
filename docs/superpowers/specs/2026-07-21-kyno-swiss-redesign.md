# Kyno — Homepage Redesign Spec (Swiss Minimalist)

**Date**: 2026-07-21
**Status**: Approved
**Project**: Kyno personal indie studio — digital products marketplace homepage

## Overview

Redesign the Kyno homepage from a dark SaaS aesthetic to a light Swiss-minimalist style targeting EU/US creators. The site sells digital products (stock photos, templates, icons, fonts, 3D assets) to designers and content creators.

**Goals:**
- Shift brand perception from "tech company" to "creator studio"
- Let product visuals be the primary color and visual interest
- Clean, high-trust aesthetic familiar to western creative audiences
- Fast comprehension — what Kyno sells, understood in under 3 seconds

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router) | Keep existing |
| Styling | Tailwind CSS v4 | Keep existing |
| Animation | Framer Motion | Keep existing, simplify motion |
| Deployment | Vercel | Keep existing |
| Font | **Inter** (replaces Geist) | `next/font/google` — Inter + Inter Display |

## Visual Design System

### Colors (Swiss Light)

| Token | Hex | Usage |
|-------|-----|-------|
| Page background | `#FAFAFA` | Body background |
| Surface / Card | `#FFFFFF` | Cards, nav background |
| Subtle background | `#F5F5F5` | CTA section, category tags, social proof strip |
| Text primary | `#171717` | Headlines, product names |
| Text secondary | `#737373` | Body, descriptions |
| Text muted | `#A3A3A3` | Labels, captions, footer |
| Accent | `#1A56DB` | Buttons, links, category labels, interactive states |
| Accent hover | `#1E40AF` | Button hover, link hover |
| Border | `#E5E5E5` | Card borders, dividers |
| Border hover | `#D4D4D4` | Card hover border |

**Key principle**: No gradients. No purple. No cyan. One accent color. Product images provide the visual richness.

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Hero headline | Inter | 800 (extrabold) | `text-5xl` / `md:text-7xl` |
| Section headings | Inter | 700 (bold) | `text-3xl` / `md:text-4xl` |
| Body text | Inter | 400 (regular) | `text-base` / `text-lg` |
| Labels / tags | Inter | 500 (medium) | `text-xs` uppercase tracking |
| Prices | Inter | 600 (semibold) | `text-lg` |
| Buttons | Inter | 500 (medium) | `text-base` |

- Letter-spacing: `tracking-tight` on headlines, `tracking-wider` on uppercase labels
- Line-height: `leading-tight` for headlines, `leading-relaxed` for body

### Spacing & Shape

- Section padding: `py-24` (mobile) / `py-28` (desktop)
- Container max-width: `max-w-6xl` (72rem / 1152px)
- Grid gap: `gap-6` (24px)
- Card border-radius: `rounded-lg` (8px)
- Button border-radius: `rounded-lg` (8px)
- Card border: `border border-neutral-200`

## Page Structure

```
┌──────────────────────────┐
│          Nav             │  Fixed, light bg on scroll
├──────────────────────────┤
│          Hero            │  2-col: text left / product previews right
├──────────────────────────┤
│    Product Categories    │  3-col grid of category cards
├──────────────────────────┤
│    Featured Products     │  3-col grid of product cards + "View All"
├──────────────────────────┤
│     Social Proof         │  Stats row + optional quotes
├──────────────────────────┤
│      Ad Slot             │  Reserved banner for Google Ads (placeholder)
├──────────────────────────┤
│          CTA             │  Centered banner, light gray bg
├──────────────────────────┤
│         Footer           │  Minimal — logo, copyright, 3 links
└──────────────────────────┘
```

### 1. Navigation

- Fixed top, transparent on scroll top → `bg-white/95 backdrop-blur-md` + `border-b border-neutral-200` when scrolled
- Left: Logo (text-only "KYNO", dark, no gradient)
- Right: Products / Categories / Contact links + "Browse Products" solid blue button
- Mobile: hamburger → slide-down panel

### 2. Hero

- Two-column layout: text (left, ~50%) / product preview mosaic (right, ~50%)
- **Left**: 
  - Headline: "Premium assets for creators who ship"; `text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900`
  - Subtitle: one sentence value prop, `text-lg text-neutral-500`
  - Two buttons: "Browse Products" (filled blue) + "View Showcase" (outlined, `border-neutral-300`)
  - Trust micro-copy below buttons: small gray text like "Free updates · Lifetime access · 50+ products"
- **Right**:
  - 3×2 mosaic of product thumbnail placeholders, staggered offset for editorial feel
  - Each thumbnail: `aspect-[4/3]` or `aspect-square`, rounded-lg, light border, subtle `shadow-sm`
  - Thumbnails use `bg-neutral-100` placeholder with centered product-type icon until real images are available
  - Stacked on mobile (below text), side-by-side on md+ screens
- Background: `#FAFAFA`, no gradients, no blobs, no decorative shapes
- Min height: `min-h-[90vh]`, vertically centered via flex

### 3. Product Categories

- Section label: "What we offer" (uppercase, blue, small)
- Section heading: "Browse by category" (2xl/3xl, bold)
- 3-column grid (1-col mobile, 3-col desktop)
- **Cards**: white bg, light border, icon (emoji/SVG) top-left, title, short description, "Browse →" hint at bottom
- Hover: border turns accent blue, subtle lift
- Categories: Stock Photos / Templates / Icons & Fonts / 3D & More

### 4. Featured Products

- Row header: left "Featured Products" label + heading, right "View All →" link (blue)
- 3-column grid (1-col mobile, 2-col tablet, 3-col desktop)
- **Cards**: white bg, border `border-neutral-200`, product thumbnail (light gray placeholder for now), category tag (blue uppercase), product name, price in black semibold
- Hover: `translateY(-4px)`, border darkens
- Expand data from 3 to 6 product entries

### 5. Social Proof

- Light gray `#F5F5F5` background strip
- 3 stats centered: `50+`, `10k+`, `4.9` with labels; numbers `text-4xl font-extrabold`, labels `text-sm text-neutral-500`
- Vertical dividers between stats
- Optional: 2-3 short customer quotes below stats

### 6. Ad Slot (Placeholder)

- Purpose: reserved horizontal banner slot for future Google AdSense / Ad Manager integration
- Position: between Social Proof and CTA, full-width within `max-w-6xl` container
- Layout: centered banner, `h-24` or `h-32`, `bg-neutral-100`, dashed border `border border-dashed border-neutral-300`
- Placeholder content: light gray text "Advertisement" centered, subtle — not distracting
- Hidden by default when no ad is configured (conditionally rendered or CSS hidden)
- Implementation: wrap in a `<div id="ad-slot" />` that Google Ads can target; the placeholder state is pure CSS, the real ads are injected via Google's `<script>` tag later

### 7. CTA

- Light gray background
- Centered layout
- Headline: "Ready to create?" (short, punchy)
- Subtitle: one line
- Blue solid button: "Browse All Products"
- Micro-copy below: "No subscriptions. Pay once, own forever."

### 8. Footer

- White or `#FAFAFA` background
- Top border `border-t border-neutral-200`
- Single row: left Logo + © 2026 Kyno, right Twitter / Email / Dribbble links
- No sitemap, no newsletter, no heavy link clusters

## Component Tree (Updated)

```
Layout
├── Nav
│   ├── Logo (text-only, dark)
│   └── NavLinks + CTA button
├── HeroSection
│   ├── HeroText (headline, subtitle, buttons, trust micro-copy)
│   └── ProductMosaic (3×2 thumbnail grid)
├── CategorySection
│   ├── SectionHeader
│   └── CategoryCard (×4)
├── ProductsSection
│   ├── SectionHeader (with "View All")
│   └── ProductCard (×6)
├── SocialProofSection
│   └── StatsRow + optional quotes
├── AdSlot (placeholder for Google Ads)
├── CTASection
└── Footer
```

### Components to Modify

| Component | Change |
|-----------|--------|
| `Nav.tsx` | Light theme, simpler links, new button style |
| `Logo.tsx` | Remove gradient, dark text, no "Technology" sub-label |
| `HeroSection.tsx` | Full rewrite — 2-col layout, no blobs/gradients, add mosaic |
| `ServicesSection.tsx` | Remove or repurpose into CategorySection |
| `ServiceCard.tsx` | Repurpose into CategoryCard |
| `ProductsSection.tsx` | Light theme, 3-col grid |
| `ProductCard.tsx` | Light theme, thumbnail placeholder, new hover |
| `CTASection.tsx` | Light theme, no gradient |
| `SectionHeader.tsx` | Light theme, accent blue labels |
| `StatsRow.tsx` | Light theme |
| `Footer.tsx` | Simplify, light theme |
| `AnimatedSection.tsx` | Keep, may simplify animation params |
| `globals.css` | Replace dark theme tokens with light, remove blob keyframes |
| `site.ts` | Expand product data to 6 items, add category data |
| `layout.tsx` | Swap Geist for Inter, remove `dark` class from html |

### Components to Create

| Component | Purpose |
|-----------|---------|
| `ProductMosaic.tsx` | Hero right-side thumbnail grid |
| `CategoryCard.tsx` | Category browsing card (can repurpose ServiceCard) |
| `AdSlot.tsx` | Reserved Google Ads banner placeholder, hidden when no ad active |

### Components to Remove

| Component | Reason |
|-----------|--------|
| `ServicesSection.tsx` | Replaced by CategorySection |
| `ServiceCard.tsx` | Replaced by CategoryCard |

## Data Model Changes

```ts
// site.ts — updated structure

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  href: string;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  thumbnail?: string; // optional for now
}

// Stats unchanged
// Nav links updated: Products, Categories, Contact

// Categories (new)
const categories: CategoryItem[] = [
  { id: "stock-photos", title: "Stock Photos", description: "...", emoji: "📷", href: "/categories/stock-photos" },
  { id: "templates", title: "Templates", description: "...", emoji: "📐", href: "/categories/templates" },
  { id: "icons-fonts", title: "Icons & Fonts", description: "...", emoji: "🔤", href: "/categories/icons-fonts" },
  { id: "3d-more", title: "3D & More", description: "...", emoji: "🎨", href: "/categories/3d-more" },
];

// Products expanded to 6
const products: ProductItem[] = [
  { id: "1", name: "Ultimate UI Kit", category: "Templates", price: "$49" },
  { id: "2", name: "Icon Pack Pro", category: "Icons", price: "$29" },
  { id: "3", name: "Design System Pro", category: "Templates", price: "$99" },
  { id: "4", name: "Photo Presets Bundle", category: "Stock Photos", price: "$39" },
  { id: "5", name: "Modern Font Pack", category: "Fonts", price: "$24" },
  { id: "6", name: "3D Icon Collection", category: "3D", price: "$59" },
];
```

## Animation Strategy (Simplified)

- Remove blob keyframe animations entirely
- Keep section fade-in + slide-up via `AnimatedSection` (Framer Motion `whileInView`)
- Product cards: subtle `translateY(-4px)` on hover + border color transition
- Category cards: border color transition on hover
- Reduce `staggerChildren` delays — Swiss style is snappy, not cinematic

## Error & Edge Cases

- All content is static SSR — no loading states needed
- Empty grids: gracefully collapse if products/categories arrays are empty
- Missing thumbnails: placeholder gray box with category icon
- Responsive: stacked mobile, 2-col tablet, 3-col desktop
- No-JS: all content renders, animations degrade to static

## Out of Scope

- Product detail pages
- Category listing pages (link hrefs point to `#` for now)
- Blog / resources
- Authentication / user accounts
- CMS integration
- Payments / checkout
- Multi-language
- Search / filtering

## Visual References

- Linear homepage — Swiss layout, single accent, generous whitespace
- Vercel homepage — product-first, minimal chrome, editorial grid
- Figma community — product cards on light backgrounds
- Creative Market — category-driven browsing, clean product grids
