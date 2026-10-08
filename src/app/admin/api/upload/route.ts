import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { ADMIN_TOKEN } from '@/lib/admin-auth';

// 预览图（公开）存 public/uploads；下载文件（私有）存 storage/downloads
const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PRIVATE_DOWNLOAD_DIR = path.join(process.cwd(), 'storage', 'downloads');

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
const FILE_EXTENSIONS = new Set(['zip', 'rar', '7z', 'pdf', 'docx', 'txt', 'psd', 'fig', 'ai', 'xd', 'otf', 'ttf', 'woff', 'woff2']);

export async function POST(req: Request) {
  const cs = await cookies();
  if (cs.get('kyno_admin_session')?.value !== ADMIN_TOKEN)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const type = (formData.get('type') as string) || '';
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const ext = (file.name.split('.').pop() || '').toLowerCase();

  let dir: string;
  let urlPrefix: string;
  let allowed: Set<string>;
  if (type === 'image') {
    dir = PUBLIC_UPLOAD_DIR;
    urlPrefix = '/uploads/';
    allowed = IMAGE_EXTENSIONS;
  } else if (type === 'file') {
    dir = PRIVATE_DOWNLOAD_DIR;
    urlPrefix = '/downloads/';
    allowed = FILE_EXTENSIONS;
  } else {
    return NextResponse.json({ error: 'Type required (image or file)' }, { status: 400 });
  }

  if (!allowed.has(ext)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);

  return NextResponse.json({ success: true, url: `${urlPrefix}${filename}` });
}
