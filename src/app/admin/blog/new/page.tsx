import AdminShell from '@/components/admin/AdminShell';
import BlogForm from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default function NewBlog() {
  return (
    <AdminShell>
      <BlogForm mode="create" />
    </AdminShell>
  );
}
