import { NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/portfolio-data';

interface Params { params: { slug: string } }

export async function GET(_req: Request, { params }: Params) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ post });
}
