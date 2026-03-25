import { DollarSign, Percent, ArrowRightCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getTenantId } from '@/lib/session'

export default async function ComissoesPage() {
  const tenantId = await getTenantId();
  // Busca todos os barbeiros
  const barbers = await prisma.user.findMany({
    where: { role: 'BARBER', tenantId }
  });

  // Busca todos os agendamentos já pagos e finalizados
  const paidAppointments = await prisma.appointment.findMany({
    where: {
      tenantId,
      status: 'COMPLETED',
      paymentStatus: 'PAID'
    },
    include: {
      service: true
    }
  });

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // Agrupa os dados
  const commissionData = barbers.map(barber => {
    const commissionRate = (barber.commissionPercentage ?? 50) / 100;

    const myAppointments = paidAppointments.filter(app => app.barberId === barber.id);
    const totalRevenueCents = myAppointments.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const totalRevenueBRL = totalRevenueCents / 100;
    
    const commissionBRL = totalRevenueBRL * commissionRate;
    
    return {
      id: barber.id,
      name: barber.name,
      rate: commissionRate * 100,
      totalRevenue: totalRevenueBRL,
      commission: commissionBRL,
      appointmentsCount: myAppointments.length
    };
  }).sort((a, b) => b.commission - a.commission);

  const totalComissoesAtuais = commissionData.reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Comissões</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Distribuição automática de valores por profissional</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
        <div className="metric-card bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 md:p-8 shadow-xl relative">
          <DollarSign className="absolute top-8 right-8 w-12 h-12 text-zinc-800 opacity-50" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-2">A Pagar (Aberto)</p>
          <p className="text-5xl font-black text-white">{BRL.format(totalComissoesAtuais)}</p>
        </div>
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] p-8 shadow-2xl flex items-center justify-between group cursor-pointer hover:border-orange-500/50 transition-colors">
          <div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-2">Histórico de Fechamentos</p>
            <p className="text-xl font-bold text-zinc-300">Ver pagamentos passados</p>
          </div>
          <div className="bg-orange-500/10 p-4 rounded-xl text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
             <ArrowRightCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 pl-8">Profissional</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Faturamento Gerado</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Cortes Realizados</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Valor Devido (Comissão)</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 text-right pr-8">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissionData.map((data) => (
              <TableRow key={data.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <TableCell className="font-bold text-white py-6 pl-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 font-black text-lg shadow-inner">
                    {data.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-lg">{data.name}</span>
                    <div className="mt-1">
                      <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] uppercase">
                        Taxa: {data.rate}%
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300 font-bold text-lg">{BRL.format(data.totalRevenue)}</TableCell>
                <TableCell className="text-zinc-400 font-medium">{data.appointmentsCount} concluídos</TableCell>
                <TableCell>
                   <span className="text-orange-500 font-black text-xl bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20">
                     {BRL.format(data.commission)}
                   </span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20">
                    Liquidar PIX
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {commissionData.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="py-20 text-center">
                   <p className="text-xl font-bold text-zinc-400">Sem comissões abertas</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
