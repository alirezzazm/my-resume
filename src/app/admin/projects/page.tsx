import Link from 'next/link';
import { Plus, Edit3, ExternalLink, Star, Globe, Smartphone, Monitor, Building2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const categoryIcons: Record<string, any> = {
  web: Globe, mobile: Smartphone, desktop: Monitor, enterprise: Building2,
};

const categoryLabels: Record<string, string> = {
  web: 'وب‌سایت', mobile: 'موبایل', desktop: 'دسکتاپ', enterprise: 'سازمانی',
};

export default async function ProjectsList() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  } catch (err) {
    console.warn('DB error:', err);
  }

  return (
    <AdminShell>
      <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">پروژه‌ها</h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">// {projects.length} پروژه ثبت شده</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={16} /> پروژه‌ی جدید
        </Link>
      </header>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-12 text-center">
          <p className="text-slate-500 mb-4">هنوز پروژه‌ای ثبت نشده.</p>
          <p className="text-sm text-slate-400 mb-6 font-mono">// برای انتقال داده‌های portfolio.ts: <code>npm run db:seed</code></p>
          <Link href="/admin/projects/new" className="btn-primary inline-flex">
            <Plus size={16} /> اولین پروژه را اضافه کن
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-[#21262d]">
            {projects.map((p) => {
              const Icon = categoryIcons[p.category] || Globe;
              return (
                <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-[#0d1117]/50 transition">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    p.category === 'web' ? 'from-blue-500 to-cyan-500' :
                    p.category === 'mobile' ? 'from-pink-500 to-purple-500' :
                    p.category === 'desktop' ? 'from-amber-500 to-orange-500' :
                    'from-emerald-500 to-teal-500'
                  } flex items-center justify-center text-white flex-shrink-0`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold truncate">{p.titleFa}</h3>
                      {p.featured && <Star size={14} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
                      {!p.published && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600">پیش‌نویس</span>}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{p.descriptionFa}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                      <span>{categoryLabels[p.category]}</span>
                      <span>·</span>
                      <span dir="ltr">{p.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d] text-slate-600 dark:text-slate-400" title="مشاهده آنلاین">
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold hover:bg-brand-200 dark:hover:bg-brand-900/60"
                    >
                      <Edit3 size={14} /> ویرایش
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
