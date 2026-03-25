import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { ProdutosClient } from './ProdutosClient';

export const dynamic = 'force-dynamic';

export default async function ProdutosPage() {
  const tenantId = await getTenantId();
  const produtos = await prisma.product.findMany({
    where: { tenantId },
    orderBy: { stock: 'asc' },
  });

  return <ProdutosClient initialProdutos={produtos} />;
}
