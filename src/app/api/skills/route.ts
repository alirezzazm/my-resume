import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/portfolio-data';

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json({ skills });
}
