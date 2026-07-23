import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/db/storage";
import { convertClick } from "@/db/affiliates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email || session.customer_email || "";
  const name = session.metadata?.customer_name || "";

  console.log(`Order completed for ${email} — $${session.amount_total ? session.amount_total / 100 : 0}`);

  try {
    // Retrieve the full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });

    const lineItems = fullSession.line_items?.data ?? [];
    const productIdsRaw = (session.metadata?.product_ids ?? "").split(",").filter(Boolean);

    for (const item of lineItems) {
      createOrder({
        userId: 0,
        productId: productIdsRaw.shift() ?? "unknown",
        productName: item.description ?? "Product",
        price: item.amount_total / 100,
        customerEmail: email,
        customerName: name,
        createdAt: new Date().toISOString(),
      });
    }

    console.log(`Orders created for ${email} — ${lineItems.length} items`);

    // Record affiliate commission
    const affCode = session.metadata?.aff_code;
    if (affCode) {
      const total = session.amount_total ? session.amount_total / 100 : 0;
      convertClick(affCode, 0, total);
      console.log(`Affiliate commission recorded for code: ${affCode}`);
    }
  } catch (err) {
    console.error("Failed to create orders:", err);
  }

  return NextResponse.json({ received: true });
}
