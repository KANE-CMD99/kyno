import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getCreators, saveCreators, createCreator } from "@/db/creators";
import crypto from "crypto";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const creators = await getCreators();
  return NextResponse.json({ creators });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, username, name, email, bio, password, commission, status, permissions } = body;

  if (!name || !username || !email) {
    return NextResponse.json({ success: false, error: "Name, username, and email are required" }, { status: 400 });
  }

  // Update existing creator
  if (id) {
    const creators = await getCreators();
    const creator = creators.find((c: { id: string }) => c.id === id);
    if (!creator) return NextResponse.json({ success: false, error: "Creator not found" }, { status: 404 });

    creator.name = name;
    creator.username = username;
    creator.email = email.toLowerCase().trim();
    creator.bio = bio || "";
    creator.commission = commission || 20;
    if (status) creator.status = status;
    if (permissions) creator.permissions = permissions;
    if (password && password.length >= 6) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
      creator.passwordHash = `${salt}:${hash}`;
    }
    await saveCreators(creators);
    return NextResponse.json({ success: true, creator: { id: creator.id, username: creator.username, name: creator.name } });
  }

  // Create new
  if (!password || password.length < 6) {
    return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const creators = await getCreators();
  const existing = creators.find((c: { username: string }) => c.username.toLowerCase() === username.toLowerCase());
  if (existing) return NextResponse.json({ success: false, error: "Username already taken" }, { status: 400 });

  const creator = await createCreator({
    username, name, email, bio: bio || "", password, commission: commission || 20,
    status: status || "active",
    permissions: permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true },
  });
  return NextResponse.json({ success: true, creator: { id: creator.id, username: creator.username, name: creator.name } });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status: newStatus } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

  const creators = await getCreators();
  const creator = creators.find((c: { id: string }) => c.id === id);
  if (!creator) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  if (newStatus) creator.status = newStatus;
  await saveCreators(creators);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

  const creators = await getCreators();
  const filtered = creators.filter((c: { id: string }) => c.id !== id);
  if (filtered.length === creators.length) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  await saveCreators(filtered);
  return NextResponse.json({ success: true });
}
