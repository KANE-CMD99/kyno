import { NextResponse } from "next/server";
import { getCreatorSession } from "@/lib/creator-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "zip";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabaseAdmin().storage.from("products").upload(filename, buffer, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Creator upload error:", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: publicUrl } = supabaseAdmin().storage.from("products").getPublicUrl(filename);

  return NextResponse.json({ success: true, url: publicUrl.publicUrl });
}
