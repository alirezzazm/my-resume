'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, Search, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BlogPostType } from '@/lib/dataHelpers';

export default function BlogList({ posts }: { posts: BlogPostType[] }) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [posts]);

  // Filter posts
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchTag = !activeTag || p.tags.includes(activeTag);
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        p.title.fa.toLowerCase().includes(q) ||
        p.title.en.toLowerCase().includes(q) ||
        p.excerpt.fa.toLowerCase().includes(q) ||
        p.excerpt.en.toLowerCase().includes(q);
      return matchTag && matchQuery;
    });
  }, [posts, activeTag, query]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  return (
    <article className="pt-24 pb-20 min-h-screen relative">
      <div className="absolute inset-0 -z-10 dark:bg-[#0d1117] bg-slate-50" />
      <div className="bg-blob w-96 h-96 bg-brand-500 -top-20 -left-20" />
      <div className="bg-blob w-96 h-96 bg-accent-500 -bottom-20 -right-20" />

      <div className="container-custom relative">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="badge mb-4 font-mono">
            <span className="me-1">{'<'}</span>{t.blog.subtitle}<span className="ms-1">{'/>'}</span>
          </span>
          <h1 className="heading-1"><span className="gradient-text">{t.blog.title}</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-mono text-sm">
            {posts.length} {locale === 'fa' ? 'مقاله' : 'articles'}
          </p>
        </motion.header>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-400" />
            <input
              type="search"
              placeholder={locale === 'fa' ? 'جستجو در مقالات...' : 'Search articles...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-12 pe-4 py-3.5 rounded-xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
            />
          </div>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                !activeTag
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] text-slate-700 dark:text-slate-300 hover:border-brand-400'
              }`}
            >
              <Tag size={11} />
              {locale === 'fa' ? 'همه' : 'All'}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition ${
                  activeTag === tag
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] text-slate-700 dark:text-slate-300 hover:border-brand-400'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Posts grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 font-mono">// {locale === 'fa' ? 'هیچ مقاله‌ای یافت نشد' : 'No posts found'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl overflow-hidden flex flex-col h-full hover:border-brand-400 dark:hover:border-brand-500 hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-44 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 overflow-hidden">
                    {post.cover && (
                      <img src={post.cover} alt={post.title[locale]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-white/95 text-3xl font-extrabold pointer-events-none -z-10">📝</div>
                    <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold flex items-center gap-1">
                      <Clock size={11} /> {post.readTime} {t.blog.minRead}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-mono font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-brand-500 transition-colors line-clamp-2">
                      {post.title[locale]}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt[locale]}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-[#21262d]">
                      <span className="text-xs text-slate-500 font-mono">{formatDate(post.date)}</span>
                      <span className="text-brand-500 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t.blog.readMore} <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
