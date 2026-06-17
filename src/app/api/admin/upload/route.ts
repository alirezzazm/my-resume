import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'هیچ فایلی ارسال نشده' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'فرمت پشتیبانی نمی‌شود (فقط PNG/JPG/WebP/GIF/SVG)' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم فایل بیشتر از 5MB' }, { status: 400 });
    }

    // Sanitize folder name
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'general';
    const dir = path.join(UPLOAD_DIR, safeFolder);
    await mkdir(dir, { recursive: true });

    // Unique filename
    const ext = path.extname(file.name).toLowerCase() || '.png';
    const hash = crypto.randomBytes(6).toString('hex');
    const baseName = path.basename(file.name, ext)
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .slice(0, 40);
    const fileName = `${Date.now()}-${hash}-${baseName}${ext}`;

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, fileName), buffer);

    const publicUrl = `/uploads/${safeFolder}/${fileName}`;
    return NextResponse.json({ url: publicUrl, size: file.size, name: fileName });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'خطای سرور در آپلود' }, { status: 500 });
  }
}

// DELETE /api/admin/upload?path=/uploads/projects/abc.png
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const filePath = url.searchParams.get('path');
    if (!filePath || !filePath.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'مسیر نامعتبر' }, { status: 400 });
    }
    const absolute = path.join(process.cwd(), 'public', filePath);
    await unlink(absolute);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return NextResponse.json({ ok: true, note: 'فایل قبلاً حذف شده' });
    }
    return NextResponse.json({ error: 'خطا در حذف' }, { status: 500 });
  }
}
