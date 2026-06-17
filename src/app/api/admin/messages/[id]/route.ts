import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params { params: { id: string } }

// PATCH /api/admin/messages/[id]
// Body: { read?: boolean }
export async function PATCH(req: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const data = await req.json();
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: !!data.read },
    });
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

// DELETE /api/admin/messages/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
