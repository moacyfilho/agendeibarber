import { Clock, Ban, CalendarDays, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { prisma } from "@/lib/prisma"
import { createBlockedTimeAction } from "@/app/actions"

export default async function HorariosPage() {
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER' } });
  
  const blockedTimes = await prisma.blockedTime.findMany({
    include: { barber: true },
    orderBy: { startTime: 'asc' }
  });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Horários Bloqueados</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Almoços, férias e licenças dos profissionais</p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 text-lg">
            <Ban className="mr-2 w-6 h-6" /> Novo Bloqueio
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-3xl p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-orange-500 text-3xl font-black">Bloquear Horário</DialogTitle>
              <DialogDescription className="text-zinc-400 font-medium mt-2">
                O cliente final não conseguirá agendar horários que caiam neste intervalo.
              </DialogDescription>
            </DialogHeader>

            <form action={createBlockedTimeAction} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="barberId" className="text-zinc-300 font-bold ml-1">Profissional</Label>
                <select id="barberId" name="barberId" required className="bg-zinc-900 border border-zinc-800 text-white h-12 rounded-xl text-lg px-4 focus:outline-none focus:border-orange-500">
                   <option value="" disabled selected>Selecione um Profissional...</option>
                   {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date" className="text-zinc-300 font-bold ml-1">Data</Label>
                <Input type="date" id="date" name="date" required className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl text-lg px-4" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startHour" className="text-zinc-300 font-bold ml-1">Início</Label>
                  <Input type="time" id="startHour" name="startHour" required className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl text-lg px-4" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endHour" className="text-zinc-300 font-bold ml-1">Fim</Label>
                  <Input type="time" id="endHour" name="endHour" required className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl text-lg px-4" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason" className="text-zinc-300 font-bold ml-1">Motivo (Opcional)</Label>
                <Input id="reason" name="reason" placeholder="Ex: Almoço, Médico, Folga..." className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl text-lg px-4" />
              </div>
              
              <Button type="submit" className="mt-4 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-14 rounded-xl text-lg shadow-lg">
                Bloquear Agenda
              </Button>
            </form>

          </DialogContent>
        </Dialog>
      </header>

      {/* Tabela de DB REAL */}
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 pl-8">Profissional</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Período Bloqueado</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Status/Motivo</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 text-right pr-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blockedTimes.map((block: any) => {
              const dateStr = block.startTime.toLocaleDateString('pt-BR');
              const startStr = block.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const endStr = block.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <TableRow key={block.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                  <TableCell className="font-bold text-white py-6 pl-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-lg shadow-inner">
                      <Ban className="w-6 h-6" />
                    </div>
                    <span className="text-lg">{block.barber.name}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-white text-lg">{dateStr}</p>
                    <p className="text-zinc-500 font-medium text-sm mt-0.5">Das {startStr} até {endStr}</p>
                  </TableCell>
                  <TableCell>
                     <span className="text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 text-sm">
                       {block.reason || 'S/ Motivo Definido'}
                     </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                     <form action={async () => {
                       'use server';
                       const { deleteBlockedTimeAction } = await import("@/app/actions");
                       await deleteBlockedTimeAction(block.id);
                     }}>
                        <Button type="submit" variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 w-10 h-10 rounded-xl" title="Remover Bloqueio">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                     </form>
                  </TableCell>
                </TableRow>
              );
            })}

            {blockedTimes.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="py-20 text-center">
                   <div className="flex flex-col items-center justify-center text-zinc-500">
                     <CalendarDays className="w-16 h-16 mb-4 opacity-20" />
                     <p className="text-xl font-bold text-zinc-400">Nenhum Bloqueio Ativo</p>
                     <p className="mt-2 text-sm">A agenda de todos os profissionais está totalmente livre.</p>
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
