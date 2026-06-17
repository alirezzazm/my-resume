import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ProjectDetail from '@/components/ProjectDetail';
import { getProject, getProjects } from '@/lib/portfolio-data';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

// متادیتای SEO اختصاصی برای هر پروژه
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProject(params.id);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title.en}`,
    description: project.description.en,
    openGraph: {
      title: project.title.en,
      description: project.description.en,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const allProjects = await getProjects();

  return (
    <>
      <Navbar />
      <ProjectDetail project={project!} allProjects={allProjects} />
      <Footer />
      <ScrollToTop />
    </>
  );
}
