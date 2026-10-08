import { NextResponse } from "next/server";
import { recordVisit } from "@/db/stats";

export const dynamic = "force-dynamic";

/** Clamped so a crafted request cannot grow the stats file without bound. */
function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  // Nothing here is anything the visitor typed: these are values the browser
  // already sent (the referrer) or that were already in the URL they clicked.
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  recordVisit(ip, {
    path: str(body.path),
    referrer: str(body.referrer, 500),
    source: str(body.source),
    medium: str(body.medium),
    campaign: str(body.campaign),
    content: str(body.content),
  });

  return NextResponse.json({ ok: true });
}
