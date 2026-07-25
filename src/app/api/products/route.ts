import { NextResponse } from "next/server";
import { getAllProducts } from "@/db/products-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json({
    products: products.map((p) => ({
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
