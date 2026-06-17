import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
  try {
    const { name, level, category, order } = await req.json();
    if (!name || !category) {
      return NextResponse.json({ error: 'name و category اجباری است' }, { status: 400 });
    }
    const skill = await prisma.skill.create({
      data: { name, level: level ?? 50, category, order: order ?? 0 },
    });
    return NextResponse.json({ skill });
  } catch (err) {
    console.error('Create skill error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
