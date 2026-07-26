import { NextResponse } from "next/server";
import { getCreatorSession } from "@/lib/creator-auth";
import { getAllProducts, createProduct, updateProduct, deleteProduct, type ProductRecord } from "@/db/products-store";
import { getCreators } from "@/db/creators";

export async function GET() {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = (await getAllProducts()).filter((p: ProductRecord) => p.creatorId === session.id);
  return NextResponse.json({ products });
}

export async function DELETE(req: Request) {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const creators = await getCreators();
  const creator = creators.find((c) => c.id === session.id);
  if (!creator || creator.status === "suspended") return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  if (!creator.permissions.canDelete) return NextResponse.json({ error: "Delete not allowed" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const allProducts = await getAllProducts();
  const product = allProducts.find((p: ProductRecord) => p.id === id && p.creatorId === session.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const creators = await getCreators();
  const creator = creators.find((c) => c.id === session.id);
  if (!creator || creator.status === "suspended") return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  if (!creator.permissions.canUpload) return NextResponse.json({ error: "Upload not allowed" }, { status: 403 });

  const { id, name, category, price, originalPrice, description, features, includes, previewImages, downloadFile } = await req.json();
  if (!name || !category || !price) return NextResponse.json({ error: "Fields required" }, { status: 400 });

  // If editing, check ownership + edit permission
  if (id) {
    const allP = await getAllProducts();
    const existing = allP.find((p: ProductRecord) => p.id === id);
    if (!existing || existing.creatorId !== session.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!creator.permissions.canEdit) return NextResponse.json({ error: "Edit not allowed" }, { status: 403 });
  }

  const data: Omit<ProductRecord, "id"> = {
    name, category, price: parseFloat(price) || 0, ...(originalPrice ? { originalPrice: parseFloat(originalPrice) } : {}),
    creator: session.name, creatorId: session.id, creatorName: session.name,
    description: description || "", features: features || [], includes: includes || [],
    previewImages: previewImages || [], ...(downloadFile ? { downloadFile } : {}),
  };

  const product = id ? (await updateProduct(id, data)) || (await createProduct(data)) : await createProduct(data);
  return NextResponse.json({ success: true, product });
}
