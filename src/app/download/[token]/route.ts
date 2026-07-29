import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getOrderByToken, markOrderClaimed } from "@/db/storage";
import { getProductById } from "@/db/products-store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  if (!order) {
    return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 });
  }

  if (order.downloadClaimed) {
    return NextResponse.json({ error: "This download link has already been used" }, { status: 410 });
  }

  await markOrderClaimed(order.id);

  // Try to serve the actual file
  const product = await getProductById(order.productId);
  if (product?.downloadFile?.url) {
    const fileUrl = product.downloadFile.url;

    // If it's a local path (starts with /), serve from disk
    if (fileUrl.startsWith("/")) {
      const filePath = path.join(process.cwd(), "public", fileUrl);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = product.downloadFile.name || `${order.productName}.zip`;
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
            "Content-Length": String(fileBuffer.length),
          },
        });
      }
      console.error(`[Download] File not found: ${filePath}`);
    }

    // If it's an external URL, redirect
    if (fileUrl.startsWith("http")) {
      return NextResponse.redirect(fileUrl);
    }
  }

  // Fallback: return JSON (no file attached)
  return NextResponse.json({
    success: true,
    message: `Download activated for ${order.productName}`,
    productName: order.productName,
    orderId: order.id,
  });
}
