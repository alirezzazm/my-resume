'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  personalInfo as staticPersonal,
  skills as staticSkills,
  experiences as staticExperiences,
  projects as staticProjects,
  blogPosts as staticBlog,
} from '@/data/portfolio';

interface SiteData {
  settings: typeof staticPersonal;
  skills: any[];
  experiences: any[];
  projects: any[];
  posts: any[];
  loaded: boolean;
}

const initial: SiteData = {
  settings: staticPersonal,
  skills: staticSkills,
  experiences: staticExperiences,
  projects: staticProjects as any,
  posts: staticBlog as any,
  loaded: false,
};

const Ctx = createContext<SiteData>(initial);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(initial);

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetch('/api/settings').then((r) => r.json()).catch(() => null),
      fetch('/api/skills').then((r) => r.json()).catch(() => null),
      fetch('/api/experiences').then((r) => r.json()).catch(() => null),
      fetch('/api/projects').then((r) => r.json()).catch(() => null),
      fetch('/api/blog').then((r) => r.json()).catch(() => null),
    ]).then(([settings, skills, experiences, projects, blog]) => {
      if (!alive) return;
      setData({
        settings: settings?.settings ?? staticPersonal,
        skills: skills?.skills?.length ? skills.skills : staticSkills,
        experiences: experiences?.experiences?.length ? experiences.experiences : staticExperiences,
        projects: projects?.projects?.length ? projects.projects : (staticProjects as any),
        posts: blog?.posts?.length ? blog.posts : (staticBlog as any),
        loaded: true,
      });
    });

    return () => { alive = false; };
  }, []);

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export const useSiteData = () => useContext(Ctx);
