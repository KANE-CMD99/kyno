import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getCreators, createCreator } from "@/db/creators";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ creators: getCreators() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { username, name, email, bio, password, commission } = await req.json();
  if (!username || !name || !email || !password) {
    return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
  }
  const existing = getCreators().find((c) => c.username === username.toLowerCase());
  if (existing) return NextResponse.json({ success: false, error: "Username already taken" }, { status: 400 });
  const creator = createCreator({ username, name, email, bio: bio || "", password, commission: commission || 20 });
  return NextResponse.json({ success: true, creator: { id: creator.id, username: creator.username, name: creator.name } });
}
