import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.slug || !body.titleFa || !body.titleEn) {
      return NextResponse.json({ error: 'slug, titleFa, titleEn اجباری است' }, { status: 400 });
    }
    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug,
        titleFa: body.titleFa,
        titleEn: body.titleEn,
        excerptFa: body.excerptFa || '',
        excerptEn: body.excerptEn || '',
        contentFa: body.contentFa,
        contentEn: body.contentEn,
        cover: body.cover || '',
        tags: body.tags || '',
        readTime: body.readTime ?? 5,
        date: body.date || new Date().toISOString().slice(0, 10),
        published: body.published ?? true,
      },
    });
    return NextResponse.json({ post });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'این slug تکراری است' }, { status: 409 });
    }
    console.error('Create post error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
