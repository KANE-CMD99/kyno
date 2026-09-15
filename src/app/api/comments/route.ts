import { NextResponse } from "next/server";
import { getCommentsForProduct, addComment } from "@/db/comments";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const comments = getCommentsForProduct(productId);
  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { productId, name, email, text } = body;
  if (!productId || !name || !text) {
    return NextResponse.json({ error: "productId, name, and text required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Name is too long (max 100 characters)" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment is too long (max 2000 characters)" }, { status: 400 });
  }
  const comment = addComment({ productId, name, email: email || "", text });
  return NextResponse.json({ success: true, comment });
}
