import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ProjectForm from '@/components/admin/ProjectForm';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function EditProject({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <AdminShell>
      <ProjectForm
        mode="edit"
        initial={{
          id: project!.id,
          titleFa: project!.titleFa,
          titleEn: project!.titleEn,
          descriptionFa: project!.descriptionFa,
          descriptionEn: project!.descriptionEn,
          longDescFa: project!.longDescFa ?? undefined,
          longDescEn: project!.longDescEn ?? undefined,
          featuresFa: project!.featuresFa ?? undefined,
          featuresEn: project!.featuresEn ?? undefined,
          challengesFa: project!.challengesFa ?? undefined,
          challengesEn: project!.challengesEn ?? undefined,
          image: project!.image,
          gallery: project!.gallery,
          technologies: project!.technologies,
          category: project!.category,
          liveUrl: project!.liveUrl ?? undefined,
          codeUrl: project!.codeUrl ?? undefined,
          appStore: project!.appStore ?? undefined,
          playStore: project!.playStore ?? undefined,
          featured: project!.featured,
          date: project!.date ?? undefined,
          roleFa: project!.roleFa ?? undefined,
          roleEn: project!.roleEn ?? undefined,
          durationFa: project!.durationFa ?? undefined,
          durationEn: project!.durationEn ?? undefined,
          clientFa: project!.clientFa ?? undefined,
          clientEn: project!.clientEn ?? undefined,
          order: project!.order,
          published: project!.published,
        }}
      />
    </AdminShell>
  );
}
