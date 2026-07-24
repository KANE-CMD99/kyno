import { NextResponse } from "next/server"
import { getOrderByToken, markOrderClaimed } from "@/db/storage"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const order = getOrderByToken(token)

  if (!order) {
    return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 })
  }

  if (order.downloadClaimed) {
    return NextResponse.json({ error: "This download link has already been used" }, { status: 410 })
  }

  // Mark as claimed
  markOrderClaimed(order.id)

  // For now, return a placeholder response.
  // When real files exist, serve them with:
  // const filePath = getProductFilePath(order.productId)
  // const fileBuffer = fs.readFileSync(filePath)
  // return new NextResponse(fileBuffer, { headers: { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="${order.productName}.zip"` } })

  return NextResponse.json({
    success: true,
    message: `Download activated for ${order.productName}`,
    productName: order.productName,
    productId: order.productId,
    orderId: order.id,
  })
}
