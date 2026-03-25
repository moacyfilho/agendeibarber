import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { BarbeirosClient } from './BarbeirosClient';

export const dynamic = 'force-dynamic';

export default async function BarbeirosPage() {
  const tenantId = await getTenantId();
  const barbers = await prisma.user.findMany({
    where: { role: 'BARBER', tenantId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { appointmentsAsBarber: true } },
      blockedTimes: {
        where: { endTime: { gte: new Date() } },
        orderBy: { startTime: 'asc' },
      },
    },
  });

  return <BarbeirosClient initialBarbers={barbers} />;
}
