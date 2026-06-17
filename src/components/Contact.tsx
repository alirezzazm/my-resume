'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function Contact() {
  const { t, locale } = useLanguage();
  const { settings: personalInfo } = useSiteData();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed');
      // ✅ پیام ذخیره شد — حتی اگه ایمیل نرسیده باشه، success محسوب می‌شه
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section-padding bg-slate-50 dark:bg-slate-900/50 relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">{t.contact.subtitle}</span>
          <h2 className="heading-2"><span className="gradient-text">{t.contact.title}</span></h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {[
              { icon: Mail, label: t.contact.emailLabel, value: personalInfo.email, href: `mailto:${personalInfo.email}` },
              { icon: Phone, label: t.contact.phone, value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
              { icon: MapPin, label: t.contact.location, value: personalInfo.location[locale] },
            ].map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform group block"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{item.label}</div>
                  <div className="font-semibold">{item.value}</div>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass-card rounded-2xl p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.contact.name}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.contact.email}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.contact.subject}</label>
              <input
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.contact.message}</label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? t.contact.sending : (
                <>
                  {t.contact.send} <Send size={16} />
                </>
              )}
            </button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium"
              >
                <CheckCircle2 size={18} /> {t.contact.success}
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium"
              >
                <AlertCircle size={18} /> {t.contact.error}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
