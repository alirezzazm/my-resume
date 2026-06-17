'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Globe, Smartphone, Monitor, Building2, Calendar, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';
import type { ProjectCategory } from '@/lib/dataHelpers';

const categories: (ProjectCategory | 'all')[] = ['all', 'web', 'mobile', 'desktop', 'enterprise'];

const categoryLabels = {
  fa: { all: 'همه', web: 'وب‌سایت', mobile: 'موبایل', desktop: 'دسکتاپ', enterprise: 'سازمانی' },
  en: { all: 'All', web: 'Web', mobile: 'Mobile', desktop: 'Desktop', enterprise: 'Enterprise' },
};

const categoryIcons: Record<ProjectCategory, any> = {
  web: Globe,
  mobile: Smartphone,
  desktop: Monitor,
  enterprise: Building2,
};

const categoryColors: Record<ProjectCategory, string> = {
  web: 'from-blue-500 to-cyan-500',
  mobile: 'from-pink-500 to-purple-500',
  desktop: 'from-amber-500 to-orange-500',
  enterprise: 'from-emerald-500 to-teal-500',
};

export default function Projects() {
  const { t, locale } = useLanguage();
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { projects } = useSiteData();

  const filtered = filter === 'all' ? projects : projects.filter((p: any) => p.category === filter);

  const onImgError = (id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  return (
    <section id="projects" className="section-padding bg-slate-50 dark:bg-[#0d1117] relative">
      {/* Code-grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge mb-4 font-mono">
            <span className="me-1">{'<'}</span>
            {t.projects.subtitle}
            <span className="ms-1">{'/>'}</span>
          </span>
          <h2 className="heading-2"><span className="gradient-text">{t.projects.title}</span></h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-mono text-sm">
            {projects.length}+ {locale === 'fa' ? 'پروژه‌ی واقعی' : 'real-world projects'}
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const Icon = cat === 'all' ? null : categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  filter === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-white dark:bg-[#161b22] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#21262d] hover:border-brand-400 dark:hover:border-brand-500'
                }`}
              >
                {Icon && <Icon size={14} />}
                {categoryLabels[locale][cat]}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const Icon = categoryIcons[p.category];
              const hasImageError = imageErrors.has(p.id);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                  whileHover={{ y: -8 }}
                  className="group bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl overflow-hidden flex flex-col hover:border-brand-400 dark:hover:border-brand-500 transition-colors shadow-md hover:shadow-2xl hover:shadow-brand-500/20"
                >
                  {/* Image / placeholder */}
                  <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${categoryColors[p.category]}`}>
                    {!hasImageError && p.image ? (
                      <img
                        src={p.image}
                        alt={p.title[locale]}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => onImgError(p.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Icon size={48} className="mb-2 opacity-90" strokeWidth={1.5} />
                        <span className="text-xs font-mono opacity-75 uppercase tracking-wider">
                          {categoryLabels[locale][p.category]}
                        </span>
                      </div>
                    )}

                    {/* Overlay on hover — opens detail page */}
                    <Link
                      href={`/projects/${p.id}`}
                      aria-label={t.projects.viewDetails}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <span className="px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-semibold flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                        <ArrowUpRight size={14} />
                        {t.projects.viewDetails}
                      </span>
                    </Link>

                    {/* Featured badge */}
                    {p.featured && (
                      <span className="absolute top-3 left-3 rtl:right-3 rtl:left-auto px-2 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-md">
                        ⭐ Featured
                      </span>
                    )}

                    {/* Category badge */}
                    <span className="absolute top-3 right-3 rtl:left-3 rtl:right-auto px-2 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold flex items-center gap-1">
                      <Icon size={11} />
                      {categoryLabels[locale][p.category]}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <Link href={`/projects/${p.id}`} className="block group/title mb-2">
                      <h3 className="text-lg font-bold leading-snug group-hover/title:text-brand-500 transition-colors">{p.title[locale]}</h3>
                    </Link>
                    {p.date && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
                        <Calendar size={11} /> {p.date}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1 leading-relaxed">
                      {p.description[locale]}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-mono font-semibold">
                          {tech}
                        </span>
                      ))}
                      {p.technologies.length > 4 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          +{p.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-[#21262d]">
                      <Link
                        href={`/projects/${p.id}`}
                        className="flex-1 text-xs font-semibold flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                      >
                        <ArrowUpRight size={12} />
                        {t.projects.viewDetails}
                      </Link>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t.projects.viewLive}
                          className="text-xs font-semibold flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#21262d] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#30363d] transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {p.codeUrl && (
                        <a
                          href={p.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t.projects.viewCode}
                          className="text-xs font-semibold flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#21262d] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#30363d] transition-colors"
                        >
                          <Github size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
            <span className="tok-comment">{'// '}</span>
            {locale === 'fa'
              ? 'برای دیدن کدهای بیشتر به گیت‌هاب من سر بزن'
              : 'check my GitHub for more code'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
