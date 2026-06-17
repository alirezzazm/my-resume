'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Send, Mail, Terminal, Code2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';
import CodeEditorAnimation from './CodeEditorAnimation';

// Floating tech badges around the editor
const techBadges = [
  { label: 'C#', cls: 'top-2 -left-6', delay: 0, color: 'bg-[#239120]' },
  { label: '.NET', cls: 'top-1/4 -right-8', delay: 1, color: 'bg-[#512BD4]' },
  { label: 'Blazor', cls: 'bottom-1/3 -left-10', delay: 2, color: 'bg-[#7B0044]' },
  { label: 'MAUI', cls: 'bottom-4 right-2', delay: 1.5, color: 'bg-[#5C2D91]' },
];

// rotating typewriter titles
const titles = {
  fa: ['برنامه‌نویس .NET', 'فول‌استک دولوپر', 'متخصص میکروسرویس', 'موبایل دولوپر'],
  en: ['.NET Developer', 'Full-Stack Engineer', 'Microservices Expert', 'Mobile Developer'],
};

export default function Hero() {
  const { t, locale } = useLanguage();
  const { settings: personalInfo } = useSiteData();
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayTitle, setDisplayTitle] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing');

  // Typewriter effect for rotating titles
  useEffect(() => {
    const arr = titles[locale];
    const target = arr[titleIdx % arr.length];
    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      if (displayTitle.length < target.length) {
        timer = setTimeout(() => setDisplayTitle(target.slice(0, displayTitle.length + 1)), 80);
      } else {
        timer = setTimeout(() => setPhase('pause'), 1400);
      }
    } else if (phase === 'pause') {
      timer = setTimeout(() => setPhase('erasing'), 800);
    } else if (phase === 'erasing') {
      if (displayTitle.length > 0) {
        timer = setTimeout(() => setDisplayTitle(displayTitle.slice(0, -1)), 35);
      } else {
        setTitleIdx((i) => i + 1);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [displayTitle, phase, titleIdx, locale]);

  // Reset on language change
  useEffect(() => {
    setDisplayTitle('');
    setTitleIdx(0);
    setPhase('typing');
  }, [locale]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 dark:bg-[#0d1117]"
    >
      {/* Background blobs */}
      <div className="bg-blob w-96 h-96 bg-brand-500 -top-20 -left-20" />
      <div className="bg-blob w-96 h-96 bg-accent-500 -bottom-20 -right-20" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-start"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="badge mb-6 font-mono"
          >
            <Terminal size={12} className="inline-block ms-1 me-1.5" />
            {locale === 'fa' ? 'در دسترس برای پروژه‌های جدید' : 'Available for new projects'}
          </motion.span>

          <h1 className="heading-1 mb-4 leading-tight">
            <span className="block text-slate-900 dark:text-white">
              {locale === 'fa' ? 'سلام، من ' : "Hi, I'm "}
              <span className="gradient-text">{personalInfo.name[locale]}</span>
            </span>
            <span dir={locale === 'fa' ? 'rtl' : 'ltr'} className="block mt-3 text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-brand-500 dark:text-brand-400 min-h-[3rem]">
              <span className="text-accent-500 dark:text-accent-400">&gt;</span> {displayTitle}
              <span className="inline-block w-0.5 h-7 bg-brand-500 dark:bg-brand-400 ms-1 animate-blink align-middle" />
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            {personalInfo.bio?.[locale] || t.hero.description}
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a href="#projects" className="btn-primary">
              <Code2 size={16} />
              {t.hero.ctaProjects}
            </a>
            <a href="#contact" className="btn-outline">
              {t.hero.ctaContact}
            </a>
          </div>

          <div className="flex gap-3 mt-10 justify-center lg:justify-start">
            {[
              { icon: Github, href: personalInfo.socials.github, label: 'GitHub' },
              { icon: Linkedin, href: personalInfo.socials.linkedin, label: 'LinkedIn' },
              { icon: Send, href: personalInfo.socials.telegram, label: 'Telegram' },
              { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
            ].map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-[#161b22] shadow-md text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 border border-transparent dark:border-[#21262d] transition-colors"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Code editor animation + avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative">
            <CodeEditorAnimation />

            {/* Floating avatar in corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="absolute -top-8 -right-8 rtl:-left-8 rtl:right-auto z-20"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-brand-500/30 shadow-2xl shadow-brand-600/40 bg-gradient-to-br from-brand-500 to-accent-500">
                <img
                  src="/myimage.jpg"
                  alt={personalInfo.name[locale]}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.endsWith('/myimage.jpg')) img.src = '/myimage.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 ring-2 ring-[#0d1117] animate-pulse" />
            </motion.div>

            {/* Floating tech badges */}
            {techBadges.map((b) => (
              <motion.div
                key={b.label}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: b.delay }}
                className={`absolute ${b.cls} px-3 py-1.5 rounded-lg ${b.color} text-white font-mono text-xs font-bold shadow-xl shadow-black/30 z-10`}
              >
                {b.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-500 z-20"
      >
        <span className="text-xs font-mono">{t.hero.scroll}</span>
        <ArrowDown size={20} />
      </motion.a>
    </section>
  );
}
