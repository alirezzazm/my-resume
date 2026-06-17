// Public data accessor — اول از DB می‌خواند، اگر در دسترس نبود از portfolio.ts (static) استفاده می‌کند.
// Components اصلی (Projects, Skills, ...) می‌توانند از این استفاده کنند.

import { prisma } from './db';
import {
  dbToProject, dbToSkill, dbToExperience, dbToBlogPost, dbToSettings,
  type Project, type Skill, type ExperienceItem, type BlogPostType,
} from './dataHelpers';
import * as staticData from '@/data/portfolio';

export async function getProjects(): Promise<Project[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    if (rows.length > 0) return rows.map(dbToProject);
  } catch (err) {
    console.warn('[portfolio-data] DB unavailable, using static fallback:', err);
  }
  return staticData.projects;
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const row = await prisma.project.findUnique({ where: { id } });
    if (row) return dbToProject(row);
  } catch (err) {
    console.warn('[portfolio-data] DB unavailable:', err);
  }
  return staticData.projects.find((p) => p.id === id) || null;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const rows = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
    if (rows.length > 0) return rows.map(dbToSkill);
  } catch {}
  return staticData.skills;
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const rows = await prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });
    if (rows.length > 0) return rows.map(dbToExperience);
  } catch {}
  return staticData.experiences;
}

export async function getBlogPosts(): Promise<BlogPostType[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
    });
    if (rows.length > 0) return rows.map(dbToBlogPost);
  } catch {}
  return staticData.blogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostType | null> {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    if (row) return dbToBlogPost(row);
  } catch {}
  const fallback = staticData.blogPosts.find((p) => p.slug === slug);
  return fallback ?? null;
}

export async function getSettings() {
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } });
    if (s) return dbToSettings(s);
  } catch {}
  return staticData.personalInfo;
}
