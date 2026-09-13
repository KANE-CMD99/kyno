import { NextResponse } from "next/server";
import { recordClick, getAffiliateByCode } from "@/db/affiliates";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.pathname.split("/r/")[1];
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  const affiliate = getAffiliateByCode(code);
  if (!affiliate) return NextResponse.redirect(new URL("/", req.url));

  recordClick(code);

  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set("kyno_affiliate", code, {
    maxAge: 30 * 24 * 3600, // 30 days
    path: "/",
    sameSite: "lax",
  });

  return response;
}
