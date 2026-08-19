import { NextResponse } from "next/server";
import { getOrdersByTokens, getOrdersByEmail } from "@/db/storage";

export async function GET(req: Request) {
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
