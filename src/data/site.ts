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
  { label: "Contact", href: "/contact" },
];

export const categoryPills: NavLink[] = [
  { label: "Photos", href: "/categories/photos" },
  { label: "Fonts", href: "/categories/fonts" },
  { label: "Templates", href: "/categories/templates" },
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
    id: "fonts",
    title: "Fonts",
    description: "Curated typefaces and font families for distinctive design.",
    emoji: String.fromCodePoint(0x1F524),
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
    title: "Fonts",
    description: "Premium typefaces and font families for modern design projects.",
    emoji: String.fromCodePoint(0x1F524),
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
  // Fonts
  { id: "4", name: "Modern Sans Serif", category: "Fonts", price: "$24", creator: "Kyno" },
  { id: "5", name: "Handwritten Script", category: "Fonts", price: "$18", creator: "Kyno" },
  { id: "6", name: "Display Typeface", category: "Fonts", price: "$32", originalPrice: "$45", creator: "Kyno" },
  // Templates
  { id: "7", name: "Ultimate UI Kit", category: "Templates", price: "$49", originalPrice: "$79", creator: "Kyno" },
  { id: "8", name: "Design System Pro", category: "Templates", price: "$99", creator: "Kyno" },
  { id: "9", name: "Portfolio Template", category: "Templates", price: "$34", originalPrice: "$49", creator: "Kyno" },
  { id: "10", name: "Landing Page Kit", category: "Templates", price: "$44", originalPrice: "$59", creator: "Kyno" },
];

export const productSections = [
  { title: "Popular Photos", category: "Photos", href: "#" },
  { title: "Popular Fonts", category: "Fonts", href: "#" },
  { title: "Popular Templates", category: "Templates", href: "#" },
];

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Photos", href: "/categories/photos" },
      { label: "Fonts", href: "/categories/fonts" },
      { label: "Templates", href: "/categories/templates" },
      { label: "Free Downloads", href: "/free-downloads" },
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
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Twitter", href: "#" },
      { label: "Dribbble", href: "#" },
    ],
  },
];

export const stats: StatItem[] = [
  { value: "10", label: "Digital Products" },
  { value: "1k+", label: "Happy Customers" },
  { value: "4.8", label: "Average Rating" },
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
