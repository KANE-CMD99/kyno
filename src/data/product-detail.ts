import { getAllProducts } from "@/db/products-store";
import { getCreators } from "@/db/creators";

export interface ProductDetail {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  creator: string;
  creatorEnglishName?: string;
  description: string;
  features: string[];
  includes: string[];
  previewImages: string[];
}

export async function getProductDetail(id: string): Promise<ProductDetail | undefined> {
  const products = await getAllProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return undefined;

  // Look up creator's English name
  let creatorEnglishName = "";
  if (p.creatorId) {
    const creators = await getCreators();
    const creator = creators.find((c) => c.id === p.creatorId);
    creatorEnglishName = creator?.englishName || "";
  }

  return {
    id: p.id, name: p.name, category: p.category,
    price: p.price, originalPrice: p.originalPrice || undefined,
    creator: p.creator, creatorEnglishName,
    description: p.description || "",
    features: p.features || [], includes: p.includes || [],
    previewImages: p.previewImages || [],
  };
}

export async function getRelatedProducts(id: string, limit = 4) {
  const all = await getAllProducts();
  const current = all.find((x) => x.id === id);
  if (!current) return [];
  return all
    .filter((x) => x.id !== id && x.category === current.category)
    .slice(0, limit);
}
