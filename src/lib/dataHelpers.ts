// Helper برای تبدیل ردیف Prisma به ساختار portfolio.ts
// (مدل‌های ما در DB از فیلدهای flat استفاده می‌کنند، در حالی که
// frontend ساختار تو در تو با fa/en انتظار دارد)

import type { Project as DbProject, Skill as DbSkill, Experience as DbExperience, BlogPost as DbBlogPost, Settings as DbSettings } from '@prisma/client';

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'enterprise';
export type SkillCategory = 'backend' | 'frontend' | 'mobile' | 'database' | 'devops' | 'tools';

export interface Project {
  id: string;
  title: { fa: string; en: string };
  description: { fa: string; en: string };
  image: string;
  technologies: string[];
  category: ProjectCategory;
  liveUrl?: string;
  codeUrl?: string;
  appStore?: string;
  playStore?: string;
  featured?: boolean;
  date?: string;
  longDescription?: { fa: string[]; en: string[] };
  gallery?: string[];
  features?: { fa: string[]; en: string[] };
  challenges?: { fa: string[]; en: string[] };
  role?: { fa: string; en: string };
  duration?: { fa: string; en: string };
  client?: { fa: string; en: string };
}

export interface Skill {
  id?: number;
  name: string;
  level: number;
  category: SkillCategory;
}

export interface ExperienceItem {
  id: string;
  type: 'work' | 'education';
  title: { fa: string; en: string };
  company: { fa: string; en: string };
  startDate: string;
  endDate: string | null;
  description: { fa: string; en: string };
  technologies: string[];
}

export interface BlogPostType {
  id: string;
  slug: string;
  title: { fa: string; en: string };
  excerpt: { fa: string; en: string };
  content?: { fa: string; en: string };
  date: string;
  readTime: number;
  cover: string;
  tags: string[];
}

const splitParas = (s?: string | null) => (s ? s.split('\n\n').filter(Boolean) : []);
const splitLines = (s?: string | null) => (s ? s.split('\n').filter(Boolean) : []);
const splitCsv = (s?: string | null) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);

export function dbToProject(p: DbProject): Project {
  return {
    id: p.id,
    title: { fa: p.titleFa, en: p.titleEn },
    description: { fa: p.descriptionFa, en: p.descriptionEn },
    image: p.image,
    technologies: splitCsv(p.technologies),
    category: p.category as ProjectCategory,
    liveUrl: p.liveUrl ?? undefined,
    codeUrl: p.codeUrl ?? undefined,
    appStore: p.appStore ?? undefined,
    playStore: p.playStore ?? undefined,
    featured: p.featured,
    date: p.date ?? undefined,
    longDescription: p.longDescFa || p.longDescEn ? {
      fa: splitParas(p.longDescFa),
      en: splitParas(p.longDescEn),
    } : undefined,
    features: p.featuresFa || p.featuresEn ? {
      fa: splitLines(p.featuresFa),
      en: splitLines(p.featuresEn),
    } : undefined,
    challenges: p.challengesFa || p.challengesEn ? {
      fa: splitLines(p.challengesFa),
      en: splitLines(p.challengesEn),
    } : undefined,
    gallery: splitLines(p.gallery),
    role: p.roleFa || p.roleEn ? { fa: p.roleFa ?? '', en: p.roleEn ?? '' } : undefined,
    duration: p.durationFa || p.durationEn ? { fa: p.durationFa ?? '', en: p.durationEn ?? '' } : undefined,
    client: p.clientFa || p.clientEn ? { fa: p.clientFa ?? '', en: p.clientEn ?? '' } : undefined,
  };
}

export function dbToSkill(s: DbSkill): Skill {
  return { id: s.id, name: s.name, level: s.level, category: s.category as SkillCategory };
}

export function dbToExperience(e: DbExperience): ExperienceItem {
  return {
    id: e.id,
    type: e.type as 'work' | 'education',
    title: { fa: e.titleFa, en: e.titleEn },
    company: { fa: e.companyFa, en: e.companyEn },
    startDate: e.startDate,
    endDate: e.endDate,
    description: { fa: e.descriptionFa, en: e.descriptionEn },
    technologies: splitCsv(e.technologies),
  };
}

export function dbToBlogPost(b: DbBlogPost): BlogPostType {
  return {
    id: b.id,
    slug: b.slug,
    title: { fa: b.titleFa, en: b.titleEn },
    excerpt: { fa: b.excerptFa, en: b.excerptEn },
    content: { fa: b.contentFa ?? '', en: b.contentEn ?? '' },
    date: b.date,
    readTime: b.readTime,
    cover: b.cover,
    tags: splitCsv(b.tags),
  };
}

export function dbToSettings(s: DbSettings) {
  return {
    name: { fa: s.nameFa, en: s.nameEn },
    title: { fa: s.titleFa, en: s.titleEn },
    email: s.email,
    phone: s.phone,
    location: { fa: s.locationFa, en: s.locationEn },
    bio: { fa: s.bioFa, en: s.bioEn },
    avatar: s.avatar,
    resumeUrl: s.resumeUrl,
    socials: {
      github: s.github ?? '',
      linkedin: s.linkedin ?? '',
      twitter: s.twitter ?? '',
      telegram: s.telegram ?? '',
      instagram: s.instagram ?? '',
    },
    stats: {
      years: s.statsYears,
      projects: s.statsProjects,
      clients: s.statsClients,
      coffee: s.statsCoffee,
    },
  };
}
