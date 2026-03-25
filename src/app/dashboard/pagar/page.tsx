import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { ContasClient } from '../contas/ContasClient';

export const dynamic = 'force-dynamic';

export default async function ContasPagarPage() {
  const tenantId = await getTenantId();
  const bills = await prisma.bill.findMany({
    where: { tenantId, type: 'PAGAR' },
    orderBy: { dueDate: 'asc' },
  });

  return <ContasClient initialBills={bills} type="PAGAR" />;
}
