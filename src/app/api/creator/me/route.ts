import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCreatorSession } from "@/lib/creator-auth";

export async function GET() {
  const cs = await cookies();
  const raw = cs.get("kyno_creator_session")?.value;
  if (!raw) return NextResponse.json({ creator: null });

  // 1) Try JWT (from /creator page login)
  const jwtSession = await getCreatorSession();
  if (jwtSession) {
    return NextResponse.json({
      creator: {
        id: jwtSession.id,
        username: jwtSession.username,
        name: jwtSession.name,
        email: jwtSession.email,
      },
    });
  }

  // 2) Try raw JSON (from AuthModal login)
  try {
    const creator = JSON.parse(raw);
    if (creator?.id) {
      return NextResponse.json({
        creator: {
          id: creator.id,
          username: creator.username || creator.id,
          name: creator.name,
          email: creator.email,
        },
      });
    }
  } catch { /* not JSON */ }

  return NextResponse.json({ creator: null });
}
