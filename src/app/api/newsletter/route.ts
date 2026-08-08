import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/data-dir";

const SUBSCRIBERS_FILE = "newsletter-subscribers.json";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    const filePath = path.join(DATA_DIR, SUBSCRIBERS_FILE);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let subscribers: string[] = [];
    try {
      if (fs.existsSync(filePath)) {
        subscribers = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }
    } catch { /* file missing or corrupt, start fresh */ }

    if (subscribers.includes(normalized)) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    subscribers.push(normalized);
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

    console.log(`[Newsletter] New subscriber: ${normalized} (total: ${subscribers.length})`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
