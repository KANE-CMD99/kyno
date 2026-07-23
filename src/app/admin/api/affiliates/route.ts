import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getAffiliates, createAffiliate, getClicksForAffiliate } from "@/db/affiliates";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const affiliates = getAffiliates();
  const recentClicks = affiliates.flatMap((a) => getClicksForAffiliate(a.code));
  return NextResponse.json({ affiliates, recentClicks });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, email, code, commission } = await req.json();
  if (!name || !email || !code) return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
  const existing = getAffiliates().find((a) => a.code === code.toUpperCase());
  if (existing) return NextResponse.json({ success: false, error: "Code already taken" }, { status: 400 });
  createAffiliate({ name, email, code: code.toUpperCase(), commission: commission || 20 });
  return NextResponse.json({ success: true });
}
