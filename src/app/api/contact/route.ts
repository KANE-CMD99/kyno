import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site-config";
import { isEmail } from "@/lib/validation";

// Caps stop the form being used as a relay for bulk/spam payloads, which
// would damage the domain's sending reputation.
const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 } as const;

function isFilledString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (
      !isFilledString(name, MAX_LENGTHS.name) ||
      !isEmail(email) ||
      !isFilledString(subject, MAX_LENGTHS.subject) ||
      !isFilledString(message, MAX_LENGTHS.message)
    ) {
      return NextResponse.json(
        { error: "Please fill in every field with a valid email (name and subject under 100/200 characters, message under 5000)." },
        { status: 400 }
      );
    }

    const body = `From: ${name.trim()} (${email.trim()})\nSubject: ${subject.trim()}\n\n${message}`;
    console.log("━━━ CONTACT FORM ━━━");
    console.log(body);
    console.log("━━━━━━━━━━━━━━━━━━━━");

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: SITE.fromEmail,
        to: [SITE.adminEmail],
        subject: `[Kyno Contact] ${subject.trim()}`,
        text: body,
      });
      if (error) {
        console.error("Contact email error:", error);
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
