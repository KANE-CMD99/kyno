import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCreatorSession } from "@/lib/creator-auth";
import { getCreators, saveCreators, verifyCreatorPassword } from "@/db/creators";
import crypto from "crypto";

export async function POST(req: Request) {
  const cs = await cookies();
  const raw = cs.get("kyno_creator_session")?.value;
  if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try JWT first, then raw JSON
  let session = await getCreatorSession();
  if (!session) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id) session = parsed;
    } catch { /* not JSON */ }
  }
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both current and new password are required" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  const creators = await getCreators();
  const creator = creators.find((c) => c.id === session!.id);
  if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

  const valid = await verifyCreatorPassword(creator, currentPassword);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(newPassword, salt, 100000, 64, "sha512").toString("hex");
  creator.passwordHash = `${salt}:${hash}`;
  await saveCreators(creators);

  return NextResponse.json({ success: true });
}
