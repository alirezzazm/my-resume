import Link from 'next/link';
import { FolderKanban, Sparkles, Briefcase, BookOpen, Mail, ArrowLeft } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let stats = { projects: 0, skills: 0, experiences: 0, blog: 0, messages: 0 };
  try {
    stats = {
      projects: await prisma.project.count(),
      skills: await prisma.skill.count(),
      experiences: await prisma.experience.count(),
      blog: await prisma.blogPost.count(),
      messages: await prisma.contactMessage.count({ where: { read: false } }),
    };
  } catch (err) {
    console.warn('Dashboard DB error:', err);
  }

  const cards = [
    { label: 'پروژه‌ها', icon: FolderKanban, count: stats.projects, href: '/admin/projects', color: 'from-blue-500 to-cyan-500' },
    { label: 'مهارت‌ها', icon: Sparkles, count: stats.skills, href: '/admin/skills', color: 'from-pink-500 to-purple-500' },
    { label: 'سوابق کاری', icon: Briefcase, count: stats.experiences, href: '/admin/experiences', color: 'from-emerald-500 to-teal-500' },
    { label: 'مقالات بلاگ', icon: BookOpen, count: stats.blog, href: '/admin/blog', color: 'from-amber-500 to-orange-500' },
    { label: 'پیام‌های جدید', icon: Mail, count: stats.messages, href: '/admin/messages', color: 'from-rose-500 to-red-500' },
  ];

  return (
    <AdminShell>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">داشبورد</h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">// خوش اومدی! از اینجا همه‌چی رو مدیریت کن.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-6 hover:border-brand-400 dark:hover:border-brand-500 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md`}>
                <c.icon size={22} />
              </div>
              <ArrowLeft size={18} className="text-slate-400 group-hover:text-brand-500 group-hover:-translate-x-1 transition-all" />
            </div>
            <div className="text-3xl font-extrabold mb-1">{c.count}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{c.label}</div>
          </Link>
        ))}
      </div>

      <section className="mt-10 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">⚡ دسترسی سریع</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className="btn-primary text-sm">+ افزودن پروژه</Link>
          <Link href="/admin/skills" className="btn-outline text-sm">مدیریت مهارت‌ها</Link>
          <Link href="/admin/blog/new" className="btn-outline text-sm">+ مقاله‌ی جدید</Link>
          <Link href="/admin/settings" className="btn-outline text-sm">تنظیمات شخصی</Link>
        </div>
      </section>
    </AdminShell>
  );
}
