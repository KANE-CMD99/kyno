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
    emoji: String.fromCodePoint(0x1F3A8),
  },
  {
    title: "Online Courses",
    description:
      "In-depth video courses on design, development, and digital business strategies.",
    emoji: String.fromCodePoint(0x1F4DA),
  },
  {
    title: "Creative Assets",
    description:
      "High-quality icons, illustrations, fonts, and 3D assets for your projects.",
    emoji: String.fromCodePoint(0x2728),
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
