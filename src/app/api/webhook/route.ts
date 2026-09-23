import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, getOrdersBySession, markOrderEmailed } from "@/db/storage";
import { getProductById } from "@/db/products-store";
import { convertClick } from "@/db/affiliates";
import { recordOrder } from "@/db/stats";
import { sendDownloadEmail } from "@/lib/email";

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

  // Card payments have settled by the time the session completes, but
  // asynchronous methods (Klarna and friends) complete the session while funds
  // are still in flight — their real signal is async_payment_succeeded, which
  // this endpoint does not handle. Minting a token off an unpaid session hands
  // over the file for nothing.
  if (session.payment_status !== "paid") {
    console.log(`Session ${session.id} is "${session.payment_status}" — no tokens minted`);
    return NextResponse.json({ received: true });
  }

  const email = session.customer_details?.email || session.customer_email || "";
  const name = session.metadata?.customer_name || "";

  console.log(`Payment confirmed for ${email} — $${session.amount_total ? session.amount_total / 100 : 0}`);

  // Metadata carries compact [id, quantity, price] triples (see checkout/route.ts)
  // because Stripe caps a metadata value at 500 characters. The product name is
  // re-resolved here rather than being carried in the session.
  const items: { id: string; name: string; price: number; quantity: number }[] = [];
  try {
    const raw: unknown = JSON.parse(session.metadata?.items || "[]");
    if (Array.isArray(raw)) {
      for (const entry of raw) {
        if (!Array.isArray(entry) || typeof entry[0] !== "string") continue;
        const [id, quantity, price] = entry as [string, unknown, unknown];
        const product = await getProductById(id);
        items.push({
          id,
          name: product?.name || id,
          price: Number(price) || 0,
          quantity: Number(quantity) || 1,
        });
      }
    }
  } catch {
    // fall through with no items
  }

  // Idempotency lives in the data, not in memory: every order records the
  // session it came from, so a Stripe retry resumes from what was already
  // written. A restart or a second instance cannot duplicate line items, and a
  // failure part-way through no longer marks the session as done.
  const existing = await getOrdersBySession(session.id);
  const alreadyOrdered = new Set(existing.map((o) => o.productId));

  const created = [];
  for (const item of items) {
    if (alreadyOrdered.has(item.id)) continue;
    const order = await createOrder({
      userId: 0,
      productId: item.id,
      productName: item.name,
      price: item.price,
      customerEmail: email,
      customerName: name,
      createdAt: new Date().toISOString(),
      stripeSessionId: session.id,
    });
    created.push(order);
  }

  // Analytics and affiliate conversion count once, on the delivery that actually
  // created orders — never at session creation, so an abandoned or declined
  // checkout is not recorded as revenue.
  if (created.length > 0) {
    const total = session.amount_total ? session.amount_total / 100 : 0;
    recordOrder(email, total);
    const affCode = session.metadata?.aff_code;
    if (affCode) convertClick(affCode, 0, total);
  }

  // Delivery. Orders already emailed are skipped, so a retry cannot send a
  // second copy. A send failure returns 500 so Stripe retries on its own
  // schedule — that retry is also the only alerting this endpoint has.
  const undelivered = [...existing, ...created].filter((o) => !o.emailSentAt);
  if (undelivered.length > 0) {
    if (!email) {
      console.error(`Session ${session.id} has no customer email — ${undelivered.length} order(s) undeliverable`);
    } else {
      const sent = await sendDownloadEmail(undelivered, email);
      if (!sent) {
        console.error(`DELIVERY FAILED for session ${session.id} (${email}) — Stripe will retry`);
        return NextResponse.json({ error: "Delivery failed" }, { status: 500 });
      }
      const at = new Date().toISOString();
      for (const o of undelivered) await markOrderEmailed(o.id, at);
      console.log(`Sent download email to ${email} (${undelivered.length} item(s))`);
    }
  }

  return NextResponse.json({ received: true });
}
