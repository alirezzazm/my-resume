'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function Experience() {
  const { t, locale, dir } = useLanguage();
  const { experiences } = useSiteData();

  const formatDate = (date: string) => {
    const [y, m] = date.split('-');
    const months = locale === 'fa'
      ? ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
      : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <section id="experience" className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">{t.experience.subtitle}</span>
          <h2 className="heading-2"><span className="gradient-text">{t.experience.title}</span></h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className={`absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-accent-500 to-brand-500 ${dir === 'rtl' ? 'right-4 md:right-1/2' : 'left-4 md:left-1/2'}`} />

          {experiences.map((exp, i) => {
            const Icon = exp.type === 'work' ? Briefcase : GraduationCap;
            const isRight = i % 2 === 0;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative pb-12 ${dir === 'rtl' ? 'pr-12 md:pr-0' : 'pl-12 md:pl-0'} md:flex md:items-center md:gap-8 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Dot */}
                <div className={`absolute w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-900 ${dir === 'rtl' ? 'right-0 md:right-1/2 md:translate-x-1/2' : 'left-0 md:left-1/2 md:-translate-x-1/2'} top-2`}>
                  <Icon size={16} />
                </div>

                <div className="md:w-1/2" />
                <div className="md:w-1/2">
                  <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-shadow">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <h3 className="text-lg font-bold">{exp.title[locale]}</h3>
                      <span className="badge">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t.experience.present}
                      </span>
                    </div>
                    <div className="text-brand-600 dark:text-brand-400 font-semibold mb-3">
                      {exp.company[locale]}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {exp.description[locale]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
