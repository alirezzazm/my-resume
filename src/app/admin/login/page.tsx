'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-[#0d1117]">
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div className="bg-blob w-96 h-96 bg-brand-500 -top-20 -left-20" />
      <div className="bg-blob w-96 h-96 bg-accent-500 -bottom-20 -right-20" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-2xl shadow-brand-600/40 mb-4">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-extrabold gradient-text">Admin Panel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-2">
            // ورود به پنل مدیریت
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-[#21262d] shadow-2xl p-7 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">نام کاربری</label>
            <div className="relative">
              <User size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full ps-10 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition font-mono"
                autoComplete="username"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">رمز عبور</label>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full ps-10 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition font-mono"
                autoComplete="current-password"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> در حال ورود...</>
            ) : (
              'ورود'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4 font-mono">
          {process.env.NODE_ENV === 'development' && 'admin / changeme'}
        </p>
      </div>
    </div>
  );
}
