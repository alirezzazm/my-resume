import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import BlogList from '@/components/BlogList';
import { getBlogPosts } from '@/lib/portfolio-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Articles',
  description: 'Articles and tutorials about .NET, microservices, mobile development, and more.',
};

export default async function BlogIndex() {
  const posts = await getBlogPosts();
  return (
    <>
      <Navbar />
      <BlogList posts={posts} />
      <Footer />
      <ScrollToTop />
    </>
  );
}
