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
  { label: "Products", href: "#products" },
  { label: "Free Downloads", href: "#" },
  { label: "Contact", href: "#contact" },
];

export const categoryPills: NavLink[] = [
  { label: "Photos", href: "#photos" },
  { label: "Templates", href: "#templates" },
];

export const categories: CategoryItem[] = [
  {
    id: "photos",
    title: "Stock Photos",
    description: "High-resolution photo presets and image collections for your projects.",
    emoji: String.fromCodePoint(0x1F4F7),
    href: "#",
  },
  {
    id: "templates",
    title: "Templates",
    description: "Premium website, UI & design templates to accelerate your workflow.",
    emoji: String.fromCodePoint(0x1F4D0),
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
    title: "Templates",
    description: "Professional design templates for websites, UI, and presentations.",
    emoji: String.fromCodePoint(0x1F4D0),
  },
];

export const products: ProductItem[] = [
  // Photos
  { id: "1", name: "Photo Presets Bundle", category: "Photos", price: "$39", originalPrice: "$59", creator: "Kyno" },
  { id: "2", name: "Aerial Landscapes Pack", category: "Photos", price: "$27", originalPrice: "$39", creator: "Kyno" },
  { id: "3", name: "Minimal Backgrounds", category: "Photos", price: "$22", creator: "Kyno" },
  // Templates
  { id: "4", name: "Ultimate UI Kit", category: "Templates", price: "$49", originalPrice: "$79", creator: "Kyno" },
  { id: "5", name: "Design System Pro", category: "Templates", price: "$99", creator: "Kyno" },
  { id: "6", name: "Portfolio Template", category: "Templates", price: "$34", originalPrice: "$49", creator: "Kyno" },
];

export const productSections = [
  { title: "Popular Photos", category: "Photos", href: "#" },
  { title: "Popular Templates", category: "Templates", href: "#" },
];

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Photos", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Free Downloads", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "License", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#contact" },
      { label: "Twitter", href: "#" },
      { label: "Dribbble", href: "#" },
    ],
  },
];

export const stats: StatItem[] = [
  { value: "6", label: "Digital Products" },
  { value: "1k+", label: "Happy Customers" },
  { value: "4.8", label: "Average Rating" },
];
