import { NextResponse } from "next/server";

// Inline account check — no imports, no dependencies
const ACCOUNTS: Record<string, { name: string; password: string; role: string }> = {
  "admin@kyno.dev": { name: "Admin", password: "kyno-admin-2025", role: "admin" },
  "creator@kyno.dev": { name: "Demo Creator", password: "creator2025", role: "creator" },
  "397521650@qq.com": { name: "Creator LJ", password: "LJ123456", role: "creator" },
  "153963592@qq.com": { name: "Creator GCS", password: "GCS123456", role: "creator" },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  const password = searchParams.get("password") || "";
  const acct = ACCOUNTS[email];
  return NextResponse.json({
    email,
    found: !!acct,
    name: acct?.name || null,
    role: acct?.role || null,
    passwordMatch: acct ? (password === acct.password) : null,
  });
}
