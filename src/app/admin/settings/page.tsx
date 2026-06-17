import AdminShell from '@/components/admin/AdminShell';
import SettingsForm from '@/components/admin/SettingsForm';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  let settings: any = null;
  try {
    settings = await prisma.settings.upsert({
      where: { id: 1 }, create: { id: 1 }, update: {},
    });
  } catch {
    settings = { id: 1 };
  }
  return (
    <AdminShell>
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
