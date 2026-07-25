import { getSession } from "@/lib/auth";
import { getCreatorSession } from "@/lib/creator-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "kyno_admin_session";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kyno-admin-token-secure";

export async function GET() {
  // Check regular user session
  const session = await getSession();
  if (session) return NextResponse.json({ user: { name: session.name, email: session.email } });

  // Check admin session
  const cs = await cookies();
  if (cs.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN) {
    return NextResponse.json({ user: { name: "Admin", email: "admin@kyno.dev" } });
  }

  // Check creator session
  const creator = await getCreatorSession();
  if (creator) return NextResponse.json({ user: { name: creator.name, email: creator.email } });

  return NextResponse.json({ user: null });
}
