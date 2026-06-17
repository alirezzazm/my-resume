import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/portfolio-data';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}
