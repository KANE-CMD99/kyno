import { NextResponse } from "next/server";
import { getOrdersByEmail } from "@/db/storage";
import { sendDownloadEmail } from "@/lib/email";
import { isEmail } from "@/lib/validation";

const RATE_WINDOW = 60000; // 1 minute
const ipCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  // IP-based rate limiting to prevent email enumeration
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (entry && entry.resetAt > now) {
    if (entry.count >= 10) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }
    entry.count++;
  } else {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  }

  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const orders = await getOrdersByEmail(normalized);

  // The response is identical whether or not that address has ever ordered.
  // Reporting "nothing found" makes this endpoint an oracle for testing whether
  // a given email is a customer, which is worth more to an attacker than the
  // small amount of feedback we lose here.
  if (orders.length > 0) {
    const sent = await sendDownloadEmail(orders, normalized);
    if (!sent) console.error(`Resend of download links failed for ${normalized} (${orders.length} order(s))`);
  }

  return NextResponse.json({ ok: true });
}
