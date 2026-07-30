import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, type OrderRecord } from "@/db/storage";
import { convertClick } from "@/db/affiliates";
import { sendDownloadEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  timeout: 8000,
});

export async function POST(req: Request) {
  try {
    const { items, email, name } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const affCode = req.headers.get("cookie")?.match(/kyno_affiliate=([^;]+)/)?.[1] || "";

    // Create orders with download tokens BEFORE Stripe — ensures orders exist
    // even if webhook never fires (common when server has no public HTTPS)
    const now = new Date().toISOString();
    const orders: OrderRecord[] = [];
    for (const item of items) {
      const order = await createOrder({
        userId: 0,
        productId: item.id,
        productName: item.name,
        price: item.price,
        customerEmail: email || "",
        customerName: name || "",
        createdAt: now,
      });
      orders.push(order);
    }

    // Build token list for success URL
    const tokenList = orders.map((o) => o.downloadToken).join(",");

    const lineItems = items.map((item: { id: string; name: string; price: number; quantity?: number }) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${origin}/checkout/success?tokens=${encodeURIComponent(tokenList)}`,
        cancel_url: `${origin}/checkout`,
        customer_email: email || undefined,
        metadata: {
          customer_name: name || "",
          order_tokens: tokenList,
          aff_code: affCode,
        },
        line_items: lineItems,
        payment_method_types: ["card"],
        billing_address_collection: "auto",
      });

      // Record affiliate commission
      if (affCode) {
        const total = items.reduce((sum: number, i: { price: number }) => sum + i.price, 0);
        convertClick(affCode, 0, total);
      }

      // Send download email immediately (don't wait for webhook)
      if (orders.length > 0 && email) {
        sendDownloadEmail(orders, email).catch((e) => console.error("Email failed:", e));
      }

      return NextResponse.json({ url: session.url });
    } catch (stripeErr: unknown) {
      const err = stripeErr as { type?: string; code?: string };
      // Stripe API unreachable — demo mode: orders already created above
      if (err.type === "StripeConnectionError" || err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
        // Affiliate commission
        if (affCode) {
          const total = items.reduce((sum: number, i: { price: number }) => sum + i.price, 0);
          convertClick(affCode, 0, total);
        }

        // Send download email
        if (orders.length > 0 && email) {
          sendDownloadEmail(orders, email).catch((e) => console.error("Demo email failed:", e));
        }

        return NextResponse.json({
          url: `${origin}/checkout/success?tokens=${encodeURIComponent(tokenList)}&demo=true`,
        });
      }
      throw stripeErr;
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
