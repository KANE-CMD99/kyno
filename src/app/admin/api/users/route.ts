import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getUsers, saveUsers, getUserByEmail } from "@/db/storage";
import crypto from "crypto";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, name, email, password } = body;

  if (!name || !email) {
    return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
  }

  // Update existing user
  if (id) {
    const users = await getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const dup = users.find((u) => u.email === email.toLowerCase().trim() && u.id !== id);
    if (dup) return NextResponse.json({ success: false, error: "Email already taken" }, { status: 400 });

    user.name = name;
    user.email = email.toLowerCase().trim();
    if (password && password.length >= 6) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
      user.passwordHash = `${salt}:${hash}`;
    }
    await saveUsers(users);
    return NextResponse.json({ success: true });
  }

  // Create new user
  if (!password || password.length < 6) {
    return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await getUserByEmail(email.toLowerCase().trim());
  if (existing) return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  const all = await getUsers();
  const newId = all.length > 0 ? Math.max(...all.map((u) => u.id)) + 1 : 1;
  all.push({ id: newId, name, email: email.toLowerCase().trim(), passwordHash: `${salt}:${hash}`, createdAt: new Date().toISOString() });
  await saveUsers(all);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "");
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

  const users = await getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  await saveUsers(filtered);
  return NextResponse.json({ success: true });
}
