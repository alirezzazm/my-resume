'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Linkedin, Mail, Copy, Check,
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BlogPostType } from '@/lib/dataHelpers';

export default function BlogPost({ post, allPosts = [] }: { post: BlogPostType; allPosts?: BlogPostType[] }) {
  const { t, locale, dir } = useLanguage();
  const [copied, setCopied] = useState(false);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const content = post.content?.[locale] || post.excerpt[locale];

  // Related posts: share at least one tag, exclude current
  const related = allPosts
    .filter((p) => p.id !== post.id && p.tags.some((tg) => post.tags.includes(tg)))
    .slice(0, 3);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = encodeURIComponent(post.title[locale]);
  const shareUrl = encodeURIComponent(url);

  const copyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="pt-24 pb-20 min-h-screen relative">
      <div className="absolute inset-0 -z-10 dark:bg-[#0d1117] bg-slate-50" />
      <div className="bg-blob w-96 h-96 bg-brand-500 -top-20 -left-20" />

      <div className="container-custom relative max-w-4xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
          {locale === 'fa' ? 'بازگشت به همه‌ی مقالات' : 'Back to all articles'}
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-mono font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="heading-1 mb-4 leading-tight">
            <span className="gradient-text">{post.title[locale]}</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {post.excerpt[locale]}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime} {t.blog.minRead}</span>
          </div>
        </motion.header>

        {/* Cover image */}
        {post.cover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden mb-10 shadow-2xl"
          >
            <img
              src={post.cover}
              alt={post.title[locale]}
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
            />
          </motion.div>
        )}

        {/* Body content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-2xl prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-code:text-brand-600 dark:prose-code:text-brand-300 prose-code:bg-slate-100 dark:prose-code:bg-[#161b22] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#21262d] prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50 dark:prose-blockquote:bg-brand-900/20 prose-blockquote:rounded-lg prose-blockquote:py-1 prose-blockquote:not-italic prose-img:rounded-xl prose-strong:text-slate-900 dark:prose-strong:text-slate-100"
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="text-slate-500 italic">{locale === 'fa' ? 'محتوای این مقاله هنوز نوشته نشده.' : 'Content for this article is not yet written.'}</p>
          )}
        </motion.div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-[#21262d]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Share2 size={16} /> {locale === 'fa' ? 'اشتراک‌گذاری:' : 'Share:'}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <button
                onClick={copyLink}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition"
                aria-label="Copy link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="heading-3 mb-6 flex items-center gap-2">
              <span className="text-brand-500">$</span>
              {locale === 'fa' ? 'مقالات مرتبط' : 'Related Articles'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group block bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl overflow-hidden hover:border-brand-400 dark:hover:border-brand-500 hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-32 bg-gradient-to-br from-brand-600 to-accent-500">
                    {p.cover && <img src={p.cover} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 group-hover:text-brand-500 transition-colors line-clamp-2">{p.title[locale]}</h3>
                    <div className="text-xs text-slate-500 mt-2 font-mono">{p.readTime} {t.blog.minRead}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
