import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = file.name.split(".").pop() || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadDir = path.join(UPLOAD_DIR);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  fs.writeFileSync(path.join(uploadDir, filename), buffer);

  return NextResponse.json({
    success: true,
    url: `/uploads/${filename}`,
  });
}
