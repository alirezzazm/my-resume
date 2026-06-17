'use client';

import { motion } from 'framer-motion';
import { Award, Briefcase, Users, Coffee } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function About() {
  const { t } = useLanguage();
  const { settings: personalInfo } = useSiteData();

  const stats = [
    { icon: Award, value: personalInfo.stats.years, label: t.about.stats.years },
    { icon: Briefcase, value: personalInfo.stats.projects, label: t.about.stats.projects },
    { icon: Users, value: personalInfo.stats.clients, label: t.about.stats.clients },
    { icon: Coffee, value: personalInfo.stats.coffee, label: t.about.stats.coffee },
  ];

  return (
    <section id="about" className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">{t.about.subtitle}</span>
          <h2 className="heading-2 mb-4">
            <span className="gradient-text">{t.about.title}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5 text-lg leading-relaxed text-slate-700 dark:text-slate-300"
          >
            <p>{t.about.paragraph1}</p>
            <p>{t.about.paragraph2}</p>

            <a href={personalInfo.resumeUrl} className="btn-primary mt-6" download>
              {t.nav.resume}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl p-6 text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon size={26} />
                </div>
                <div className="text-3xl font-extrabold gradient-text">
                  +{stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
