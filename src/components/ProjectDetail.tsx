'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Github, Calendar, User, Clock, Briefcase,
  CheckCircle2, Sparkles, Globe, Smartphone, Monitor, Building2, Tag,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Project, ProjectCategory } from '@/lib/dataHelpers';

const categoryIcons: Record<ProjectCategory, any> = {
  web: Globe, mobile: Smartphone, desktop: Monitor, enterprise: Building2,
};

const categoryColors: Record<ProjectCategory, string> = {
  web: 'from-blue-500 to-cyan-500',
  mobile: 'from-pink-500 to-purple-500',
  desktop: 'from-amber-500 to-orange-500',
  enterprise: 'from-emerald-500 to-teal-500',
};

const categoryLabels = {
  fa: { web: 'وب‌سایت', mobile: 'موبایل', desktop: 'دسکتاپ', enterprise: 'سازمانی' },
  en: { web: 'Web', mobile: 'Mobile', desktop: 'Desktop', enterprise: 'Enterprise' },
};

export default function ProjectDetail({ project, allProjects = [] }: { project: Project; allProjects?: Project[] }) {
  const { t, locale, dir } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const Icon = categoryIcons[project.category];

  // Related projects: same category, exclude current
  const related = allProjects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  const meta = [
    project.client && { icon: User, label: t.projects.client, value: project.client[locale] },
    project.role && { icon: Briefcase, label: t.projects.role, value: project.role[locale] },
    project.duration && { icon: Clock, label: t.projects.duration, value: project.duration[locale] },
    project.date && { icon: Calendar, label: locale === 'fa' ? 'تاریخ' : 'Date', value: project.date },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <article className="pt-24 pb-20 min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 dark:bg-[#0d1117] bg-slate-50" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div className="bg-blob w-96 h-96 bg-brand-500 -top-20 -left-20" />
      <div className="bg-blob w-96 h-96 bg-accent-500 -bottom-20 -right-20" />

      <div className="container-custom relative">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
          {t.projects.backToProjects}
        </Link>

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="badge font-mono">
              <Icon size={12} className="inline-block ms-1 me-1.5" />
              {categoryLabels[locale][project.category]}
            </span>
            {project.featured && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
                ⭐ Featured
              </span>
            )}
          </div>

          <h1 className="heading-1 mb-4">
            <span className="gradient-text">{project.title[locale]}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {project.description[locale]}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink size={16} />
                {t.projects.viewLive}
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Github size={16} />
                {t.projects.viewCode}
              </a>
            )}
          </div>
        </motion.header>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`relative w-full h-72 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-12 bg-gradient-to-br ${categoryColors[project.category]} shadow-2xl`}
        >
          {!imgError && project.image ? (
            <img
              src={project.image}
              alt={project.title[locale]}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              <Icon size={96} strokeWidth={1.2} className="mb-4 opacity-90" />
              <span className="text-2xl font-mono opacity-90">{project.title[locale]}</span>
            </div>
          )}
        </motion.div>

        {/* 2-column: content + sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <main className="lg:col-span-2 space-y-10">
            {/* Overview */}
            {project.longDescription && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <span className="text-brand-500">#</span>
                  {t.projects.overview}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {project.longDescription[locale].map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Features */}
            {project.features && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <Sparkles size={22} className="text-brand-500" />
                  {t.projects.keyFeatures}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.features[locale].map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d]"
                    >
                      <CheckCircle2 size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Challenges */}
            {project.challenges && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="heading-3 mb-4 flex items-center gap-2">
                  <span className="text-brand-500">⚡</span>
                  {t.projects.challenges}
                </h2>
                <ul className="space-y-2">
                  {project.challenges[locale].map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border-s-4 border-brand-500"
                    >
                      <span className="text-brand-600 dark:text-brand-400 font-mono font-bold text-xs mt-0.5">{(i + 1).toString().padStart(2, '0')}</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{c}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-3 mb-4">{t.projects.gallery}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${project.title[locale]} - ${i + 1}`}
                      className="rounded-xl w-full h-56 object-cover hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Meta info */}
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h3 className="text-base font-bold mb-4 font-mono text-brand-500">
                {'// '}info
              </h3>
              <ul className="space-y-4">
                {meta.map((m) => (
                  <li key={m.label} className="flex items-start gap-3">
                    <m.icon size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{m.label}</div>
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 break-words">{m.value}</div>
                    </div>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <Tag size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{t.projects.category}</div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {categoryLabels[locale][project.category]}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tech stack */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-bold mb-4 font-mono text-brand-500">
                {'// '}{t.projects.techStack}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-mono font-semibold border border-brand-200 dark:border-brand-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="heading-3 mb-6 flex items-center gap-2">
              <span className="text-brand-500">$</span>
              {t.projects.relatedProjects}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => {
                const PIcon = categoryIcons[p.category];
                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="group bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl overflow-hidden hover:border-brand-400 dark:hover:border-brand-500 transition-colors hover:-translate-y-1 transform"
                  >
                    <div className={`relative h-32 bg-gradient-to-br ${categoryColors[p.category]} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <PIcon size={36} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 group-hover:text-brand-500 transition-colors">{p.title[locale]}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.description[locale]}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
