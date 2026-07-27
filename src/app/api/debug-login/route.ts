import { NextResponse } from "next/server";
import { lookupAccount } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "";
  const password = searchParams.get("password") || "";
  const result = lookupAccount(email, password);
  return NextResponse.json({
    email,
    found: !!result,
    name: result?.name || null,
    role: result?.role || null,
  });
}
