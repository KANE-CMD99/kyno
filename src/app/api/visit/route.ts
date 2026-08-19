import { NextResponse } from "next/server";
import { recordVisit } from "@/db/stats";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";
  recordVisit(ip);
  return NextResponse.json({ ok: true });
}
