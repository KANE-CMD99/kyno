import { supabaseAdmin, hasSupabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const STORE_PATH = path.join(DATA_DIR, "products-store.json");

function getJSON() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STORE_PATH, "[]");
      return [];
    }
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch { return []; }
}

function saveJSON(data: unknown) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

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

function mapRow(r: Record<string, unknown>): ProductRecord {
  return {
    id: r.id as string,
    name: r.name as string,
    category: r.category as string,
    price: r.price as number,
    originalPrice: r.original_price as number | undefined,
    creator: (r.creator as string) || "Kyno",
    description: (r.description as string) || "",
    features: (r.features as string[]) || [],
    includes: (r.includes as string[]) || [],
    previewImages: (r.preview_images as string[]) || [],
    downloadFile: r.download_file as ProductRecord["downloadFile"],
    creatorId: r.creator_id as string | undefined,
    creatorName: undefined,
  };
}

export async function getAllProducts(): Promise<ProductRecord[]> {
  if (hasSupabase) {
    const { data, error } = await supabaseAdmin().from("products").select("*").order("category").order("name");
    if (error) { console.error("Supabase getAllProducts:", error); return []; }
    return (data || []).map(mapRow);
  }
  return getJSON();
}

export async function saveAllProducts(products: ProductRecord[]): Promise<void> {
  if (hasSupabase) {
    for (const p of products) {
      await supabaseAdmin().from("products").upsert({
        id: p.id, name: p.name, category: p.category, price: p.price,
        original_price: p.originalPrice || null, creator: p.creator,
        description: p.description, features: p.features, includes: p.includes,
        preview_images: p.previewImages, download_file: p.downloadFile || null,
        creator_id: p.creatorId || null, updated_at: new Date().toISOString(),
      });
    }
    return;
  }
  saveJSON(products);
}

export async function getProductById(id: string): Promise<ProductRecord | undefined> {
  if (hasSupabase) {
    const { data } = await supabaseAdmin().from("products").select("*").eq("id", id).single();
    return data ? mapRow(data) : undefined;
  }
  return getJSON().find((p: ProductRecord) => p.id === id);
}

export async function createProduct(product: Omit<ProductRecord, "id">): Promise<ProductRecord> {
  const now = new Date().toISOString();
  const newProduct: ProductRecord = { ...product, id: String(Date.now()).slice(-8) };

  if (hasSupabase) {
    await supabaseAdmin().from("products").insert({
      id: newProduct.id, name: newProduct.name, category: newProduct.category,
      price: newProduct.price, original_price: newProduct.originalPrice || null,
      creator: newProduct.creator, description: newProduct.description,
      features: newProduct.features, includes: newProduct.includes,
      preview_images: newProduct.previewImages, download_file: newProduct.downloadFile || null,
      creator_id: newProduct.creatorId || null, created_at: now, updated_at: now,
    });
    return newProduct;
  }

  const all = getJSON();
  all.push(newProduct);
  saveJSON(all);
  return newProduct;
}

export async function updateProduct(id: string, data: Omit<ProductRecord, "id">): Promise<ProductRecord | null> {
  const now = new Date().toISOString();

  if (hasSupabase) {
    const { error } = await supabaseAdmin().from("products").update({
      name: data.name, category: data.category, price: data.price,
      original_price: data.originalPrice || null, creator: data.creator,
      description: data.description, features: data.features, includes: data.includes,
      preview_images: data.previewImages, download_file: data.downloadFile || null,
      creator_id: data.creatorId || null, updated_at: now,
    }).eq("id", id);
    if (error) { console.error("Supabase updateProduct:", error); return null; }
    return { ...data, id };
  }

  const all = getJSON();
  const index = all.findIndex((p: ProductRecord) => p.id === id);
  if (index === -1) return null;
  all[index] = { ...data, id };
  saveJSON(all);
  return all[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (hasSupabase) {
    const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
    return !error;
  }
  const all = getJSON();
  const filtered = all.filter((p: ProductRecord) => p.id !== id);
  if (filtered.length === all.length) return false;
  saveJSON(filtered);
  return true;
}

// Helper for site format compatibility
export function toSiteProduct(p: ProductRecord) {
  return {
    id: p.id, name: p.name, category: p.category,
    price: `$${p.price}`,
    ...(p.originalPrice ? { originalPrice: `$${p.originalPrice}` } : {}),
    creator: p.creator,
  };
}
