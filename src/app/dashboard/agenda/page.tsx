import { CalendarDays } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getTenantId } from '@/lib/session'
import { AgendaClient } from './AgendaClient'

export const dynamic = 'force-dynamic'

export default async function AgendaPage() {
  const tenantId = await getTenantId();

  const [barbers, services] = await Promise.all([
    prisma.user.findMany({ where: { role: 'BARBER', tenantId }, orderBy: { name: 'asc' } }),
    prisma.service.findMany({ where: { isActive: true, tenantId }, orderBy: { name: 'asc' } }),
  ]);

  // Busca agendamentos dos próximos 30 dias (suficiente para vista semanal)
  const start = new Date();
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setDate(end.getDate() + 30);
  end.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      tenantId,
      status: { not: 'CANCELLED' },
      scheduledAt: { gte: start, lte: end },
    },
    include: {
      customer: { select: { name: true, phone: true } },
      service: { select: { name: true, durationMinutes: true, priceInCents: true } },
      barber: { select: { id: true, name: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  // Serializa as datas para JSON
  const serialized = appointments.map(a => ({
    ...a,
    scheduledAt: a.scheduledAt.toISOString(),
    endTime: a.endTime ? a.endTime.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col">
      <header className="mb-5 flex items-center gap-4">
        <div className="page-header-icon">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Agenda</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Visualize e gerencie todos os agendamentos</p>
        </div>
      </header>

      <div className="flex-1">
        <AgendaClient
          barbers={barbers}
          services={services}
          initialAppointments={serialized as any}
          tenantId={tenantId}
          todayIso={new Date().toISOString()}
        />
      </div>
    </div>
  )
}
