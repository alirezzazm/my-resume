import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const experience = await prisma.experience.update({ where: { id: params.id }, data });
  return NextResponse.json({ experience });
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.experience.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
