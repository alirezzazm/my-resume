import type { MetadataRoute } from 'next';
import { getProjects, getBlogPosts } from '@/lib/portfolio-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const baseEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/#about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/#projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/#contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ];

  // Add dynamic project pages
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects();
    projectEntries = projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {}

  // Add dynamic blog pages
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    blogEntries = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {}

  return [...baseEntries, ...projectEntries, ...blogEntries];
}
