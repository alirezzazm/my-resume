'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <SiteDataProvider>{children}</SiteDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
