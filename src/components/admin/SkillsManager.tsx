'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'tools', label: 'Tools' },
];

export default function SkillsManager({ initialSkills }: { initialSkills: any[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState({ name: '', level: 70, category: 'backend' });
  const [loading, setLoading] = useState<number | 'new' | null>(null);

  const addSkill = async () => {
    if (!newSkill.name) return;
    setLoading('new');
    const res = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkill),
    });
    if (res.ok) {
      const { skill } = await res.json();
      setSkills([...skills, skill]);
      setNewSkill({ name: '', level: 70, category: newSkill.category });
    }
    setLoading(null);
  };

  const updateSkill = async (id: number, data: any) => {
    setLoading(id);
    await fetch(`/api/admin/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(null);
  };

  const deleteSkill = async (id: number) => {
    if (!confirm('مطمئنی؟')) return;
    await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
    setSkills(skills.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-4xl">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">مهارت‌ها</h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">// {skills.length} مهارت</p>
      </header>

      {/* Add new */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-5 mb-6">
        <h2 className="font-bold mb-3">+ افزودن مهارت جدید</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            placeholder="نام مهارت" value={newSkill.name} dir="ltr"
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className={inputCls}
          />
          <select value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <input
            type="number" min={0} max={100} placeholder="سطح %"
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
            className={inputCls}
          />
          <button onClick={addSkill} disabled={loading === 'new'} className="btn-primary text-sm">
            {loading === 'new' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            افزودن
          </button>
        </div>
      </div>

      {/* Skills grouped by category */}
      {CATEGORIES.map((cat) => {
        const items = skills.filter((s) => s.category === cat.value);
        if (items.length === 0) return null;
        return (
          <div key={cat.value} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-5 mb-4">
            <h3 className="font-bold mb-3 text-brand-500 font-mono">// {cat.label}</h3>
            <div className="space-y-2">
              {items.map((s) => (
                <SkillRow
                  key={s.id} skill={s}
                  loading={loading === s.id}
                  onUpdate={(data) => updateSkill(s.id, data)}
                  onDelete={() => deleteSkill(s.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillRow({ skill, loading, onUpdate, onDelete }: any) {
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState(skill.level);

  return (
    <div className="flex items-center gap-3">
      <input value={name} onChange={(e) => setName(e.target.value)} dir="ltr" className={`${inputCls} flex-1`} />
      <input
        type="number" min={0} max={100} value={level}
        onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
        className={`${inputCls} w-24`}
      />
      <button onClick={() => onUpdate({ name, level })} disabled={loading} className="p-2 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      </button>
      <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

const inputCls =
  'px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-sm';
