'use client';

import { motion } from 'framer-motion';
import { Code2, Server, Smartphone, Cloud, Database, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';
import type { SkillCategory } from '@/lib/dataHelpers';

const categoryIcons: Record<SkillCategory, any> = {
  frontend: Code2,
  backend: Server,
  mobile: Smartphone,
  devops: Cloud,
  database: Database,
  tools: Wrench,
};

export default function Skills() {
  const { t } = useLanguage();
  const { skills } = useSiteData();
  const categories: SkillCategory[] = ['frontend', 'backend', 'mobile', 'devops', 'database', 'tools'];

  return (
    <section id="skills" className="section-padding bg-slate-50 dark:bg-slate-900/50 relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">{t.skills.subtitle}</span>
          <h2 className="heading-2"><span className="gradient-text">{t.skills.title}</span></h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = categoryIcons[cat];
            const items = skills.filter((s) => s.category === cat);
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-md">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold">{t.skills.categories[cat]}</h3>
                </div>

                <ul className="space-y-3">
                  {items.map((s) => (
                    <li key={s.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-slate-500 dark:text-slate-400">{s.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
