import { CalendarDays, Clock, User, CheckCircle2 } from "lucide-react"
import { BookingCalendar } from "@/components/BookingCalendar"
import { ComandaModal } from "@/components/ComandaModal"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { getTenantId } from '@/lib/session'

export default async function AgendaPage() {
  const tenantId = await getTenantId();
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER', tenantId } });
  const services = await prisma.service.findMany({ where: { isActive: true, tenantId } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: { scheduledAt: { gte: today }, tenantId },
    include: { customer: true, barber: true, service: true },
    orderBy: { scheduledAt: 'asc' }
  });

  const products = await prisma.product.findMany({ where: { isActive: true, tenantId }, orderBy: { name: 'asc' } });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Agenda</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Gerencie agendamentos e atenda seus clientes</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
        <div className="xl:col-span-3">
           <BookingCalendar barbers={barbers} services={services} />
        </div>

        <div className="xl:col-span-1 space-y-6">
           <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] p-8 shadow-2xl h-fit max-h-[70vh] flex flex-col">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                 <Clock className="text-orange-500 w-5 h-5" /> Próximos Clientes
              </h3>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                 {appointments.map(app => {
                    const time = app.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <ComandaModal 
                        key={app.id} 
                        appointment={app} 
                        products={products}
                        trigger={
                          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl hover:border-orange-500/50 transition-all group cursor-pointer text-left">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-orange-500 font-black text-lg">{time}</span>
                                <Badge className="bg-zinc-800 text-[9px] uppercase font-black text-zinc-500 border-zinc-700">{app.status}</Badge>
                             </div>
                             <p className="text-white font-bold leading-tight line-clamp-1">{app.customer.name}</p>
                             <p className="text-zinc-500 text-[10px] font-black uppercase mt-1 tracking-tighter">{app.service.name} / {app.barber.name}</p>
                             
                             <div className="mt-4 pt-4 border-t border-zinc-800 hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-2">
                                <button className="w-full bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-xl border border-orange-500/20 transition-all flex items-center justify-center gap-2">
                                   Abrir Comanda <CheckCircle2 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                        }
                      />
                    )
                 })}

                 {appointments.length === 0 && (
                   <div className="text-center py-10 text-zinc-600">
                      <p className="text-sm font-bold italic opacity-40">Agenda limpa por enquanto...</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 rounded-[2rem] text-center">
              <User className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <p className="text-white font-bold text-sm">Modo de Operação</p>
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-1">Clique num cliente para lançar produtos ou finalizar.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
