import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { ClientesClient } from './ClientesClient';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const tenantId = await getTenantId();
  const clientes = await prisma.user.findMany({
    where: { role: 'CUSTOMER', tenantId },
    orderBy: { createdAt: 'desc' },
    include: {
      loyaltyCards: {
        where: { tenantId },
        select: { totalVisits: true, rewardThreshold: true },
      },
    },
  });

  return <ClientesClient initialClientes={clientes} />;
}
