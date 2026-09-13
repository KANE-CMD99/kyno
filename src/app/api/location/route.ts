import { NextResponse } from "next/server";

// Resolve the visitor's country server-side (avoid client directly calling ip-api.com).
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0].trim();
  if (!ip) return NextResponse.json({ countryCode: "US" });

  try {
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return NextResponse.json({ countryCode: "US" });
    const data = (await res.json()) as { countryCode?: string };
    return NextResponse.json({ countryCode: data.countryCode || "US" });
  } catch {
    return NextResponse.json({ countryCode: "US" });
  }
}
