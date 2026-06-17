import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
  });
  return NextResponse.json({ experiences });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const exp = await prisma.experience.create({
      data: {
        type: body.type || 'work',
        titleFa: body.titleFa || '',
        titleEn: body.titleEn || '',
        companyFa: body.companyFa || '',
        companyEn: body.companyEn || '',
        startDate: body.startDate || '',
        endDate: body.endDate || null,
        descriptionFa: body.descriptionFa || '',
        descriptionEn: body.descriptionEn || '',
        technologies: body.technologies || '',
        order: body.order ?? 0,
      },
    });
    return NextResponse.json({ experience: exp });
  } catch (err) {
    console.error('Create exp error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
