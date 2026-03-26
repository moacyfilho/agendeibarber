import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { deleteBlockedTimeAction } from '@/app/actions';
import { HorariosClient } from './HorariosClient';

export const dynamic = 'force-dynamic';

const DEFAULT_SCHEDULE = {
  '1': { open: '09:00', close: '20:00' },
  '2': { open: '09:00', close: '20:00' },
  '3': { open: '09:00', close: '20:00' },
  '4': { open: '09:00', close: '20:00' },
  '5': { open: '09:00', close: '20:00' },
  '6': { open: '09:00', close: '14:00' },
  '0': null,
};

export default async function HorariosPage() {
  const tenantId = await getTenantId();

  const [tenant, barbers, blockedTimes] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId }, select: { openingHours: true } }),
    prisma.user.findMany({ where: { role: 'BARBER', tenantId }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.blockedTime.findMany({
      where: { tenantId },
      include: { barber: { select: { name: true } } },
      orderBy: { startTime: 'asc' },
    }),
  ]);

  // Parse openingHours JSON or use default
  let schedule = DEFAULT_SCHEDULE;
  if (tenant?.openingHours) {
    try {
      const parsed = JSON.parse(tenant.openingHours);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        schedule = parsed;
      }
    } catch {
      // Use default if invalid JSON
    }
  }

  const serializedBlocks = blockedTimes.map(b => ({
    ...b,
    startTime: b.startTime,
    endTime: b.endTime,
  }));

  async function deleteBlock(id: string) {
    'use server';
    await deleteBlockedTimeAction(id);
  }

  return (
    <HorariosClient
      initialSchedule={schedule}
      blockedTimes={serializedBlocks as any}
      barbers={barbers}
      deleteBlockedTime={deleteBlock}
    />
  );
}
