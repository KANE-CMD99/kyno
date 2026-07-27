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

export async function getProductDetail(id: string): Promise<ProductDetail | undefined> {
  try {
    const { getAllProducts } = await import("@/db/products-store");
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

export async function getRelatedProducts(id: string, limit = 4) {
  try {
    const { getAllProducts } = await import("@/db/products-store");
    const all = await getAllProducts();
    const current = all.find((x) => x.id === id);
    if (!current) return [];
    return all
      .filter((x: { id: string; category: string }) => x.id !== id && x.category === current.category)
      .slice(0, limit);
  } catch {
    return [];
  }
}
