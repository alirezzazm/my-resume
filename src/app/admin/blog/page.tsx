import Link from 'next/link';
import { Plus, Edit3, Calendar } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BlogList() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
  } catch {}

  return (
    <AdminShell>
      <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">مقالات بلاگ</h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">// {posts.length} مقاله</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm">
          <Plus size={14} /> مقاله‌ی جدید
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-12 text-center">
          <p className="text-slate-500">هنوز مقاله‌ای ثبت نشده.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl divide-y divide-slate-200 dark:divide-[#21262d]">
          {posts.map((p) => (
            <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-[#0d1117]/50">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{p.titleFa}</h3>
                <p className="text-sm text-slate-500 truncate">{p.excerptFa}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                  <Calendar size={11} />{p.date} · {p.readTime} min · /{p.slug}
                </div>
              </div>
              <Link href={`/admin/blog/${p.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold">
                <Edit3 size={14} /> ویرایش
              </Link>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
