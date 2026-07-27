import p1 from "./products/1.json";
import p2 from "./products/2.json";
import p3 from "./products/3.json";
import p4 from "./products/4.json";
import p5 from "./products/5.json";
import p6 from "./products/6.json";
import p7 from "./products/7.json";
import p8 from "./products/8.json";
import p9 from "./products/9.json";
import p10 from "./products/10.json";

export interface ProductDetail {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  creator: string;
  description: string;
  features: string[];
  includes: string[];
  previewImages: string[];
}

const STATIC: Record<string, ProductDetail> = {
  "1": p1 as ProductDetail, "2": p2 as ProductDetail, "3": p3 as ProductDetail,
  "4": p4 as ProductDetail, "5": p5 as ProductDetail, "6": p6 as ProductDetail,
  "7": p7 as ProductDetail, "8": p8 as ProductDetail, "9": p9 as ProductDetail,
  "10": p10 as ProductDetail,
};

// Try static JSON first, then fall back to products-store at runtime
export async function getProductDetail(id: string): Promise<ProductDetail | undefined> {
  if (STATIC[id]) return STATIC[id];

  try {
    const { getAllProducts } = require("@/db/products-store");
    const products = await getAllProducts();
    const p = products.find((x: { id: string }) => x.id === id);
    if (!p) return undefined;
    return {
      id: p.id, name: p.name, category: p.category,
      price: p.price, originalPrice: p.originalPrice || undefined,
      creator: p.creator, description: p.description || "",
      features: p.features || [], includes: p.includes || [],
      previewImages: p.previewImages || [],
    };
  } catch {
    return undefined;
  }
}

export const relatedIds: Record<string, string[]> = {
  "1": ["2", "3"], "2": ["1", "3"], "3": ["1", "2"],
  "4": ["5", "6"], "5": ["4", "6"], "6": ["4", "5"],
  "7": ["8", "9", "10"], "8": ["7", "9", "10"],
  "9": ["7", "8", "10"], "10": ["7", "8", "9"],
};
