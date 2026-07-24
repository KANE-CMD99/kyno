import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/db/storage";
import { convertClick } from "@/db/affiliates";
import { sendDownloadEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

function getCustomerEmail(session: Stripe.Checkout.Session): string {
  return session.customer_details?.email || session.customer_email || "";
}

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
  const email = getCustomerEmail(session);
  const name = session.metadata?.customer_name || "";

  console.log(`Order completed for ${email} — $${session.amount_total ? session.amount_total / 100 : 0}`);

  const orders = [];
  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price.product"],
    });

    const lineItems = fullSession.line_items?.data ?? [];
    const productIdsRaw = (session.metadata?.product_ids ?? "").split(",").filter(Boolean);

    for (const item of lineItems) {
      const order = createOrder({
        userId: 0,
        productId: productIdsRaw.shift() ?? "unknown",
        productName: item.description ?? "Product",
        price: item.amount_total / 100,
        customerEmail: email,
        customerName: name,
        createdAt: new Date().toISOString(),
      });
      orders.push(order);
    }

    // Record affiliate commission
    const affCode = session.metadata?.aff_code;
    if (affCode) {
      const total = session.amount_total ? session.amount_total / 100 : 0;
      convertClick(affCode, 0, total);
    }
  } catch (err) {
    console.error("Failed to create orders:", err);
  }

  // Send email with download links
  if (orders.length > 0 && email) {
    try {
      await sendDownloadEmail(orders, email);
    } catch (err) {
      console.error("Failed to send download email:", err);
    }
  }

  return NextResponse.json({ received: true });
}
