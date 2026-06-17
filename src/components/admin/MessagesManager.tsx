'use client';

import { useMemo, useState } from 'react';
import {
  Mail, MailOpen, Reply, Trash2, Search, CheckCheck, Inbox,
  Loader2, AlertCircle, Calendar,
} from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type Filter = 'all' | 'unread' | 'read';

export default function MessagesManager({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Message | null>(initialMessages[0] || null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Counts
  const counts = useMemo(() => ({
    all: messages.length,
    unread: messages.filter((m) => !m.read).length,
    read: messages.filter((m) => m.read).length,
  }), [messages]);

  // Filter list
  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filter === 'unread' && m.read) return false;
      if (filter === 'read' && !m.read) return false;
      const q = query.toLowerCase();
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, query]);

  // ─── Actions ───
  const updateLocal = (id: number, patch: Partial<Message>) =>
    setMessages((arr) => arr.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const removeLocal = (id: number) =>
    setMessages((arr) => arr.filter((m) => m.id !== id));

  const markAsRead = async (m: Message) => {
    if (m.read) return;
    updateLocal(m.id, { read: true });
    await fetch(`/api/admin/messages/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
  };

  const toggleRead = async (m: Message) => {
    setActionLoading(`toggle-${m.id}`);
    const next = !m.read;
    updateLocal(m.id, { read: next });
    await fetch(`/api/admin/messages/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: next }),
    });
    setActionLoading(null);
  };

  const deleteMessage = async (m: Message) => {
    if (!confirm(`پیام «${m.subject}» را حذف کنی؟`)) return;
    setActionLoading(`del-${m.id}`);
    const res = await fetch(`/api/admin/messages/${m.id}`, { method: 'DELETE' });
    if (res.ok) {
      removeLocal(m.id);
      if (selected?.id === m.id) setSelected(null);
    }
    setActionLoading(null);
  };

  const markAllRead = async () => {
    if (counts.unread === 0) return;
    setActionLoading('read-all');
    await fetch('/api/admin/messages?action=read-all', { method: 'PATCH' });
    setMessages((arr) => arr.map((m) => ({ ...m, read: true })));
    setActionLoading(null);
  };

  const clearRead = async () => {
    if (counts.read === 0) return;
    if (!confirm('همه‌ی پیام‌های خوانده‌شده حذف شود؟')) return;
    setActionLoading('clear-read');
    await fetch('/api/admin/messages?action=clear-read', { method: 'DELETE' });
    setMessages((arr) => arr.filter((m) => !m.read));
    setActionLoading(null);
  };

  const onSelect = (m: Message) => {
    setSelected(m);
    if (!m.read) markAsRead(m);
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleString('fa-IR', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const replyMailto = (m: Message) => {
    const subject = encodeURIComponent(`Re: ${m.subject}`);
    const body = encodeURIComponent(`\n\n---\n${m.name} نوشته:\n${m.message}`);
    return `mailto:${m.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">📬 پیام‌های دریافتی</h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">
            // {counts.all} پیام · {counts.unread} خوانده‌نشده
          </p>
        </div>
        <div className="flex items-center gap-2">
          {counts.unread > 0 && (
            <button
              onClick={markAllRead}
              disabled={actionLoading === 'read-all'}
              className="text-sm px-4 py-2 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-semibold hover:bg-brand-200 dark:hover:bg-brand-900/60 inline-flex items-center gap-1.5"
            >
              {actionLoading === 'read-all' ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              همه خوانده‌شده
            </button>
          )}
          {counts.read > 0 && (
            <button
              onClick={clearRead}
              disabled={actionLoading === 'clear-read'}
              className="text-sm px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#21262d] text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-1.5"
            >
              {actionLoading === 'clear-read' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              پاک کردن خوانده‌شده‌ها
            </button>
          )}
        </div>
      </header>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-16 text-center">
          <Inbox size={56} className="text-slate-400 mx-auto mb-4" strokeWidth={1.2} />
          <p className="text-slate-500 mb-2 font-bold">صندوق ورودی خالی است</p>
          <p className="text-sm text-slate-400 font-mono">// هر پیامی که از فرم تماس بیاد اینجا نمایش داده می‌شه</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-2">
            {/* Search + filter */}
            <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-3 mb-3">
              <div className="relative mb-3">
                <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
                <input
                  type="search"
                  placeholder="جستجو..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full ps-10 pe-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-1.5">
                {([
                  { key: 'all', label: 'همه', icon: Mail, count: counts.all },
                  { key: 'unread', label: 'خوانده‌نشده', icon: Mail, count: counts.unread },
                  { key: 'read', label: 'خوانده‌شده', icon: MailOpen, count: counts.read },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                      filter === tab.key
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-[#0d1117] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      filter === tab.key ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages list */}
            <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl divide-y divide-slate-100 dark:divide-[#21262d] max-h-[70vh] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500 font-mono">// نتیجه‌ای پیدا نشد</div>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m)}
                    className={`w-full text-start p-3.5 hover:bg-slate-50 dark:hover:bg-[#0d1117]/50 transition ${
                      selected?.id === m.id ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                    } ${!m.read ? 'border-s-4 border-brand-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {!m.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />}
                        <span className={`truncate ${!m.read ? 'font-bold' : 'font-semibold'}`}>{m.name}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                        {new Date(m.createdAt).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 truncate mb-0.5">{m.subject}</div>
                    <div className="text-xs text-slate-500 truncate">{m.message}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-6 sticky top-6">
                <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-[#21262d]">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold mb-1">{selected.subject}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{selected.name}</span>
                      <a href={`mailto:${selected.email}`} className="text-brand-500 hover:underline" dir="ltr">
                        {selected.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1.5">
                      <Calendar size={11} /> {formatDate(selected.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selected.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-[#21262d] flex-wrap">
                  <a
                    href={replyMailto(selected)}
                    className="btn-primary text-sm"
                  >
                    <Reply size={14} />
                    پاسخ با ایمیل
                  </a>
                  <button
                    onClick={() => toggleRead(selected)}
                    disabled={actionLoading === `toggle-${selected.id}`}
                    className="text-sm px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0d1117] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#21262d] inline-flex items-center gap-1.5"
                  >
                    {actionLoading === `toggle-${selected.id}` ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : selected.read ? (
                      <Mail size={14} />
                    ) : (
                      <MailOpen size={14} />
                    )}
                    {selected.read ? 'علامت‌گذاری خوانده‌نشده' : 'علامت‌گذاری خوانده‌شده'}
                  </button>
                  <button
                    onClick={() => deleteMessage(selected)}
                    disabled={actionLoading === `del-${selected.id}`}
                    className="text-sm px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 inline-flex items-center gap-1.5"
                  >
                    {actionLoading === `del-${selected.id}` ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    حذف
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl p-16 text-center sticky top-6">
                <AlertCircle size={48} className="text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 font-mono">// یک پیام انتخاب کن تا جزئیاتش رو ببینی</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
