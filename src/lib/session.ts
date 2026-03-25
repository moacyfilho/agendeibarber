import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * Retorna o tenantId do usuário logado.
 * Fallback para o tenant 'matriz' em dev/sem sessão.
 */
export async function getTenantId(): Promise<string> {
  const session = await auth();
  if (session?.user && (session.user as any).tenantId) {
    return (session.user as any).tenantId;
  }
  // fallback local dev
  let tenant = await prisma.tenant.findUnique({ where: { slug: 'matriz' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: 'Matriz', slug: 'matriz' } });
  }
  return tenant.id;
}
