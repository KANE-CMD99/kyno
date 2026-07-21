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
  { label: "Fonts", href: "#fonts" },
  { label: "Templates", href: "#templates" },
  { label: "Graphics", href: "#graphics" },
  { label: "Photos", href: "#photos" },
  { label: "Icons", href: "#icons" },
  { label: "3D", href: "#3d" },
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
    description: "Professional UI kits, website templates, and design systems.",
    emoji: String.fromCodePoint(0x1F3A8),
  },
  {
    title: "Creative Assets",
    description: "High-quality icons, illustrations, fonts, and 3D assets.",
    emoji: String.fromCodePoint(0x2728),
  },
];

export const products: ProductItem[] = [
  // Templates
  { id: "1", name: "Ultimate UI Kit", category: "Templates", price: "$49", originalPrice: "$79", creator: "Kyno" },
  { id: "2", name: "Design System Pro", category: "Templates", price: "$99", creator: "Kyno" },
  { id: "3", name: "Portfolio Template", category: "Templates", price: "$34", originalPrice: "$49", creator: "Kyno" },
  // Fonts
  { id: "4", name: "Modern Sans Serif", category: "Fonts", price: "$24", creator: "Kyno" },
  { id: "5", name: "Handwritten Script", category: "Fonts", price: "$18", creator: "Kyno" },
  // Graphics
  { id: "6", name: "Icon Pack Pro", category: "Graphics", price: "$29", originalPrice: "$45", creator: "Kyno" },
  { id: "7", name: "Illustration Bundle", category: "Graphics", price: "$39", creator: "Kyno" },
  // Photos
  { id: "8", name: "Photo Presets Bundle", category: "Photos", price: "$39", creator: "Kyno" },
  { id: "9", name: "Aerial Landscapes Pack", category: "Photos", price: "$27", originalPrice: "$39", creator: "Kyno" },
  { id: "10", name: "Minimal Backgrounds", category: "Photos", price: "$22", creator: "Kyno" },
  // Icons
  { id: "11", name: "Essential Icons Set", category: "Icons", price: "$15", creator: "Kyno" },
  // 3D
  { id: "12", name: "3D Icon Collection", category: "3D", price: "$59", originalPrice: "$89", creator: "Kyno" },
];

export const productSections = [
  { title: "Popular Templates", category: "Templates", href: "#" },
  { title: "Popular Fonts", category: "Fonts", href: "#" },
  { title: "Popular Graphics", category: "Graphics", href: "#" },
  { title: "Popular Photos", category: "Photos", href: "#" },
];

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Fonts", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Graphics", href: "#" },
      { label: "Photos", href: "#" },
      { label: "Icons", href: "#" },
      { label: "3D Assets", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free Downloads", href: "#" },
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
  { value: "50+", label: "Digital Products" },
  { value: "10k+", label: "Happy Customers" },
  { value: "4.9", label: "Average Rating" },
];
