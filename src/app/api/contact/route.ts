import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site-config";

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
      await resend.emails.send({
        from: SITE.fromEmail,
        to: [SITE.adminEmail],
        subject: `[Kyno Contact] ${subject}`,
        text: body,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
