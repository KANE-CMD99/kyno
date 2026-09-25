import { Resend } from "resend";
import type { OrderRecord } from "@/db/storage";
import { SITE } from "@/lib/site-config";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildOrderEmail(orders: OrderRecord[], origin: string): string {
  const downloadLinks = orders
    .map((o) => {
      const url = `${origin}/download/${o.downloadToken}`;
      return `<li style="margin:0 0 10px;padding:12px 16px;background:#f9fafb;border-radius:8px">
        <strong style="color:#171717">${escapeHtml(o.productName)}</strong><br>
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
    Thanks for your purchase! Your download links are below. They stay active, so keep this
    email — if you lose it, you can have them sent again any time from the Orders page.
  </p>
  <ul style="list-style:none;padding:0;margin:0 0 24px">${downloadLinks}</ul>
  <p style="color:#737373;font-size:14px;line-height:1.6;margin:0 0 24px">
    Not what you expected? Reply to this email within 7 days of purchase and we will refund you.
  </p>
  <hr style="border:0;border-top:1px solid #e5e5e5;margin:24px 0">
  <p style="color:#a3a3a3;font-size:12px;margin:0">
    Need help? Reply to this email or contact <a href="mailto:${escapeHtml(SITE.contactEmail)}" style="color:#1a56db">${escapeHtml(SITE.contactEmail)}</a>.
  </p>
</body>
</html>`;
}

export async function sendDownloadEmail(orders: OrderRecord[], to: string): Promise<boolean> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const html = buildOrderEmail(orders, origin);

  const resend = process.env.RESEND_API_KEY;
  if (!resend) {
    console.error("RESEND_API_KEY is not set — download email was NOT sent, and the error is real");
    return false;
  }

  const client = new Resend(resend);
  const { data, error } = await client.emails.send({
    from: SITE.fromEmail,
    to: [to],
    // The sending domain accepts no inbound mail (no MX), so a customer hitting
    // reply would get a bounce. Point replies at the address we actually read.
    replyTo: SITE.contactEmail,
    subject: orders.length === 1
      ? `Your download: ${orders[0].productName}`
      : `Your downloads (${orders.length} items)`,
    html,
  });

  if (error) {
    console.error("Resend send error:", error);
    return false;
  }
  console.log(`Email sent to ${to} — ${data?.id}`);
  return true;
}
