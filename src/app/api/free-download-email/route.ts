import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site-config";

export async function POST(req: Request) {
  try {
    const { email, productName, downloadUrl } = await req.json();
    if (!email || !productName) {
      return NextResponse.json({ error: "email and productName required" }, { status: 400 });
    }

    // If there's a real download URL, link to it. Otherwise link to product page.
    const isDirectDownload = downloadUrl && (downloadUrl.startsWith("/uploads/") || downloadUrl.startsWith("http"));
    const linkUrl = isDirectDownload
      ? (downloadUrl.startsWith("/") ? `${SITE.url}${downloadUrl}` : downloadUrl)
      : `${SITE.url}/products`;
    const linkLabel = isDirectDownload ? `Download ${productName}` : "View all free products";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;color:#171717">
  <h1 style="font-size:20px;margin:0 0 8px">Your free download from Kyno</h1>
  <p style="color:#737373;font-size:14px;line-height:1.6;margin:0 0 24px">
    Thanks for downloading <strong>${productName}</strong>!
    ${isDirectDownload ? "Click the link below to get your files." : "Visit the link below to view your free product."}
  </p>
  <a href="${linkUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
    ${linkLabel}
  </a>
  <hr style="border:0;border-top:1px solid #e5e5e5;margin:24px 0">
  <p style="color:#a3a3a3;font-size:12px;margin:0">
    Find more free resources at <a href="${SITE.url}" style="color:#2563eb">${SITE.url}</a>.
  </p>
</body>
</html>`;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: SITE.fromEmail,
        to: [email],
        subject: `Your free download: ${productName}`,
        html,
      });
      if (error) {
        console.error("Resend free-download error:", error);
        return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
      }
      console.log(`Free download email sent to ${email} — ${productName}`);
    } else {
      console.log(`━━━ FREE DOWNLOAD EMAIL (not sent — no RESEND_API_KEY) ━━━`);
      console.log(`To: ${email} | Product: ${productName} | URL: ${downloadUrl || "N/A"}`);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
