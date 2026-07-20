# Kyno Technology — Homepage Design Spec

**Date**: 2026-07-20
**Status**: Approved
**Project**: Kyno Technology Limited company homepage

## Overview

Single-page marketing homepage for Kyno Technology Limited, a company that creates and sells digital products (templates, courses, creative assets) to the global creator economy, primarily EU/US markets. The site serves as the brand's storefront — introducing services, showcasing products, and driving conversion to contact/sales.

**Goals:**
- Establish brand presence with strong visual identity
- Communicate what Kyno does in under 5 seconds
- Build trust via social-proof metrics
- Drive visitors to explore products or get in touch

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Deployment | Vercel |
| Font | Geist (via `next/font`) |

## Visual Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a0f` | Main page background |
| Surface | `#0d0d14` | Card, section alt background |
| Deep Surface | `#06060a` | Footer |
| Primary Purple | `#a855f7` | Accent, badges, gradients |
| Primary Cyan | `#06b6d4` | Accent, links, gradients |
| Gradient | `#a855f7 → #06b6d4` | Logo "K", hero keyword, buttons, dividers |
| Text Primary | `#ffffff` | Headlines |
| Text Secondary | `#9090a0` | Body text |
| Text Muted | `#666666` | Labels, captions |

### Typography

- **Headlines**: Geist — 800 or 900 weight, tight letter-spacing
- **Body**: Geist — regular, ~16-18px
- **Mono accents**: Geist Mono for badge labels

### Logo

Bold typographic mark: gradient "K" + "YNO" in white, with "TECHNOLOGY" sub-label.

## Page Structure

Single-page scroll, 4 sections + nav + footer:

```
┌─────────────────────┐
│       Nav           │  Fixed top, logo + links + CTA button
├─────────────────────┤
│       Hero          │  Gradient blobs + headline + stats
├─────────────────────┤
│     Services        │  3-column grid (templates, courses, assets)
├─────────────────────┤
│     Products        │  4-column grid of featured items
├─────────────────────┤
│       CTA           │  Full-width gradient banner + contact button
├─────────────────────┤
│      Footer         │  Copyright + social links
└─────────────────────┘
```

### Section Details

**1. Navigation**
- Sticky top bar, dark semi-transparent background
- Left: Logo (gradient "K" + KYNO)
- Right: Services / Products / Contact links + "Get Started" gradient button

**2. Hero**
- Dark gradient background with large radial glow blobs (purple top-right, cyan bottom-left)
- Subtle geometric accent shapes (rotated squares at low opacity)
- Headline: "Digital" in purple→cyan gradient, rest in white — "Digital Products for Creators"
- Subtitle: "Premium templates, courses & assets crafted for the global creator economy."
- Two buttons: "Explore Products" (filled gradient) + "View Showcase →" (outlined)
- Stats row: 50+ Products | 10k+ Customers | 4.9 Rating (divided by subtle vertical lines)

**3. Services**
- Label: "WHAT WE DO" (uppercase, purple)
- Heading: "Digital Products, Crafted with Precision"
- Subtitle describing quality standards
- 3-card grid with emoji + title: Design Templates, Online Courses, Creative Assets
- Cards have subtle border, rounded corners, hover effect

**4. Products**
- Label: "PRODUCTS" (uppercase, purple) + "View All →" link
- Heading: "Featured Products"
- 4-column grid of product card placeholders
- Future: each card has thumbnail, name, price, rating

**5. CTA / Contact**
- Gradient background section (same as hero's purple→dark gradient)
- Heading: "Ready to Elevate Your Work?"
- Subtitle: "Join thousands of creators using Kyno products worldwide."
- "Get in Touch" gradient button

**6. Footer**
- Darkest background, subtle top border
- Left: copyright text
- Right: Twitter / LinkedIn / Email links

## Component Tree

```
Layout
├── Nav
│   ├── Logo
│   └── NavLinks
├── HeroSection
│   ├── GradientBackground
│   ├── HeroHeadline
│   ├── HeroCTA (buttons)
│   └── StatsRow
├── ServicesSection
│   ├── SectionHeader
│   └── ServiceCard (x3)
├── ProductsSection
│   ├── SectionHeader (with "View All")
│   └── ProductCard (x4)
├── CTASection
└── Footer
```

## Data Flow

- Static marketing page — no API calls at launch
- Product data in a local array/constant (replace with headless CMS later if needed)
- Contact CTA scrolls to contact section (future: open modal or link to mailto/contact page)

## Animation Strategy

- Hero: light blobs animate subtly (CSS keyframes, translate/scale oscillation)
- Sections: fade-in + slide-up on scroll into view (Framer Motion `whileInView`)
- Cards: scale + shadow on hover
- Stats: count-up animation on first view (future enhancement)

## Error & Edge Cases

- **Loading**: All content is static SSR — no loading states needed for v1
- **Empty products**: Grid gracefully collapses if no products configured
- **Responsive**: Mobile single-column, tablet 2-col, desktop 3-col (services) / 4-col (products)
- **No JS**: Page renders fully without JS; animations degrade gracefully

## Testing

- Visual regression: screenshot comparison for each section at 3 breakpoints
- Responsive: verify layout on mobile (375px), tablet (768px), desktop (1280px)
- Performance: Lighthouse score ≥ 90
- Accessibility: semantic HTML, sufficient color contrast, keyboard-navigable

## Out of Scope

- Product detail pages (separate project)
- Blog / resources section
- Authentication / user accounts
- CMS integration
- Multi-language support
