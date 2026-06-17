// ساخت کاربر ادمین جدید — npm run admin:create
// قابل استفاده با env یا argv: tsx prisma/createAdmin.ts username password

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username =
    process.argv[2] || process.env.ADMIN_USERNAME || 'admin';
  const password =
    process.argv[3] || process.env.ADMIN_PASSWORD || 'changeme';

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { username },
    create: { username, password: hash, name: 'Admin' },
    update: { password: hash },
  });

  console.log('✅ Admin user ready:');
  console.log('   Username:', user.username);
  console.log('   Password:', password);
  console.log('   ⚠️  پسورد را در محیط production تغییر بده');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
