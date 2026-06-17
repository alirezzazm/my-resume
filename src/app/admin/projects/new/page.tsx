import AdminShell from '@/components/admin/AdminShell';
import ProjectForm from '@/components/admin/ProjectForm';

export const dynamic = 'force-dynamic';

export default function NewProject() {
  return (
    <AdminShell>
      <ProjectForm mode="create" />
    </AdminShell>
  );
}
