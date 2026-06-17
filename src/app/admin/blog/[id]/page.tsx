import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import BlogForm from '@/components/admin/BlogForm';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function EditBlog({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <AdminShell>
      <BlogForm mode="edit" initial={post} />
    </AdminShell>
  );
}
