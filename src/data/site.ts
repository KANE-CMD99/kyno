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
