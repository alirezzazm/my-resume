import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  const data = await req.json();
  const skill = await prisma.skill.update({ where: { id }, data });
  return NextResponse.json({ skill });
}

export async function DELETE(_req: Request, { params }: Params) {
  const id = parseInt(params.id, 10);
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
