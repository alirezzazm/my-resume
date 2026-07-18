'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Trash2, Loader2, Star, Plus, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

export interface ProjectFormData {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  longDescFa?: string;
  longDescEn?: string;
  featuresFa?: string;
  featuresEn?: string;
  challengesFa?: string;
  challengesEn?: string;
  image: string;
  gallery?: string;
  technologies: string;
  category: string;
  liveUrl?: string;
  codeUrl?: string;
  appStore?: string;
  playStore?: string;
  featured: boolean;
  date?: string;
  roleFa?: string;
  roleEn?: string;
  durationFa?: string;
  durationEn?: string;
  clientFa?: string;
  clientEn?: string;
  order: number;
  published: boolean;
}

const emptyForm: ProjectFormData = {
  id: '', titleFa: '', titleEn: '', descriptionFa: '', descriptionEn: '',
  image: '', technologies: '', category: 'web', featured: false, order: 0, published: true,
};

export default function ProjectForm({
  initial,
  mode = 'create',
}: {
  initial?: Partial<ProjectFormData>;
  mode?: 'create' | 'edit';
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>({ ...emptyForm, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const url = mode === 'create'
        ? '/api/admin/projects'
        : `/api/admin/projects/${initial?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا');
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('آیا مطمئنی این پروژه را حذف کنی؟')) return;
    setLoading(true);
    await fetch(`/api/admin/projects/${initial?.id}`, { method: 'DELETE' });
    router.push('/admin/projects');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-500 font-mono">
          <ArrowLeft size={16} /> بازگشت
        </Link>
        <h1 className="text-2xl font-extrabold">
          {mode === 'create' ? 'افزودن پروژه‌ی جدید' : 'ویرایش پروژه'}
        </h1>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">{error}</div>}

      <Section title="اطلاعات پایه">
        <Field label="شناسه (id) *" hint="انگلیسی، با - مثل my-project">
          <input
            type="text" required dir="ltr"
            value={form.id} onChange={(e) => update('id', e.target.value)}
            disabled={mode === 'edit'}
            className={inputCls}
          />
        </Field>
        <Field label="دسته‌بندی *">
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputCls}>
            <option value="web">وب‌سایت</option>
            <option value="mobile">موبایل</option>
            <option value="desktop">دسکتاپ</option>
            <option value="enterprise">سازمانی</option>
          </select>
        </Field>

        <Field label="عنوان فارسی *">
          <input type="text" required value={form.titleFa} onChange={(e) => update('titleFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Title (English) *">
          <input type="text" required dir="ltr" value={form.titleEn} onChange={(e) => update('titleEn', e.target.value)} className={inputCls} />
        </Field>

        <Field label="توضیح کوتاه فارسی *" full>
          <textarea required rows={2} value={form.descriptionFa} onChange={(e) => update('descriptionFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Short Description (English) *" full>
          <textarea required rows={2} dir="ltr" value={form.descriptionEn} onChange={(e) => update('descriptionEn', e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="رسانه و لینک‌ها">
        <div className="md:col-span-2">
          <ImageUploader
            label="تصویر اصلی پروژه"
            value={form.image}
            onChange={(url) => update('image', url)}
            folder="projects"
            hint="بهترین ابعاد: 1200×800"
          />
        </div>

        <div className="md:col-span-2">
          <GalleryUploader
            value={form.gallery || ''}
            onChange={(v: any) => update('gallery', v)}
          />
        </div>

        <Field label="لینک Live Demo">
          <input type="url" dir="ltr" value={form.liveUrl || ''} onChange={(e) => update('liveUrl', e.target.value)} className={inputCls} />
        </Field>
        <Field label="لینک GitHub">
          <input type="url" dir="ltr" value={form.codeUrl || ''} onChange={(e) => update('codeUrl', e.target.value)} className={inputCls} />
        </Field>

        <Field label="لینک App Store">
          <input type="url" dir="ltr" value={form.appStore || ''} onChange={(e) => update('appStore', e.target.value)} className={inputCls} />
        </Field>
        <Field label="لینک Play Store">
          <input type="url" dir="ltr" value={form.playStore || ''} onChange={(e) => update('playStore', e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="تکنولوژی‌ها و متادیتا">
        <Field label="تکنولوژی‌ها" hint="با کاما (,) جدا کن. مثل: React, Node.js, MongoDB" full>
          <input type="text" dir="ltr" value={form.technologies} onChange={(e) => update('technologies', e.target.value)} className={inputCls} />
        </Field>

        <Field label="تاریخ">
          <input type="text" dir="ltr" placeholder="2024 — present" value={form.date || ''} onChange={(e) => update('date', e.target.value)} className={inputCls} />
        </Field>
        <Field label="نقش (فارسی)">
          <input type="text" value={form.roleFa || ''} onChange={(e) => update('roleFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Role (English)">
          <input type="text" dir="ltr" value={form.roleEn || ''} onChange={(e) => update('roleEn', e.target.value)} className={inputCls} />
        </Field>

        <Field label="مدت زمان (فارسی)">
          <input type="text" placeholder="۳ ماه" value={form.durationFa || ''} onChange={(e) => update('durationFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Duration (English)">
          <input type="text" dir="ltr" placeholder="3 months" value={form.durationEn || ''} onChange={(e) => update('durationEn', e.target.value)} className={inputCls} />
        </Field>

        <Field label="کارفرما (فارسی)">
          <input type="text" value={form.clientFa || ''} onChange={(e) => update('clientFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Client (English)">
          <input type="text" dir="ltr" value={form.clientEn || ''} onChange={(e) => update('clientEn', e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="جزئیات کامل (برای صفحه‌ی detail)">
        <Field label="توضیح بلند فارسی" hint="برای جدا کردن پاراگراف‌ها از خط جدید مضاعف استفاده کن" full>
          <textarea rows={5} value={form.longDescFa || ''} onChange={(e) => update('longDescFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Long Description (English)" full>
          <textarea rows={5} dir="ltr" value={form.longDescEn || ''} onChange={(e) => update('longDescEn', e.target.value)} className={inputCls} />
        </Field>

        <Field label="ویژگی‌ها (فارسی)" hint="هر ویژگی در یک خط جدا" full>
          <textarea rows={5} value={form.featuresFa || ''} onChange={(e) => update('featuresFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Features (English)" full>
          <textarea rows={5} dir="ltr" value={form.featuresEn || ''} onChange={(e) => update('featuresEn', e.target.value)} className={inputCls} />
        </Field>

        <Field label="چالش‌ها (فارسی)" hint="هر چالش در یک خط" full>
          <textarea rows={3} value={form.challengesFa || ''} onChange={(e) => update('challengesFa', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Challenges (English)" full>
          <textarea rows={3} dir="ltr" value={form.challengesEn || ''} onChange={(e) => update('challengesEn', e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="تنظیمات نمایش">
        <Field label="ترتیب نمایش">
          <input type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value) || 0)} className={inputCls} />
        </Field>
        <div className="flex items-center gap-6 pt-7">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="w-4 h-4 accent-brand-500" />
            <Star size={14} className="text-amber-500" /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="w-4 h-4 accent-brand-500" />
            منتشر شود
          </label>
        </div>
      </Section>

      <div className="flex items-center justify-between gap-3 pt-4">
        {mode === 'edit' && (
          <button type="button" onClick={onDelete} disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 text-sm font-semibold">
            <Trash2 size={16} /> حذف پروژه
          </button>
        )}
        <button type="submit" disabled={loading} className="btn-primary ms-auto">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {mode === 'create' ? 'ایجاد پروژه' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-brand-500">#</span> {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, full, children }: { label: string; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1 font-mono">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition text-sm';

// ─── Gallery Uploader (multiple images) ───
function GalleryUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const items = value.split('\n').filter(Boolean);
  const setItems = (arr: string[]) => onChange(arr.join('\n'));

  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">گالری تصاویر اضافی</label>
      <div className="grid sm:grid-cols-3 gap-3">
        {items.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="" className="w-full h-28 object-cover rounded-lg border border-slate-200 dark:border-[#21262d]" />
            <button
              type="button"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="absolute top-1.5 end-1.5 p-1.5 rounded-md bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition"
              aria-label="حذف"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <ImageUploader
          value=""
          onChange={(url) => url && setItems([...items, url])}
          folder="gallery"
          className="h-32"
        />
      </div>
      <p className="text-xs text-slate-500 mt-2 font-mono">// {items.length} تصویر</p>
    </div>
  );
}
