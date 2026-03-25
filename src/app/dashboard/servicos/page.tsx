import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { ServicosClient } from './ServicosClient';

export const dynamic = 'force-dynamic';

export default async function ServicosPage() {
  const tenantId = await getTenantId();
  const servicos = await prisma.service.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });

  return <ServicosClient initialServicos={servicos} />;
}
