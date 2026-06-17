'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, type Locale, type TranslationKeys } from '@/data/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fa');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('locale')) as Locale | null;
    if (stored === 'fa' || stored === 'en') {
      setLocaleState(stored);
    } else {
      // Detect browser preference
      const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'fa';
      setLocaleState(browserLang.startsWith('fa') ? 'fa' : 'en');
    }
  }, []);

  useEffect(() => {
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => setLocaleState(newLocale);
  const t = translations[locale];
  const dir: 'rtl' | 'ltr' = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return ctx;
}
