import { NextResponse } from "next/server";
import { getProductById } from "@/db/products-store";
import { createOrder } from "@/db/storage";
import { sendDownloadEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, productId } = await req.json();
    if (!email || !productId) {
      return NextResponse.json({ error: "email and productId required" }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Create a free order with a one-time download token (same as paid checkout)
    const order = await createOrder({
      userId: 0,
      productId: product.id,
      productName: product.name,
      price: 0,
      customerEmail: normalizedEmail,
      customerName: "",
      createdAt: new Date().toISOString(),
    });

    const sent = await sendDownloadEmail([order], normalizedEmail);
    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send download link. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Free download error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
