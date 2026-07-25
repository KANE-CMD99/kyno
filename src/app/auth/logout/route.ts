import { clearSessionCookie } from "@/lib/auth";
import { clearCreatorSession } from "@/lib/creator-auth";
import { clearAdminSession } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await clearSessionCookie();
  await clearCreatorSession();
  await clearAdminSession();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
