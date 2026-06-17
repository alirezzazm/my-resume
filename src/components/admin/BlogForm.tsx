'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import ImageUploader from './ImageUploader';

const empty = {
  id: '', slug: '', titleFa: '', titleEn: '', excerptFa: '', excerptEn: '',
  contentFa: '', contentEn: '', cover: '', tags: '', readTime: 5,
  date: new Date().toISOString().slice(0, 10), published: true,
};

export default function BlogForm({ initial, mode = 'create' }: { initial?: any; mode?: 'create' | 'edit' }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...empty, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const u = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${initial?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'خطا'); setLoading(false); return; }
    router.push('/admin/blog'); router.refresh();
  };

  const onDelete = async () => {
    if (!confirm('حذف این مقاله؟')) return;
    await fetch(`/api/admin/blog/${initial?.id}`, { method: 'DELETE' });
    router.push('/admin/blog'); router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/blog" className="text-sm text-slate-600 dark:text-slate-400 inline-flex items-center gap-2 font-mono">
          <ArrowLeft size={16} /> بازگشت
        </Link>
        <h1 className="text-2xl font-extrabold">{mode === 'create' ? 'مقاله‌ی جدید' : 'ویرایش مقاله'}</h1>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 text-sm">{error}</div>}

      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-5 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Slug *</label>
          <input dir="ltr" required value={form.slug} onChange={u('slug')} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">تاریخ</label>
          <input dir="ltr" type="date" value={form.date} onChange={u('date')} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">عنوان فارسی *</label>
          <input required value={form.titleFa} onChange={u('titleFa')} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Title (English) *</label>
          <input dir="ltr" required value={form.titleEn} onChange={u('titleEn')} className={inp} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">خلاصه فارسی</label>
          <textarea rows={2} value={form.excerptFa} onChange={u('excerptFa')} className={inp} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Excerpt (English)</label>
          <textarea rows={2} dir="ltr" value={form.excerptEn} onChange={u('excerptEn')} className={inp} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">محتوای فارسی (Markdown)</label>
          <textarea rows={8} value={form.contentFa} onChange={u('contentFa')} className={`${inp} font-mono`} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Content (English, Markdown)</label>
          <textarea rows={8} dir="ltr" value={form.contentEn} onChange={u('contentEn')} className={`${inp} font-mono`} />
        </div>
        <div className="md:col-span-2">
          <ImageUploader
            label="عکس کاور"
            value={form.cover}
            onChange={(url) => setForm({ ...form, cover: url })}
            folder="blog"
            hint="ابعاد پیشنهادی: 1200×630"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">برچسب‌ها (CSV)</label>
          <input dir="ltr" value={form.tags} onChange={u('tags')} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">زمان مطالعه (دقیقه)</label>
          <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: parseInt(e.target.value) || 5 })} className={inp} />
        </div>
        <label className="flex items-center gap-2 pt-7">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-brand-500" />
          <span className="text-sm">منتشر شود</span>
        </label>
      </div>

      <div className="flex items-center justify-between gap-3">
        {mode === 'edit' && (
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 text-sm font-semibold">
            <Trash2 size={14} /> حذف
          </button>
        )}
        <button type="submit" disabled={loading} className="btn-primary ms-auto">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          ذخیره
        </button>
      </div>
    </form>
  );
}

const inp =
  'w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm';
