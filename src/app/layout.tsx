import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { personalInfo } from '@/data/portfolio';
import { inter, vazirmatn, jetbrainsMono } from '@/lib/fonts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || `${personalInfo.name.en} | Portfolio`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${personalInfo.name.en}`,
  },
  description:
    'Full-Stack Developer, DevOps Engineer & Mobile Developer portfolio — modern web apps, scalable APIs and beautiful UIs.',
  keywords: [
    'Full-Stack Developer',
    'DevOps',
    'React',
    'Next.js',
    'Node.js',
    'Mobile Developer',
    'React Native',
    'Docker',
    'Portfolio',
    personalInfo.name.en,
    personalInfo.name.fa,
  ],
  authors: [{ name: personalInfo.name.en, url: SITE_URL }],
  creator: personalInfo.name.en,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fa_IR'],
    url: SITE_URL,
    title: SITE_NAME,
    description: 'Full-Stack, DevOps & Mobile Developer Portfolio',
    siteName: SITE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Full-Stack, DevOps & Mobile Developer Portfolio',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
