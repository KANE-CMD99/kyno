import { Resend } from "resend";
import type { OrderRecord } from "@/db/storage";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Kyno <33429296@qq.com>";

function buildOrderEmail(orders: OrderRecord[], origin: string): string {
  const downloadLinks = orders
    .map((o) => {
      const url = `${origin}/download/${o.downloadToken}`;
      return `<li style="margin:0 0 10px;padding:12px 16px;background:#f9fafb;border-radius:8px">
        <strong style="color:#171717">${o.productName}</strong><br>
        <span style="color:#737373;font-size:14px">$${o.price}</span><br>
        <a href="${url}" style="color:#1a56db;font-size:13px;text-decoration:none">Download &rarr;</a>
      </li>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;color:#171717">
  <h1 style="font-size:20px;margin:0 0 8px">Your Kyno downloads</h1>
  <p style="color:#737373;font-size:14px;line-height:1.6;margin:0 0 24px">
    Thanks for your purchase! Here are your download links. Each link can be used once — save them for future access.
  </p>
  <ul style="list-style:none;padding:0;margin:0 0 24px">${downloadLinks}</ul>
  <hr style="border:0;border-top:1px solid #e5e5e5;margin:24px 0">
  <p style="color:#a3a3a3;font-size:12px;margin:0">
    Need help? Reply to this email or contact <a href="mailto:33429296@qq.com" style="color:#1a56db">33429296@qq.com</a>.
  </p>
</body>
</html>`;
}

export async function sendDownloadEmail(orders: OrderRecord[], to: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const html = buildOrderEmail(orders, origin);

  if (!resend) {
    console.log("━━━ RESEND EMAIL (not sent — set RESEND_API_KEY) ━━━");
    console.log("To:", to);
    for (const o of orders) {
      console.log(`  ${o.productName}: ${origin}/download/${o.downloadToken}`);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: orders.length === 1
      ? `Your download: ${orders[0].productName}`
      : `Your downloads (${orders.length} items)`,
    html,
  });

  if (error) {
    console.error("Resend send error:", error);
  } else {
    console.log(`Email sent to ${to} — ${data?.id}`);
  }
}
