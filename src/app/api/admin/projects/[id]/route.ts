import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();

    // اگر id جدید فرستاده شد و با id فعلی فرق دارد، باید رکورد را delete + create کنیم
    const targetId = body.id || params.id;

    const data: any = {
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
    };

    if (targetId === params.id) {
      const project = await prisma.project.update({
        where: { id: params.id },
        data,
      });
      return NextResponse.json({ project });
    } else {
      // Rename id
      const project = await prisma.$transaction(async (tx) => {
        await tx.project.delete({ where: { id: params.id } });
        return tx.project.create({ data: { ...data, id: targetId } });
      });
      return NextResponse.json({ project });
    }
  } catch (err) {
    console.error('Update project error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
