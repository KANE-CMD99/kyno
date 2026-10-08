export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  href: string;
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
 * The values themselves ("Photos", "Templates") are what the data,
 * filters, admin dropdowns and URLs use — only the labels shown to visitors
 * are overridden here, so nothing has to be migrated.
 */
export const CATEGORY_DISPLAY: Record<string, { full: string; short: string }> = {
  Photos: { full: "Photos & Frame Mats", short: "Photos & Mats" },
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

// Every category here must have products behind it — a link to an empty
// category is a dead end for visitors and thin content for search engines.
export const categoryPills: NavLink[] = [
  { label: categoryShort("Photos"), href: "/categories/photos" },
  { label: categoryShort("Templates"), href: "/categories/templates" },
  { label: "Free", href: "/categories/free" },
];

export const categories: CategoryItem[] = [
  {
    id: "photos",
    title: categoryFull("Photos"),
    description: "Printable frame mats and photo inserts, sized for standard US frames.",
    emoji: String.fromCodePoint(0x1F4F7),
    href: "#",
  },
  {
    id: "templates",
    title: categoryFull("Templates"),
    description: "ATS-friendly resume and CV templates, plus editable restaurant and café menu templates.",
    emoji: String.fromCodePoint(0x1F4D0),
    href: "#",
  },
  {
    id: "free",
    title: "Free Downloads",
    description: "Free resume templates and printable samples — download at no cost.",
    emoji: "🎁",
    href: "#",
  },
];

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: categoryFull("Photos"), href: "/categories/photos" },
      { label: categoryFull("Templates"), href: "/categories/templates" },
      { label: "Free Downloads", href: "/free-downloads" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Free Downloads", href: "/free-downloads" },
      // Our other property. Until this link existed the relationship ran one
      // way only — kyno.top linked here from all 227 of its pages and nothing
      // linked back, so it earned no authority from this site and its own
      // pages struggled to be indexed, which stalled the whole funnel. The UTM
      // tags exist so the click-through can actually be measured.
      { label: "Font Pairing Tool", href: "https://www.kyno.top/?utm_source=kynocreative&utm_medium=footer" },
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
