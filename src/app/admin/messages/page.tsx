import AdminShell from '@/components/admin/AdminShell';
import MessagesManager from '@/components/admin/MessagesManager';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  let messages: any[] = [];
  try {
    messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (err) {
    console.warn('Could not load messages:', err);
  }

  // Serialize Date objects
  const serialized = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <AdminShell>
      <MessagesManager initialMessages={serialized} />
    </AdminShell>
  );
}
