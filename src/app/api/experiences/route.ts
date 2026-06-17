import { NextResponse } from 'next/server';
import { getExperiences } from '@/lib/portfolio-data';

export async function GET() {
  const experiences = await getExperiences();
  return NextResponse.json({ experiences });
}
