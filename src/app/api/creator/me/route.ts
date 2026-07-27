import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cs = await cookies();
  const raw = cs.get("kyno_creator_session")?.value;
  if (!raw) return NextResponse.json({ creator: null });
  try {
    const creator = JSON.parse(raw);
    return NextResponse.json({
      creator: {
        id: creator.id,
        username: creator.username || creator.id,
        name: creator.name,
        email: creator.email,
      },
    });
  } catch {
    return NextResponse.json({ creator: null });
  }
}
