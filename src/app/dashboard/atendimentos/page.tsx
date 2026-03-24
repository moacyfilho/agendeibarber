import { Search, Calendar, ChevronRight, CheckCircle2, XCircle, CreditCard, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { updateAppointmentStatusAction, updateAppointmentPaymentStatusAction, deleteAppointmentAction } from "@/app/actions"

export default async function AtendimentosPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      customer: true,
      barber: true,
      service: true
    },
    orderBy: {
      scheduledAt: 'desc'
    }
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-zinc-50 mb-2 flex items-center gap-3">
            <Calendar className="text-orange-500 w-10 h-10" /> Gestão de Atendimentos
          </h2>
          <p className="text-zinc-400 font-medium text-lg">Histórico completo de agendamentos e status da barbearia.</p>
        </div>
      </header>

      {/* Tabela de DB REAL */}
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 pl-8">Cliente</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Serviço & Profissional</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Data & Hora</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Valor & Pagamento</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 text-right pr-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => {
              const timeStr = appointment.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const dateStr = appointment.scheduledAt.toLocaleDateString('pt-BR');
              
              const isCompleted = appointment.status === 'COMPLETED';
              const isCancelled = appointment.status === 'CANCELLED';
              const isPaid = appointment.paymentStatus === 'PAID';

              return (
                <TableRow key={appointment.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                  <TableCell className="font-bold text-white py-6 pl-8 flex items-center gap-4">
                    <div className={"w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-inner border " + 
                      (isCompleted ? "bg-green-500/10 border-green-500/30 text-green-500" : isCancelled ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-zinc-900 border-zinc-800 text-orange-500")
                    }>
                      {appointment.customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-lg">{appointment.customer.name}</span>
                      <div className="mt-1">
                        <Badge className={"text-[10px] uppercase " + 
                          (isCompleted ? "bg-green-500/10 text-green-400 border-green-500/20" : isCancelled ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20")
                        }>
                          {appointment.status === 'CONFIRMED' ? 'Pendente' : appointment.status === 'COMPLETED' ? 'Finalizado' : 'Cancelado'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-zinc-300 font-bold text-base">{appointment.service.name}</p>
                    <p className="text-zinc-500 font-medium text-sm flex items-center gap-1 mt-0.5">
                      <ChevronRight className="w-4 h-4" /> c/ {appointment.barber.name}
                    </p>
                  </TableCell>
                  <TableCell>
                     <p className="font-black text-white text-xl">{timeStr}</p>
                     <p className="text-zinc-500 font-medium text-sm mt-0.5">{dateStr}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-zinc-300 font-bold text-lg">{(appointment.totalPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <Badge className={"mt-1 text-[10px] uppercase font-bold " + 
                       (isPaid ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700")
                    }>
                      {isPaid ? 'Pago' : 'Aguardando'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      
                      {/* Marcar como Completo */}
                      {!isCompleted && !isCancelled && (
                        <form action={updateAppointmentStatusAction.bind(null, appointment.id, 'COMPLETED')}>
                           <Button type="submit" variant="ghost" size="icon" className="text-green-500 hover:text-green-400 hover:bg-green-500/10 w-10 h-10 rounded-xl" title="Finalizar Atendimento">
                             <CheckCircle2 className="w-5 h-5" />
                           </Button>
                        </form>
                      )}

                      {/* Marcar como Pago */}
                      {!isPaid && !isCancelled && (
                        <form action={updateAppointmentPaymentStatusAction.bind(null, appointment.id, 'PAID')}>
                           <Button type="submit" variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 w-10 h-10 rounded-xl" title="Confirmar Pagamento">
                             <CreditCard className="w-5 h-5" />
                           </Button>
                        </form>
                      )}

                      {/* Cancelar */}
                      {!isCancelled && (
                        <form action={updateAppointmentStatusAction.bind(null, appointment.id, 'CANCELLED')}>
                           <Button type="submit" variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 w-10 h-10 rounded-xl" title="Cancelar Agendamento">
                             <XCircle className="w-5 h-5" />
                           </Button>
                        </form>
                      )}

                      {/* Deletar Totalmente */}
                      <form action={deleteAppointmentAction.bind(null, appointment.id)}>
                         <Button type="submit" variant="ghost" size="icon" className="text-zinc-600 hover:text-red-600 hover:bg-red-600/10 w-10 h-10 rounded-xl" title="Excluir Definitivamente">
                           <Trash2 className="w-5 h-5" />
                         </Button>
                      </form>

                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {appointments.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="py-20 text-center">
                   <div className="flex flex-col items-center justify-center text-zinc-500">
                     <Calendar className="w-16 h-16 mb-4 opacity-20" />
                     <p className="text-xl font-bold text-zinc-400">Nenhum Atendimento Encontrado</p>
                     <p className="mt-2 text-sm">Os agendamentos aparecerão aqui automaticamente.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </div>
    </div>
  );
}
