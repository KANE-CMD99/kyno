import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function readOrders() {
  try {
    const p = path.join(process.cwd(), "data", "orders.json");
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tokensParam = searchParams.get("tokens");
  const email = searchParams.get("email");

  if (!tokensParam && !email) {
    return NextResponse.json({ error: "tokens or email required" }, { status: 400 });
  }

  const orders = readOrders();

  if (tokensParam) {
    const tokens = tokensParam.split(",");
    const results = tokens
      .map((t) => {
        const order = orders.find((o: { downloadToken: string }) => o.downloadToken === t);
        return order ? { productId: order.productId, productName: order.productName, token: order.downloadToken } : null;
      })
      .filter(Boolean);
    return NextResponse.json({ downloads: results });
  }

  if (email) {
    const results = orders
      .filter((o: { customerEmail: string }) => o.customerEmail === email.toLowerCase().trim())
      .map((o: { productId: string; productName: string; downloadToken: string }) => ({
        productId: o.productId,
        productName: o.productName,
        token: o.downloadToken,
      }));
    return NextResponse.json({ downloads: results });
  }
}
