'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function SettingsForm({ initial }: { initial: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nameFa: initial.nameFa || '',
    nameEn: initial.nameEn || '',
    titleFa: initial.titleFa || '',
    titleEn: initial.titleEn || '',
    email: initial.email || '',
    phone: initial.phone || '',
    locationFa: initial.locationFa || '',
    locationEn: initial.locationEn || '',
    bioFa: initial.bioFa || '',
    bioEn: initial.bioEn || '',
    avatar: initial.avatar || '/avatar.jpg',
    resumeUrl: initial.resumeUrl || '/cv.pdf',
    github: initial.github || '',
    linkedin: initial.linkedin || '',
    twitter: initial.twitter || '',
    telegram: initial.telegram || '',
    instagram: initial.instagram || '',
    statsYears: initial.statsYears ?? 0,
    statsProjects: initial.statsProjects ?? 0,
    statsClients: initial.statsClients ?? 0,
    statsCoffee: initial.statsCoffee ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (k: string, v: any) => setForm({ ...form, [k]: v });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-extrabold mb-1">تنظیمات شخصی</h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">// اطلاعات نمایش داده شده در سایت</p>
      </header>

      <Card title="هویت">
        <Field label="نام فارسی"><input value={form.nameFa} onChange={(e) => update('nameFa', e.target.value)} className={inp} /></Field>
        <Field label="Name (English)"><input dir="ltr" value={form.nameEn} onChange={(e) => update('nameEn', e.target.value)} className={inp} /></Field>
        <Field label="عنوان شغلی فارسی"><input value={form.titleFa} onChange={(e) => update('titleFa', e.target.value)} className={inp} /></Field>
        <Field label="Job Title (English)"><input dir="ltr" value={form.titleEn} onChange={(e) => update('titleEn', e.target.value)} className={inp} /></Field>
      </Card>

      <Card title="تماس">
        <Field label="ایمیل"><input dir="ltr" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inp} /></Field>
        <Field label="تلفن"><input dir="ltr" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inp} /></Field>
        <Field label="موقعیت (فارسی)"><input value={form.locationFa} onChange={(e) => update('locationFa', e.target.value)} className={inp} /></Field>
        <Field label="Location (English)"><input dir="ltr" value={form.locationEn} onChange={(e) => update('locationEn', e.target.value)} className={inp} /></Field>
      </Card>

      <Card title="بیوگرافی">
        <Field label="بیو فارسی" full><textarea rows={4} value={form.bioFa} onChange={(e) => update('bioFa', e.target.value)} className={inp} /></Field>
        <Field label="Bio (English)" full><textarea rows={4} dir="ltr" value={form.bioEn} onChange={(e) => update('bioEn', e.target.value)} className={inp} /></Field>
      </Card>

      <Card title="رسانه">
        <div className="md:col-span-1">
          <ImageUploader
            label="عکس پروفایل"
            value={form.avatar}
            onChange={(url) => update('avatar', url)}
            folder="avatar"
          />
        </div>
        <Field label="مسیر رزومه (PDF)">
          <input dir="ltr" value={form.resumeUrl} onChange={(e) => update('resumeUrl', e.target.value)} className={inp} />
          <p className="text-xs text-slate-500 mt-1 font-mono">PDF را در public/cv.pdf قرار بده</p>
        </Field>
      </Card>

      <Card title="شبکه‌های اجتماعی">
        <Field label="GitHub"><input dir="ltr" value={form.github} onChange={(e) => update('github', e.target.value)} className={inp} /></Field>
        <Field label="LinkedIn"><input dir="ltr" value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} className={inp} /></Field>
        <Field label="Twitter / X"><input dir="ltr" value={form.twitter} onChange={(e) => update('twitter', e.target.value)} className={inp} /></Field>
        <Field label="Telegram"><input dir="ltr" value={form.telegram} onChange={(e) => update('telegram', e.target.value)} className={inp} /></Field>
        <Field label="Instagram"><input dir="ltr" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} className={inp} /></Field>
      </Card>

      <Card title="آمار (نمایش در About)">
        <Field label="سال تجربه"><input type="number" value={form.statsYears} onChange={(e) => update('statsYears', parseInt(e.target.value) || 0)} className={inp} /></Field>
        <Field label="تعداد پروژه‌ها"><input type="number" value={form.statsProjects} onChange={(e) => update('statsProjects', parseInt(e.target.value) || 0)} className={inp} /></Field>
        <Field label="تعداد مشتریان"><input type="number" value={form.statsClients} onChange={(e) => update('statsClients', parseInt(e.target.value) || 0)} className={inp} /></Field>
        <Field label="فنجان قهوه"><input type="number" value={form.statsCoffee} onChange={(e) => update('statsCoffee', parseInt(e.target.value) || 0)} className={inp} /></Field>
      </Card>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          ذخیره تغییرات
        </button>
        {saved && (
          <span className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle2 size={16} /> ذخیره شد
          </span>
        )}
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-5">
      <h2 className="font-bold mb-3 text-brand-500 font-mono">// {title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}

const inp =
  'w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm';
