import AdminShell from '@/components/admin/AdminShell';
import SkillsManager from '@/components/admin/SkillsManager';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  let skills: any[] = [];
  try {
    skills = await prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  } catch {}
  return (
    <AdminShell>
      <SkillsManager initialSkills={skills} />
    </AdminShell>
  );
}
