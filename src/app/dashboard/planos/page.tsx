'use server';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { PlanosList } from './PlanosList';

export const dynamic = 'force-dynamic';

export default async function PlanosPage() {
  const tenantId = await getTenantId();
  const planos = await prisma.membershipPlan.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'asc' },
  });

  return <PlanosList initialPlanos={planos} />;
}
