import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { ContasClient } from '../contas/ContasClient';

export const dynamic = 'force-dynamic';

export default async function ContasReceberPage() {
  const tenantId = await getTenantId();
  const bills = await prisma.bill.findMany({
    where: { tenantId, type: 'RECEBER' },
    orderBy: { dueDate: 'asc' },
  });

  return <ContasClient initialBills={bills} type="RECEBER" />;
}
