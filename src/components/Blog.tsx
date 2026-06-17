'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteData } from '@/contexts/SiteDataContext';

export default function Blog() {
  const { t, locale, dir } = useLanguage();
  const { posts: blogPosts } = useSiteData();
  if (!blogPosts || blogPosts.length === 0) return null;

  // Show only first 3 on home, full list on /blog
  const featured = blogPosts.slice(0, 3);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section id="blog" className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge mb-4 font-mono">
            <span className="me-1">{'<'}</span>{t.blog.subtitle}<span className="ms-1">{'/>'}</span>
          </span>
          <h2 className="heading-2"><span className="gradient-text">{t.blog.title}</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#21262d] rounded-2xl overflow-hidden h-full flex flex-col hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
              >
                <div className="relative h-44 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 overflow-hidden">
                  {post.cover && (
                    <img src={post.cover} alt={post.title[locale]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-white/95 text-2xl font-extrabold pointer-events-none -z-10">
                    📝
                  </div>
                  <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold flex items-center gap-1">
                    <Clock size={12} /> {post.readTime} {t.blog.minRead}
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

        {/* Link to full blog page */}
        {blogPosts.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/blog"
              className="btn-outline inline-flex"
            >
              {locale === 'fa' ? 'مشاهده‌ی همه‌ی مقالات' : 'View all articles'}
              <ArrowLeft size={16} className={dir === 'rtl' ? '' : 'rotate-180'} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
