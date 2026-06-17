'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, Sparkles, Briefcase, BookOpen, Settings as SettingsIcon,
  Mail, LogOut, Menu, X, Home,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'پروژه‌ها', icon: FolderKanban },
  { href: '/admin/skills', label: 'مهارت‌ها', icon: Sparkles },
  { href: '/admin/experiences', label: 'سوابق کاری', icon: Briefcase },
  { href: '/admin/blog', label: 'بلاگ', icon: BookOpen },
  { href: '/admin/messages', label: 'پیام‌ها', icon: Mail, badge: true },
  { href: '/admin/settings', label: 'تنظیمات', icon: SettingsIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll unread message count every 30s
  useEffect(() => {
    const fetchCount = () => {
      fetch('/api/admin/messages?unread=1')
        .then((r) => r.json())
        .then((d) => setUnreadCount(d.count ?? 0))
        .catch(() => {});
    };
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => clearInterval(id);
  }, [pathname]);

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] flex" dir="rtl">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white dark:bg-[#161b22] border-l border-slate-200 dark:border-[#21262d] sticky top-0 h-screen">
        <SidebarContent pathname={pathname} onLogout={onLogout} unreadCount={unreadCount} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#161b22] z-50 lg:hidden shadow-2xl">
            <SidebarContent pathname={pathname} onLogout={onLogout} unreadCount={unreadCount} onClose={() => setOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-[#21262d]">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d]">
            <Menu size={22} />
          </button>
          <span className="font-bold gradient-text">Admin</span>
          <Link href="/" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d]">
            <Home size={20} />
          </Link>
        </div>

        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname, onLogout, onClose, unreadCount = 0,
}: {
  pathname: string; onLogout: () => void; unreadCount?: number; onClose?: () => void;
}) {
  return (
    <>
      <div className="p-6 border-b border-slate-200 dark:border-[#21262d] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold gradient-text">Admin</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">// portfolio CMS</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d]">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d]'
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-[#21262d] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d]"
        >
          <Home size={18} /> مشاهده‌ی سایت
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={18} /> خروج
        </button>
      </div>
    </>
  );
}
