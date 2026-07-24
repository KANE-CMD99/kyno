import { NextResponse } from "next/server";
import { getCreatorSession } from "@/lib/creator-auth";
import { getAllProducts, createProduct, updateProduct, deleteProduct, type ProductRecord } from "@/db/products-store";

export async function GET() {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = getAllProducts().filter((p) => p.creatorId === session.id);
  return NextResponse.json({ products });
}

export async function DELETE(req: Request) {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const product = getAllProducts().find((p) => p.id === id && p.creatorId === session.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  deleteProduct(id);
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, name, category, price, originalPrice, description, features, includes, previewImages, downloadFile } = await req.json();
  if (!name || !category || !price) return NextResponse.json({ error: "Fields required" }, { status: 400 });

  const data: Omit<ProductRecord, "id"> = {
    name, category, price: parseFloat(price) || 0, ...(originalPrice ? { originalPrice: parseFloat(originalPrice) } : {}),
    creator: session.name, creatorId: session.id, creatorName: session.name,
    description: description || "", features: features || [], includes: includes || [],
    previewImages: previewImages || [], ...(downloadFile ? { downloadFile } : {}),
  };

  const product = id ? updateProduct(id, data) || createProduct(data) : createProduct(data);
  return NextResponse.json({ success: true, product });
}
