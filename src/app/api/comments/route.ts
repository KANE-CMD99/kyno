import { NextResponse } from "next/server";
import { getCommentsForProduct, addComment, getRatingSummary } from "@/db/comments";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const comments = getCommentsForProduct(productId);
  return NextResponse.json({ comments, rating: getRatingSummary(productId) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { productId, name, email, text, rating } = body;
  if (!productId || !name || !text) {
    return NextResponse.json({ error: "productId, name, and text required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Name is too long (max 100 characters)" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment is too long (max 2000 characters)" }, { status: 400 });
  }

  // A rating must be a whole number of stars if one is supplied. It is stored
  // as given — never inferred or defaulted, so the average stays honest.
  if (rating !== undefined && rating !== null && rating !== "") {
    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Rating must be a whole number from 1 to 5" }, { status: 400 });
    }
  }

  const comment = addComment({
    productId,
    name,
    email: email || "",
    text,
    ...(rating !== undefined && rating !== null && rating !== "" ? { rating: Number(rating) } : {}),
  });
  return NextResponse.json({ success: true, comment });
}
