import AdminShell from '@/components/admin/AdminShell';
import ExperiencesManager from '@/components/admin/ExperiencesManager';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ExperiencesPage() {
  let items: any[] = [];
  try {
    items = await prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { startDate: 'desc' }] });
  } catch {}
  return (
    <AdminShell>
      <ExperiencesManager initial={items} />
    </AdminShell>
  );
}
