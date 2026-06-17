'use client';

import { Heart, Github, Linkedin, Send, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function Footer() {
  const { t, locale } = useLanguage();
  const { settings: personalInfo } = useSiteData();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-start">
          <a href="#home" className="text-2xl font-extrabold gradient-text">
            {personalInfo.name[locale]}
          </a>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            © {year} {t.footer.rights}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: Github, href: personalInfo.socials.github },
            { icon: Linkedin, href: personalInfo.socials.linkedin },
            { icon: Send, href: personalInfo.socials.telegram },
            { icon: Mail, href: `mailto:${personalInfo.email}` },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
          {t.footer.madeWith} <Heart size={14} className="text-red-500 fill-red-500" /> {t.footer.and}
          <span className="font-semibold gradient-text">Next.js</span>
        </p>
      </div>
    </footer>
  );
}
