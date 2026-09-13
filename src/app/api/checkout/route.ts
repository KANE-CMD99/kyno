import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/db/products-store";
import { recordOrder } from "@/db/stats";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  timeout: 8000,
});

const RATE_WINDOW = 60000; // 1 minute
const MAX_QUANTITY = 10;
const ipCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  // IP-based rate limiting
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (entry && entry.resetAt > now) {
    if (entry.count >= 5) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }
    entry.count++;
  } else {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }

  try {
    const { items, email, name } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Server-side validation: resolve every item from the DB and discard
    // any client-supplied price/name. Unknown product → 400. Quantity capped.
    const resolvedItems: { id: string; name: string; price: number; quantity: number }[] = [];
    for (const item of items) {
      if (!item || typeof item.id !== "string") {
        return NextResponse.json({ error: "Invalid item" }, { status: 400 });
      }
      const product = await getProductById(item.id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 400 });
      }
      const qty = Math.min(Math.max(1, Number(item.quantity) || 1), MAX_QUANTITY);
      resolvedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
      });
    }

    // Analytics (server-computed total)
    const totalRevenue = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (email) recordOrder(email, totalRevenue);

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const affCode = req.headers.get("cookie")?.match(/kyno_affiliate=([^;]+)/)?.[1] || "";

    // Create the Stripe session ONLY — no order/token is issued here.
    // Download tokens are minted in the webhook after payment is confirmed.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout`,
      customer_email: email || undefined,
      metadata: {
        customer_name: name || "",
        customer_email: email || "",
        items: JSON.stringify(resolvedItems),
        aff_code: affCode,
      },
      line_items: resolvedItems.map((i) => ({
        price_data: {
          currency: "usd",
          product_data: { name: i.name },
          unit_amount: Math.round(i.price * 100),
        },
        quantity: i.quantity,
      })),
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      ...(process.env.STRIPE_AUTOMATIC_TAX === "true"
        ? {
            automatic_tax: { enabled: true },
            tax_id_collection: { enabled: true },
          }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
