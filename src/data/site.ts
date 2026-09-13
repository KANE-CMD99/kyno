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
  originalPrice?: string;
  creator: string;
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
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * Display names for the internal category values stored on products.
 * The values themselves ("Photos", "Fonts", "Templates") are what the data,
 * filters, admin dropdowns and URLs use — only the labels shown to visitors
 * are overridden here, so nothing has to be migrated.
 */
export const CATEGORY_DISPLAY: Record<string, { full: string; short: string }> = {
  Photos: { full: "Travel Guides & Photos", short: "Travel & Photos" },
  Fonts: { full: "Font Collection", short: "Font Collection" },
  Templates: { full: "Template Collection", short: "Template Collection" },
};

/** Full display name — for page headings, footer links and meta titles. */
export function categoryFull(value: string): string {
  return CATEGORY_DISPLAY[value]?.full ?? value;
}

/** Short display name — for the tight category pill row in the nav. */
export function categoryShort(value: string): string {
  return CATEGORY_DISPLAY[value]?.short ?? value;
}

export const categoryPills: NavLink[] = [
  { label: categoryShort("Photos"), href: "/categories/photos" },
  { label: categoryShort("Fonts"), href: "/categories/fonts" },
  { label: categoryShort("Templates"), href: "/categories/templates" },
  { label: "Free", href: "/categories/free" },
];

export const categories: CategoryItem[] = [
  {
    id: "photos",
    title: categoryFull("Photos"),
    description: "Travel guides and high-resolution photo collections for your projects.",
    emoji: String.fromCodePoint(0x1F4F7),
    href: "#",
  },
  {
    id: "fonts",
    title: categoryFull("Fonts"),
    description: "Curated typefaces and font families for distinctive design.",
    emoji: String.fromCodePoint(0x1F524),
    href: "#",
  },
  {
    id: "templates",
    title: categoryFull("Templates"),
    description: "Premium website, UI & design templates to accelerate your workflow.",
    emoji: String.fromCodePoint(0x1F4D0),
    href: "#",
  },
  {
    id: "free",
    title: "Free Downloads",
    description: "Free digital products — fonts, photos, templates, and more at no cost.",
    emoji: "🎁",
    href: "#",
  },
];

export const services: ServiceItem[] = [
  {
    title: "Stock Photos",
    description: "Curated photo presets and high-resolution image packs.",
    emoji: String.fromCodePoint(0x1F4F7),
  },
  {
    title: "Fonts",
    description: "Premium typefaces and font families for modern design projects.",
    emoji: String.fromCodePoint(0x1F524),
  },
  {
    title: "Templates",
    description: "Professional design templates for websites, UI, and presentations.",
    emoji: String.fromCodePoint(0x1F4D0),
  },
  {
    title: "Free Downloads",
    description: "No-cost digital assets shared by our creator community.",
    emoji: "🎁",
  },
];

export const products: ProductItem[] = [
  // Photos
  { id: "1", name: "Photo Presets Bundle", category: "Photos", price: "$1", creator: "Kyno" },
  { id: "2", name: "Aerial Landscapes Pack", category: "Photos", price: "$1", creator: "Kyno" },
  { id: "3", name: "Minimal Backgrounds", category: "Photos", price: "$1", creator: "Kyno" },
  // Fonts
  { id: "4", name: "Modern Sans Serif", category: "Fonts", price: "$1", creator: "Kyno" },
  { id: "5", name: "Handwritten Script", category: "Fonts", price: "$1", creator: "Kyno" },
  { id: "6", name: "Display Typeface", category: "Fonts", price: "$1", creator: "Kyno" },
  // Templates
  { id: "7", name: "Ultimate UI Kit", category: "Templates", price: "$1", creator: "Kyno" },
  { id: "8", name: "Design System Pro", category: "Templates", price: "$1", creator: "Kyno" },
  { id: "9", name: "Portfolio Template", category: "Templates", price: "$1", creator: "Kyno" },
  { id: "10", name: "Landing Page Kit", category: "Templates", price: "$1", creator: "Kyno" },
];

export const productSections = [
  { title: "Popular Photos", category: "Photos", href: "#" },
  { title: "Popular Fonts", category: "Fonts", href: "#" },
  { title: "Popular Templates", category: "Templates", href: "#" },
  { title: "Free Downloads", category: "Free", href: "#" },
];

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: categoryFull("Photos"), href: "/categories/photos" },
      { label: categoryFull("Fonts"), href: "/categories/fonts" },
      { label: categoryFull("Templates"), href: "/categories/templates" },
      { label: "Free Downloads", href: "/free-downloads" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Free Downloads", href: "/free-downloads" },
      { label: "My Orders", href: "/orders" },
      { label: "License", href: "/license" },
      { label: "Help Center", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "License", href: "/license" },
    ],
  },
];

export const stats: StatItem[] = [
  { value: "100%", label: "Digital Delivery" },
  { value: "Instant", label: "Secure Checkout" },
  { value: "Lifetime", label: "Access" },
];

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

export const testimonials: TestimonialItem[] = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    quote: "Kyno's UI kit saved me weeks of design work. The components are thoughtfully built and easy to customize. My go-to resource for every new project.",
  },
  {
    name: "Marcus Rivera",
    role: "Frontend Developer",
    quote: "The font collection is incredible. Clean licensing, beautiful typefaces, and the web font kit just works out of the box. Highly recommended.",
  },
  {
    name: "Emily Park",
    role: "Content Creator",
    quote: "I use their photo presets on every shoot. Consistent, professional look in one click. My clients keep asking how I edit my photos.",
  },
  {
    name: "James Wilson",
    role: "Creative Director",
    quote: "Kyno templates are the best investment we made this year. From landing pages to design systems, everything is polished and production-ready.",
  },
];
