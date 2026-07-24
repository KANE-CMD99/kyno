import { NextResponse } from "next/server";
import { getCreatorSession } from "@/lib/creator-auth";

export async function GET() {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ creator: null });
  return NextResponse.json({
    creator: {
      id: session.id,
      username: session.username,
      name: session.name,
      email: session.email,
    },
  });
}
