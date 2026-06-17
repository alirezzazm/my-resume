import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/portfolio-data';

// API عمومی برای دریافت لیست پروژه‌ها (با fallback به portfolio.ts)
export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}
