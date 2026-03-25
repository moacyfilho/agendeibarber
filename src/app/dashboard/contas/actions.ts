'use server';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createBillAction(formData: FormData) {
  const tenantId = await getTenantId();
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const amountRaw = formData.get('amount') as string;
  const dueDate = formData.get('dueDate') as string;
  const category = formData.get('category') as string;
  const notes = formData.get('notes') as string;

  if (!description || !amountRaw || !dueDate) return { error: 'Preencha todos os campos obrigatórios.' };

  const amountInCents = Math.round(parseFloat(amountRaw.replace(',', '.')) * 100);

  await prisma.bill.create({
    data: { tenantId, type, description, amountInCents, dueDate: new Date(dueDate), category, notes },
  });
  revalidatePath('/dashboard/pagar');
  revalidatePath('/dashboard/receber');
  return { success: true };
}

export async function updateBillAction(id: string, formData: FormData) {
  const tenantId = await getTenantId();
  const description = formData.get('description') as string;
  const amountRaw = formData.get('amount') as string;
  const dueDate = formData.get('dueDate') as string;
  const category = formData.get('category') as string;
  const notes = formData.get('notes') as string;

  const amountInCents = Math.round(parseFloat(amountRaw.replace(',', '.')) * 100);

  await prisma.bill.updateMany({
    where: { id, tenantId },
    data: { description, amountInCents, dueDate: new Date(dueDate), category, notes },
  });
  revalidatePath('/dashboard/pagar');
  revalidatePath('/dashboard/receber');
  return { success: true };
}

export async function markBillPaidAction(id: string) {
  const tenantId = await getTenantId();
  await prisma.bill.updateMany({
    where: { id, tenantId },
    data: { status: 'PAID', paidAt: new Date() },
  });
  revalidatePath('/dashboard/pagar');
  revalidatePath('/dashboard/receber');
}

export async function deleteBillAction(id: string) {
  const tenantId = await getTenantId();
  await prisma.bill.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/pagar');
  revalidatePath('/dashboard/receber');
}
