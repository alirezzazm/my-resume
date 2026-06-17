// Seed script — منتقل کردن portfolio.ts به دیتابیس
// اجرا: npm run db:seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  personalInfo,
  skills,
  experiences,
  projects,
  blogPosts,
} from '../src/data/portfolio';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Admin user ───
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    create: { username, password: hash, name: personalInfo.name.en },
    update: {},
  });
  console.log(`✅ admin user: ${username}`);

  // ─── Settings ───
  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      nameFa: personalInfo.name.fa,
      nameEn: personalInfo.name.en,
      titleFa: personalInfo.title.fa,
      titleEn: personalInfo.title.en,
      email: personalInfo.email,
      phone: personalInfo.phone,
      locationFa: personalInfo.location.fa,
      locationEn: personalInfo.location.en,
      bioFa: (personalInfo as any).bio?.fa ?? '',
      bioEn: (personalInfo as any).bio?.en ?? '',
      avatar: personalInfo.avatar,
      resumeUrl: personalInfo.resumeUrl,
      github: personalInfo.socials.github,
      linkedin: personalInfo.socials.linkedin,
      twitter: personalInfo.socials.twitter,
      telegram: personalInfo.socials.telegram,
      instagram: personalInfo.socials.instagram,
      statsYears: personalInfo.stats.years,
      statsProjects: personalInfo.stats.projects,
      statsClients: personalInfo.stats.clients,
      statsCoffee: personalInfo.stats.coffee,
    },
    update: {},
  });
  console.log('✅ settings');

  // ─── Skills ───
  await prisma.skill.deleteMany();
  for (const [i, s] of skills.entries()) {
    await prisma.skill.create({
      data: { name: s.name, level: s.level, category: s.category, order: i },
    });
  }
  console.log(`✅ ${skills.length} skills`);

  // ─── Experiences ───
  await prisma.experience.deleteMany();
  for (const [i, e] of experiences.entries()) {
    await prisma.experience.create({
      data: {
        id: e.id,
        type: e.type,
        titleFa: e.title.fa,
        titleEn: e.title.en,
        companyFa: e.company.fa,
        companyEn: e.company.en,
        startDate: e.startDate,
        endDate: e.endDate,
        descriptionFa: e.description.fa,
        descriptionEn: e.description.en,
        technologies: e.technologies.join(', '),
        order: i,
      },
    });
  }
  console.log(`✅ ${experiences.length} experiences`);

  // ─── Projects ───
  await prisma.project.deleteMany();
  for (const [i, p] of projects.entries()) {
    await prisma.project.create({
      data: {
        id: p.id,
        titleFa: p.title.fa,
        titleEn: p.title.en,
        descriptionFa: p.description.fa,
        descriptionEn: p.description.en,
        longDescFa: p.longDescription?.fa.join('\n\n'),
        longDescEn: p.longDescription?.en.join('\n\n'),
        featuresFa: p.features?.fa.join('\n'),
        featuresEn: p.features?.en.join('\n'),
        challengesFa: p.challenges?.fa.join('\n'),
        challengesEn: p.challenges?.en.join('\n'),
        image: p.image,
        gallery: p.gallery?.join('\n') ?? '',
        technologies: p.technologies.join(', '),
        category: p.category,
        liveUrl: p.liveUrl,
        codeUrl: p.codeUrl,
        appStore: p.appStore,
        playStore: p.playStore,
        featured: !!p.featured,
        date: p.date,
        roleFa: p.role?.fa,
        roleEn: p.role?.en,
        durationFa: p.duration?.fa,
        durationEn: p.duration?.en,
        clientFa: p.client?.fa,
        clientEn: p.client?.en,
        order: i,
        published: true,
      },
    });
  }
  console.log(`✅ ${projects.length} projects`);

  // ─── Blog Posts ───
  await prisma.blogPost.deleteMany();
  for (const b of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: b.slug,
        titleFa: b.title.fa,
        titleEn: b.title.en,
        excerptFa: b.excerpt.fa,
        excerptEn: b.excerpt.en,
        cover: b.cover,
        tags: b.tags.join(','),
        readTime: b.readTime,
        date: b.date,
      },
    });
  }
  console.log(`✅ ${blogPosts.length} blog posts`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
