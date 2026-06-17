'use client';

import Link from 'next/link';
import { ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 dark:bg-[#0d1117]">
      <FileX size={80} className="text-brand-500 mb-6" strokeWidth={1.2} />
      <h1 className="text-3xl font-bold mb-2">Article not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 font-mono">// 404 — this slug does not exist</p>
      <Link href="/blog" className="btn-primary">
        <ArrowLeft size={16} />
        Back to all articles
      </Link>
    </div>
  );
}
