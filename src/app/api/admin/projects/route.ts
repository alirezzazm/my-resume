import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET — لیست همه‌ی پروژه‌ها
export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ projects });
}

// POST — ایجاد پروژه‌ی جدید
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.titleFa || !body.titleEn) {
      return NextResponse.json({ error: 'id و titleFa و titleEn اجباری است' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        id: body.id,
        titleFa: body.titleFa,
        titleEn: body.titleEn,
        descriptionFa: body.descriptionFa || '',
        descriptionEn: body.descriptionEn || '',
        longDescFa: body.longDescFa,
        longDescEn: body.longDescEn,
        featuresFa: body.featuresFa,
        featuresEn: body.featuresEn,
        challengesFa: body.challengesFa,
        challengesEn: body.challengesEn,
        image: body.image || '',
        gallery: body.gallery || '',
        technologies: body.technologies || '',
        category: body.category || 'web',
        liveUrl: body.liveUrl,
        codeUrl: body.codeUrl,
        appStore: body.appStore,
        playStore: body.playStore,
        featured: !!body.featured,
        date: body.date,
        roleFa: body.roleFa,
        roleEn: body.roleEn,
        durationFa: body.durationFa,
        durationEn: body.durationEn,
        clientFa: body.clientFa,
        clientEn: body.clientEn,
        order: body.order ?? 0,
        published: body.published ?? true,
      },
    });

    return NextResponse.json({ project });
  } catch (err: any) {
    console.error('Create project error:', err);
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'این id قبلاً استفاده شده است' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
