import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cs = await cookies();
  // Clear all session cookies set by loginAction
  cs.delete("kyno_admin_session");
  cs.delete("kyno_creator_session");
  cs.delete("kyno_session_name");
  cs.delete("kyno_session");
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
