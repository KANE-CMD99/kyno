import { NextResponse } from "next/server";
import { getOrdersByEmail } from "@/db/storage";
import { sendDownloadEmail } from "@/lib/email";

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
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const orders = await getOrdersByEmail(normalized);

  if (orders.length === 0) {
    return NextResponse.json({ sent: false });
  }

  const sent = await sendDownloadEmail(orders, normalized);
  return NextResponse.json({ sent });
}
