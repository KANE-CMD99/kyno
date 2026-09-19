import { NextResponse } from "next/server";
import { getProductById } from "@/db/products-store";
import { createOrder } from "@/db/storage";
import { sendDownloadEmail } from "@/lib/email";
import { isEmail } from "@/lib/validation";
import { clientIp, isRateLimited, TOO_MANY } from "@/lib/rate-limit";

// Every accepted call sends a real email, so an unmetered script could drain
// the Resend quota and leave paying customers without their download links.
const RATE_LIMIT = 5;

export async function POST(req: Request) {
  if (isRateLimited("free-download-email", clientIp(req), RATE_LIMIT)) {
    return NextResponse.json(TOO_MANY, { status: 429 });
  }

  try {
    const { email, productId } = await req.json();
    if (!isEmail(email) || typeof productId !== "string" || !productId) {
      return NextResponse.json({ error: "A valid email and productId are required" }, { status: 400 });
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
