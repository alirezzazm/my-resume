import type { Project, Skill, ExperienceItem, BlogPostType } from '@/lib/dataHelpers';

// این فایل به‌عنوان placeholder ساخته شده چون src/data قبلا در .gitignore بود و هرگز commit نشده بود.
// اطلاعات واقعی رو از طریق پنل /admin وارد کن (اولویت با داده‌های دیتابیس است).

export const personalInfo = {
  name: { fa: 'نام و نام خانوادگی', en: 'Your Name' },
  title: { fa: 'توسعه‌دهنده نرم‌افزار', en: 'Software Developer' },
  email: 'alireza.zamani7745@gmail.com',
  phone: '',
  location: { fa: 'ایران', en: 'Iran' },
  bio: {
    fa: 'این متن نمونه است. لطفاً از پنل ادمین ویرایش کنید.',
    en: 'This is placeholder text. Please edit it from the admin panel.',
  },
  avatar: '/avatar.jpg',
  resumeUrl: '/cv.pdf',
  socials: {
    github: '',
    linkedin: '',
    twitter: '',
    telegram: '',
    instagram: '',
  },
  stats: {
    years: 0,
    projects: 0,
    clients: 0,
    coffee: 0,
  },
};

export const skills: Skill[] = [];

export const experiences: ExperienceItem[] = [];

export const projects: Project[] = [];

export const blogPosts: BlogPostType[] = [];
