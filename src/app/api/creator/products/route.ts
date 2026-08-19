import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllProducts, createProduct, updateProduct, deleteProduct, type ProductRecord } from "@/db/products-store";

function getCreatorId(): string | null {
  // Use sync cookie access for serverless compatibility
  return null; // will be overridden by async version below
}

async function getSessionFromCookie() {
  const cs = await cookies();
  const raw = cs.get("kyno_creator_session")?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as { id: string; name: string; email: string }; }
  catch { return null; }
}

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = (await getAllProducts()).filter((p: ProductRecord) => p.creatorId === session.id);
  return NextResponse.json({ products });
}

export async function DELETE(req: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const allP = await getAllProducts();
  const product = allP.find((p: ProductRecord) => p.id === id && p.creatorId === session.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, category, price, originalPrice, description, features, includes, previewImages, downloadFile } = await req.json();
  if (!name || !category || !price) return NextResponse.json({ error: "Name, category, and price required" }, { status: 400 });

  // If editing existing product
  if (id) {
    const allP = await getAllProducts();
    const existing = allP.find((p: ProductRecord) => p.id === id);
    if (!existing || existing.creatorId !== session.id) return NextResponse.json({ error: "Not found or not yours" }, { status: 404 });
  }

  const data: Omit<ProductRecord, "id"> = {
    name, category, price: parseFloat(price) || 0,
    ...(originalPrice ? { originalPrice: parseFloat(originalPrice) } : {}),
    creator: session.name, creatorId: session.id, creatorName: session.name,
    description: description || "", features: features || [], includes: includes || [],
    previewImages: previewImages || [], ...(downloadFile ? { downloadFile } : {}),
  };

  const product = id
    ? (await updateProduct(id, data)) || (await createProduct(data))
    : await createProduct(data);

  return NextResponse.json({ success: true, product });
}
