import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('Settings error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
