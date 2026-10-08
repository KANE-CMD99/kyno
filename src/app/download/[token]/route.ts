import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getOrderByToken, markOrderClaimed } from "@/db/storage";
import { getProductById } from "@/db/products-store";
import { recordDownload } from "@/db/stats";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  if (!order) {
    return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 });
  }

  // Links are not consumed on use: a customer who loses the email, switches
  // device or reinstalls can be re-sent the same link from /orders and it still
  // works. `downloadClaimed` now records only whether the first download
  // happened, for stats.
  const claimOnce = async () => {
    if (!order.downloadClaimed) await markOrderClaimed(order.id);
  };

  const product = await getProductById(order.productId);
  const fileUrl = product?.downloadFile?.url;

  // Download files live in private storage/downloads (not served by nginx).
  // Old data may still point at public/uploads — keep that fallback for compat.
  let filePath: string | null = null;
  if (fileUrl?.startsWith("/downloads/")) {
    filePath = path.join(process.cwd(), "storage", fileUrl);
  } else if (fileUrl?.startsWith("/uploads/")) {
    filePath = path.join(process.cwd(), "public", fileUrl);
  }

  if (filePath && fs.existsSync(filePath)) {
    await claimOnce();
    recordDownload();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = product?.downloadFile?.name || `${order.productName}.zip`;
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  }
  if (filePath) console.error(`[Download] File not found: ${filePath}`);

  if (fileUrl?.startsWith("http")) {
    await claimOnce();
    recordDownload();
    return NextResponse.redirect(fileUrl);
  }

  // No file attached or file missing — send them to the product page
  const productPageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${order.productId}`;
  return NextResponse.redirect(productPageUrl);
}
