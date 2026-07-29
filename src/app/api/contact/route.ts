import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const body = `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`;
    console.log("━━━ CONTACT FORM ━━━");
    console.log(body);
    console.log("━━━━━━━━━━━━━━━━━━━━");

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const adminEmail = process.env.ADMIN_EMAIL || "33429296@qq.com";
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Kyno <33429296@qq.com>",
        to: [adminEmail],
        subject: `[Kyno Contact] ${subject}`,
        text: body,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
