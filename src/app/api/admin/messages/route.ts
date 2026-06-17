import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET — لیست همه‌ی پیام‌ها یا فقط unread (با ?unread=1)
// همچنین برای ?count=1 فقط تعداد رو برمی‌گردونه
export async function GET(req: Request) {
  const url = new URL(req.url);
  const unread = url.searchParams.get('unread') === '1';
  const onlyCount = url.searchParams.get('count') === '1';

  try {
    if (unread || onlyCount) {
      const count = await prisma.contactMessage.count(
        unread ? { where: { read: false } } : undefined
      );
      return NextResponse.json({ count });
    }
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('GET messages error:', err);
    return NextResponse.json({ error: 'Server error', count: 0 }, { status: 500 });
  }
}

// PATCH — mark all as read (با ?action=read-all)
export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'read-all') {
      const result = await prisma.contactMessage.updateMany({
        where: { read: false },
        data: { read: true },
      });
      return NextResponse.json({ ok: true, updated: result.count });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — حذف همه پیام‌های خوانده‌شده (با ?action=clear-read)
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'clear-read') {
      const result = await prisma.contactMessage.deleteMany({
        where: { read: true },
      });
      return NextResponse.json({ ok: true, deleted: result.count });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
