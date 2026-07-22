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

const details: Record<string, ProductDetail> = {
  "1": p1 as ProductDetail,
  "2": p2 as ProductDetail,
  "3": p3 as ProductDetail,
  "4": p4 as ProductDetail,
  "5": p5 as ProductDetail,
  "6": p6 as ProductDetail,
  "7": p7 as ProductDetail,
  "8": p8 as ProductDetail,
  "9": p9 as ProductDetail,
  "10": p10 as ProductDetail,
};

export function getProductDetail(id: string): ProductDetail | undefined {
  return details[id];
}

export const relatedIds: Record<string, string[]> = {
  "1": ["2", "3"],
  "2": ["1", "3"],
  "3": ["1", "2"],
  "4": ["5", "6"],
  "5": ["4", "6"],
  "6": ["4", "5"],
  "7": ["8", "9", "10"],
  "8": ["7", "9", "10"],
  "9": ["7", "8", "10"],
  "10": ["7", "8", "9"],
};
