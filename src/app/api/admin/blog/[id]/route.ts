import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const data = await req.json();
  const post = await prisma.blogPost.update({ where: { id: params.id }, data });
  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
