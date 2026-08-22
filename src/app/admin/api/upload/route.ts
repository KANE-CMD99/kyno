import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { ADMIN_TOKEN } from '@/lib/admin-auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Whitelist of safe extensions. Excludes .html/.svg to prevent stored XSS.
const ALLOWED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp',
  'zip', 'rar', '7z', 'pdf', 'docx', 'txt',
  'psd', 'fig', 'ai', 'xd',
  'otf', 'ttf', 'woff', 'woff2',
]);

export async function POST(req: Request) {
  const cs = await cookies();
  if (cs.get('kyno_admin_session')?.value !== ADMIN_TOKEN)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ success: true, url: `/uploads/${filename}` });
}
