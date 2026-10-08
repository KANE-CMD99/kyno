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
    // Paid products must not be claimable here: this route mints a $0 order and
    // a live download token, and the download route serves whatever file the
    // order's product carries. Same 404 as an unknown id so the response does
    // not reveal which ids are paid.
    if (!product || Number(product.price) > 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Free order + download token, same shape as a paid one.
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
