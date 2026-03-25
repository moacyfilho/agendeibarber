'use server';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function createBarbeiroAction(formData: FormData) {
  const tenantId = await getTenantId();
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const commission = parseInt(formData.get('commission') as string) || 50;
  const valuePerHour = Math.round(parseFloat((formData.get('valuePerHour') as string || '0').replace(',', '.')) * 100);

  if (!name || !phone) return { error: 'Nome e telefone são obrigatórios.' };

  const emailFinal = email || `barbeiro_${Date.now()}@agendei.app`;

  await prisma.user.create({
    data: { tenantId, name, phone, email: emailFinal, role: 'BARBER', commissionPercentage: commission, valuePerHourInCents: valuePerHour },
  });
  revalidatePath('/dashboard/barbeiros');
  return { success: true };
}

export async function updateBarbeiroAction(id: string, formData: FormData) {
  const tenantId = await getTenantId();
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const commission = parseInt(formData.get('commission') as string) || 50;
  const valuePerHour = Math.round(parseFloat((formData.get('valuePerHour') as string || '0').replace(',', '.')) * 100);
  const specialties = formData.get('specialties') as string;

  await prisma.user.updateMany({
    where: { id, tenantId },
    data: { name, phone, email, commissionPercentage: commission, valuePerHourInCents: valuePerHour, specialties },
  });
  revalidatePath('/dashboard/barbeiros');
  return { success: true };
}

export async function setBarbeiroPasswordAction(id: string, password: string) {
  const tenantId = await getTenantId();
  if (password.length < 6) return { error: 'A senha deve ter no mínimo 6 caracteres.' };
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.updateMany({ where: { id, tenantId }, data: { passwordHash } });
  revalidatePath('/dashboard/barbeiros');
  return { success: true };
}

export async function deleteBarbeiroAction(id: string) {
  const tenantId = await getTenantId();
  await prisma.user.deleteMany({ where: { id, tenantId, role: 'BARBER' } });
  revalidatePath('/dashboard/barbeiros');
  return { success: true };
}

export async function createBlockedTimeAction(barberId: string, formData: FormData) {
  const tenantId = await getTenantId();
  const date = formData.get('date') as string;
  const startHour = formData.get('startHour') as string;
  const endHour = formData.get('endHour') as string;
  const reason = formData.get('reason') as string;

  const startTime = new Date(`${date}T${startHour}:00`);
  const endTime = new Date(`${date}T${endHour}:00`);

  if (endTime <= startTime) return { error: 'Horário de término deve ser após o início.' };

  await prisma.blockedTime.create({ data: { tenantId, barberId, startTime, endTime, reason } });
  revalidatePath('/dashboard/barbeiros');
  return { success: true };
}

export async function deleteBlockedTimeAction(id: string) {
  const tenantId = await getTenantId();
  await prisma.blockedTime.deleteMany({ where: { id, tenantId } });
  revalidatePath('/dashboard/barbeiros');
}
