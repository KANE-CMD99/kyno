import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/db/storage";
import { convertClick } from "@/db/affiliates";
import { sendDownloadEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// In-process idempotency guard against webhook retries (best-effort)
const processedSessions = new Set<string>();

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

  if (processedSessions.has(session.id)) {
    return NextResponse.json({ received: true });
  }
  processedSessions.add(session.id);

  console.log(`Payment confirmed for ${email} — $${session.amount_total ? session.amount_total / 100 : 0}`);

  // Read the server-validated items stored in session metadata
  let items: { id: string; name: string; price: number; quantity: number }[] = [];
  try {
    items = JSON.parse(session.metadata?.items || "[]");
  } catch {
    items = [];
  }

  // Mint download tokens ONLY after payment is confirmed
  const orders = [];
  for (const item of items) {
    const order = await createOrder({
      userId: 0,
      productId: item.id,
      productName: item.name,
      price: item.price,
      customerEmail: email,
      customerName: name,
      createdAt: new Date().toISOString(),
    });
    orders.push(order);
  }

  if (orders.length > 0 && email) {
    try {
      await sendDownloadEmail(orders, email);
      console.log(`Sent download email to ${email}`);
    } catch (err) {
      console.error("Failed to send download email:", err);
    }
  }

  const affCode = session.metadata?.aff_code;
  if (affCode) {
    const total = session.amount_total ? session.amount_total / 100 : 0;
    convertClick(affCode, 0, total);
  }

  return NextResponse.json({ received: true });
}
