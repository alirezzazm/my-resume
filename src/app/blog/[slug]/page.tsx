import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import BlogPost from '@/components/BlogPost';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/portfolio-data';

export const dynamic = 'force-dynamic';

interface Params { params: { slug: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title.en,
    description: post.excerpt.en,
    openGraph: {
      type: 'article',
      title: post.title.en,
      description: post.excerpt.en,
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [{ url: post.cover, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.en,
      description: post.excerpt.en,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const all = await getBlogPosts();

  return (
    <>
      <Navbar />
      <BlogPost post={post!} allPosts={all} />
      <Footer />
      <ScrollToTop />
    </>
  );
}
