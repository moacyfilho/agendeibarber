import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { ClientesClient } from './ClientesClient';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const tenantId = await getTenantId();
  const clientes = await prisma.user.findMany({
    where: { role: 'CUSTOMER', tenantId },
    orderBy: { name: 'asc' },
    include: {
      loyaltyCards: {
        where: { tenantId },
        select: { totalVisits: true, rewardThreshold: true },
      },
      appointmentsAsCustomer: {
        where: { tenantId },
        orderBy: { scheduledAt: 'desc' },
        take: 10,
        select: {
          id: true,
          scheduledAt: true,
          status: true,
          totalPrice: true,
          service: { select: { name: true } },
          barber: { select: { name: true } },
        },
      },
    },
  });

  // Serializa datas para JSON
  const serialized = clientes.map(c => ({
    ...c,
    appointmentsAsCustomer: c.appointmentsAsCustomer.map(a => ({
      ...a,
      scheduledAt: a.scheduledAt.toISOString(),
    })),
  }));

  return <ClientesClient initialClientes={serialized as any} />;
}
