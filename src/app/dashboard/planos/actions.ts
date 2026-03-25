'use server';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createMembershipPlanAction(formData: FormData) {
  const tenantId = await getTenantId();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceRaw = formData.get('price') as string;
  const billingCycle = formData.get('billingCycle') as string;
  const serviceNames = formData.get('serviceNames') as string;

  if (!name || !priceRaw) return { error: 'Nome e preço são obrigatórios.' };

  const priceInCents = Math.round(parseFloat(priceRaw.replace(',', '.')) * 100);

  await prisma.membershipPlan.create({
    data: { tenantId, name, description, priceInCents, billingCycle, serviceNames },
  });
  revalidatePath('/dashboard/planos');
  return { success: true };
}

export async function updateMembershipPlanAction(id: string, formData: FormData) {
  const tenantId = await getTenantId();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceRaw = formData.get('price') as string;
  const billingCycle = formData.get('billingCycle') as string;
  const serviceNames = formData.get('serviceNames') as string;

  const priceInCents = Math.round(parseFloat(priceRaw.replace(',', '.')) * 100);

  await prisma.membershipPlan.updateMany({
    where: { id, tenantId },
    data: { name, description, priceInCents, billingCycle, serviceNames },
  });
  revalidatePath('/dashboard/planos');
  return { success: true };
}

export async function toggleMembershipPlanAction(id: string, isActive: boolean) {
  const tenantId = await getTenantId();
  await prisma.membershipPlan.updateMany({
    where: { id, tenantId },
    data: { isActive: !isActive },
  });
  revalidatePath('/dashboard/planos');
}

export async function deleteMembershipPlanAction(id: string) {
  const tenantId = await getTenantId();
  await prisma.membershipPlan.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/planos');
}
