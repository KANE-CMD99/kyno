import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getCreators, createCreator } from "@/db/creators";
import { DATA_DIR } from "@/lib/data-dir";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREATORS_FILE = path.join(DATA_DIR, "creators.json");

function saveCreators(creators: unknown) {
  const dir = path.dirname(CREATORS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CREATORS_FILE, JSON.stringify(creators, null, 2));
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ creators: getCreators() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, username, name, email, bio, password, commission, status, permissions } = body;

  if (!name || !username || !email) {
    return NextResponse.json({ success: false, error: "Name, username, and email are required" }, { status: 400 });
  }

  const creators = getCreators();

  if (id) {
    // Update existing creator
    const creator = creators.find((c) => c.id === id);
    if (!creator) return NextResponse.json({ success: false, error: "Creator not found" }, { status: 404 });

    creator.name = name;
    creator.username = username.toLowerCase();
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
    saveCreators(creators);
    return NextResponse.json({ success: true, creator: { id: creator.id, username: creator.username, name: creator.name } });
    return NextResponse.json({ success: true, creator: { id: creator.id, username: creator.username, name: creator.name } });
  }

  // Create new
  if (!password || password.length < 6) {
    return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = creators.find((c) => c.username === username.toLowerCase());
  if (existing) return NextResponse.json({ success: false, error: "Username already taken" }, { status: 400 });

  const creator = createCreator({
    username, name, email, bio: bio || "", password, commission: commission || 20,
    status: status || "active",
    permissions: permissions || { canUpload: true, canEdit: true, canDelete: false, canViewAnalytics: true },
  });
  return NextResponse.json({ success: true, creator: { id: creator.id, username: creator.username, name: creator.name } });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

  const creators = getCreators();
  const creator = creators.find((c) => c.id === id);
  if (!creator) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  if (status) creator.status = status;
  saveCreators(creators);
  return NextResponse.json({ success: true });
}
