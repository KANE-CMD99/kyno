import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/db/storage";
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

    const lineItems = items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout`,
        customer_email: email || undefined,
        metadata: {
          customer_name: name || "",
          product_ids: items.map((i: { id: string }) => i.id).join(","),
          aff_code: req.headers.get("cookie")?.match(/kyno_affiliate=([^;]+)/)?.[1] || "",
        },
        line_items: lineItems,
        payment_method_types: ["card"],
        billing_address_collection: "auto",
      });

      return NextResponse.json({ url: session.url });
    } catch (stripeErr: unknown) {
      const err = stripeErr as { type?: string; code?: string };
      // Stripe API unreachable (common in China) — fall through to demo mode
      if (err.type === "StripeConnectionError" || err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
        const now = new Date().toISOString();
        const orders = [];
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

        // Record affiliate commission in demo mode
        const affCode = req.headers.get("cookie")?.match(/kyno_affiliate=([^;]+)/)?.[1];
        if (affCode) {
          const total = items.reduce((sum: number, i: { price: number }) => sum + i.price, 0);
          convertClick(affCode, 0, total);
        }

        // Send download email
        if (orders.length > 0 && email) {
          sendDownloadEmail(orders, email).catch((e) => console.error("Demo email failed:", e));
        }

        return NextResponse.json({ url: `${origin}/checkout/success?demo=true&email=${encodeURIComponent(email || "")}` });
      }
      throw stripeErr;
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
