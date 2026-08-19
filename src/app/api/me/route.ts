import { getSession } from "@/lib/auth";
import { getCreatorSession } from "@/lib/creator-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "kyno_admin_session";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "kyno-admin-token-secure";

export async function GET() {
  // 1) Regular user session (JWT in kyno_session)
  const session = await getSession();
  if (session) {
    return NextResponse.json({
      user: { name: session.name, email: session.email, role: "user" },
    });
  }

  // 2) Admin session
  const cs = await cookies();
  if (cs.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN) {
    return NextResponse.json({
      user: { name: "Admin", email: "admin@kyno.dev", role: "admin" },
    });
  }

  // 3) Creator session — try JWT first, then raw JSON
  const jwtCreator = await getCreatorSession();
  if (jwtCreator) {
    return NextResponse.json({
      user: {
        name: jwtCreator.name,
        email: jwtCreator.email,
        role: "creator",
        username: jwtCreator.username,
      },
    });
  }

  const rawCreator = cs.get("kyno_creator_session")?.value;
  if (rawCreator) {
    try {
      const c = JSON.parse(rawCreator);
      if (c?.id) {
        return NextResponse.json({
          user: {
            name: c.name,
            email: c.email,
            role: "creator",
            username: c.username,
          },
        });
      }
    } catch { /* not JSON */ }
  }

  return NextResponse.json({ user: null });
}
