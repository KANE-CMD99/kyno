import { NextResponse } from "next/server";
import { getOrdersByTokens, getOrdersByEmail } from "@/db/storage";

const RATE_WINDOW = 60000; // 1 minute
const ipCounts = new Map<string, { count: number; resetAt: number }>();

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const tokensParam = searchParams.get("tokens");
  const email = searchParams.get("email");

  if (!tokensParam && !email) {
    return NextResponse.json({ error: "tokens or email required" }, { status: 400 });
  }

  if (tokensParam) {
    const tokens = tokensParam.split(",");
    const orders = await getOrdersByTokens(tokens);
    const results = orders.map((o) => ({
      productId: o.productId,
      productName: o.productName,
      token: o.downloadToken,
    }));
    return NextResponse.json({ downloads: results });
  }

  if (email) {
    const orders = await getOrdersByEmail(email);
    const results = orders.map((o) => ({
      productId: o.productId,
      productName: o.productName,
      token: o.downloadToken,
    }));
    return NextResponse.json({ downloads: results });
  }
}
