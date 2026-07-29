import { NextResponse } from "next/server";
import { getAllProducts } from "@/db/products-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getAllProducts();
  // Sort: category groups (Photos→Fonts→Templates), then alphabetically by name
  const categoryOrder = ["Photos", "Fonts", "Templates", "Free"];
  const sorted = [...products].sort((a, b) => {
    const ca = categoryOrder.indexOf(a.category);
    const cb = categoryOrder.indexOf(b.category);
    if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb);
    return a.name.localeCompare(b.name);
  });
  return NextResponse.json({
    products: sorted.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: `$${p.price}`,
      originalPrice: p.originalPrice ? `$${p.originalPrice}` : undefined,
      creator: p.creator,
      thumbnail: p.previewImages?.[0],
    })),
  });
}
