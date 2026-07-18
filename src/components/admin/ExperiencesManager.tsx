'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, Loader2, Briefcase, GraduationCap } from 'lucide-react';

const empty = {
  type: 'work', titleFa: '', titleEn: '', companyFa: '', companyEn: '',
  startDate: '', endDate: '', descriptionFa: '', descriptionEn: '', technologies: '', order: 0,
};

export default function ExperiencesManager({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [loadingId, setLoadingId] = useState<string | 'new' | null>(null);

  const onCreate = async () => {
    setLoadingId('new');
    const res = await fetch('/api/admin/experiences', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { experience } = await res.json();
      setItems([...items, experience]);
      setForm(empty);
      setCreating(false);
    }
    setLoadingId(null);
  };

  const onUpdate = async (id: string, data: any) => {
    setLoadingId(id);
    await fetch(`/api/admin/experiences/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoadingId(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm('مطمئنی؟')) return;
    await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="max-w-5xl">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">سوابق کاری و تحصیلی</h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">// {items.length} مورد</p>
        </div>
        <button onClick={() => setCreating((v) => !v)} className="btn-primary text-sm">
          <Plus size={14} /> {creating ? 'انصراف' : 'افزودن جدید'}
        </button>
      </header>

      {creating && (
        <ExpForm
          value={form} setValue={setForm}
          loading={loadingId === 'new'}
          onSubmit={onCreate}
          onCancel={() => { setCreating(false); setForm(empty); }}
        />
      )}

      <div className="space-y-3 mt-6">
        {items.map((it) => (
          <ExpRow
            key={it.id} item={it}
            loading={loadingId === it.id}
            onUpdate={(d: any) => onUpdate(it.id, d)}
            onDelete={() => onDelete(it.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ExpRow({ item, loading, onUpdate, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(item);
  const Icon = item.type === 'education' ? GraduationCap : Briefcase;
  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl">
      <button onClick={() => setOpen((v) => !v)} className="w-full p-4 flex items-center gap-3 text-start">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center flex-shrink-0">
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate">{item.titleFa}</div>
          <div className="text-sm text-slate-500 truncate">{item.companyFa} · {item.startDate} - {item.endDate || 'اکنون'}</div>
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-200 dark:border-[#21262d] p-4">
          <ExpForm
            value={form} setValue={setForm}
            loading={loading}
            onSubmit={() => onUpdate(form)}
            onCancel={() => setOpen(false)}
            extraButton={
              <button type="button" onClick={onDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold">
                <Trash2 size={14} /> حذف
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}

function ExpForm({ value, setValue, onSubmit, onCancel, loading, extraButton }: any) {
  const u = (k: string) => (e: any) => setValue({ ...value, [k]: e.target.value });
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <select value={value.type} onChange={u('type')} className={inp}>
        <option value="work">کاری</option>
        <option value="education">تحصیلی</option>
      </select>
      <input placeholder="ترتیب" type="number" value={value.order} onChange={u('order')} className={inp} />

      <input placeholder="عنوان فارسی" value={value.titleFa} onChange={u('titleFa')} className={inp} />
      <input dir="ltr" placeholder="Title (English)" value={value.titleEn} onChange={u('titleEn')} className={inp} />

      <input placeholder="شرکت/دانشگاه فارسی" value={value.companyFa} onChange={u('companyFa')} className={inp} />
      <input dir="ltr" placeholder="Company (English)" value={value.companyEn} onChange={u('companyEn')} className={inp} />

      <input dir="ltr" placeholder="Start Date — YYYY-MM" value={value.startDate} onChange={u('startDate')} className={inp} />
      <input dir="ltr" placeholder="End Date (خالی = اکنون)" value={value.endDate || ''} onChange={u('endDate')} className={inp} />

      <textarea rows={2} placeholder="توضیح فارسی" value={value.descriptionFa} onChange={u('descriptionFa')} className={`${inp} md:col-span-2`} />
      <textarea rows={2} dir="ltr" placeholder="Description (English)" value={value.descriptionEn} onChange={u('descriptionEn')} className={`${inp} md:col-span-2`} />

      <input dir="ltr" placeholder="Technologies — CSV" value={value.technologies} onChange={u('technologies')} className={`${inp} md:col-span-2`} />

      <div className="md:col-span-2 flex items-center gap-3 justify-end pt-2">
        {extraButton}
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm">انصراف</button>
        <button type="button" onClick={onSubmit} disabled={loading} className="btn-primary text-sm">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          ذخیره
        </button>
      </div>
    </div>
  );
}

const inp =
  'px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm';
