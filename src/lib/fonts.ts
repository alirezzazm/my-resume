// Local fonts — همه چیز در public/fonts/ ذخیره شده
// Next.js این فونت‌ها رو خودکار optimize می‌کنه: preload, subset, hash
import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    { path: '../../public/fonts/Inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Inter-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Inter-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Inter-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Inter-800.woff2', weight: '800', style: 'normal' },
    { path: '../../public/fonts/Inter-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
});

export const vazirmatn = localFont({
  src: [
    { path: '../../public/fonts/Vazirmatn-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Vazirmatn-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Vazirmatn-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Vazirmatn-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Vazirmatn-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Vazirmatn-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../../public/fonts/Vazirmatn-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  fallback: ['Tahoma', 'sans-serif'],
  preload: true,
});

export const jetbrainsMono = localFont({
  src: [
    { path: '../../public/fonts/JetBrainsMono-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/JetBrainsMono-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/JetBrainsMono-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/JetBrainsMono-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jetbrains',
  display: 'swap',
  fallback: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
  preload: false, // فقط جاهایی که نیاز هست لود می‌شه
});
