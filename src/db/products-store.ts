import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const STORE_PATH = path.join(DATA_DIR, "products-store.json");

export interface ProductRecord {
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
  downloadFile?: { url: string; name: string; size: number };
  creatorId?: string;
  creatorName?: string;
}

export function getAllProducts(): ProductRecord[] {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify([], null, 2));
      return [];
    }
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as ProductRecord[];
  } catch {
    return [];
  }
}

export function saveAllProducts(products: ProductRecord[]) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(products, null, 2));
}

export function getProductById(id: string): ProductRecord | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function createProduct(product: Omit<ProductRecord, "id">): ProductRecord {
  const products = getAllProducts();
  const newProduct: ProductRecord = {
    ...product,
    id: String(Date.now()).slice(-8),
  };
  products.push(newProduct);
  saveAllProducts(products);
  return newProduct;
}

export function updateProduct(id: string, data: Omit<ProductRecord, "id">): ProductRecord | null {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...data, id };
  saveAllProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getAllProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveAllProducts(filtered);
  return true;
}

// Convert to the format site.ts needs
export function toSiteProduct(p: ProductRecord) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: `$${p.price}`,
    ...(p.originalPrice ? { originalPrice: `$${p.originalPrice}` } : {}),
    creator: p.creator,
  };
}
