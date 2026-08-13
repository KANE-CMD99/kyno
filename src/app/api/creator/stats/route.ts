import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCreatorStats } from "@/db/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const cs = await cookies();
  const raw = cs.get("kyno_creator_session")?.value;
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let creatorId = "";
  try {
    const c = JSON.parse(raw);
    creatorId = c.id || "";
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  if (!creatorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = getCreatorStats(creatorId);
  return NextResponse.json(stats);
}
