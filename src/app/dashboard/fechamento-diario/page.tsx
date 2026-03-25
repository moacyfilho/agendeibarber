import { CalendarRange, Activity, FileText, CheckCircle2, ShoppingBag, Scissors } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"

export default async function FechamentoDiarioPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Atendimentos de hoje
  const todaysAppointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte: todayStart, lte: todayEnd }
    },
    include: {
      service: true,
      customer: true,
      barber: true
    },
    orderBy: { scheduledAt: 'asc' }
  });

  // 2. Vendas de produtos de hoje
  const todaysSales = await prisma.sale.findMany({
    where: {
      createdAt: { gte: todayStart, lte: todayEnd }
    },
    include: {
      items: { include: { product: true } }
    }
  });

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // Métricas de Atendimentos
  const totalCortesHoje = todaysAppointments.length;
  const concluídosHoje = todaysAppointments.filter(app => app.status === 'COMPLETED').length;
  const canceladosHoje = todaysAppointments.filter(app => app.status === 'CANCELLED').length;
  const pendentesHoje = todaysAppointments.filter(app => app.status === 'CONFIRMED').length;

  const pagoServicosCents = todaysAppointments
    .filter(app => app.paymentStatus === 'PAID')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);
    
  const pendenteServicosCents = todaysAppointments
    .filter(app => app.paymentStatus === 'PENDING' && app.status !== 'CANCELLED')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Métricas de Produtos
  const totalVendasProdutosCents = todaysSales.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalItensVendidos = todaysSales.reduce((acc, curr) => acc + curr.items.reduce((sum, item) => sum + item.quantity, 0), 0);

  // 3. Resumo por Barbeiro (Comissões)
  const barberStats = todaysAppointments
    .filter(app => app.status === 'COMPLETED' && app.paymentStatus === 'PAID')
    .reduce((acc: Record<string, { name: string, totalRevenue: number, totalCommission: number, count: number }>, curr) => {
      const barberId = curr.barberId;
      if (!acc[barberId]) {
        acc[barberId] = { 
          name: curr.barber.name, 
          totalRevenue: 0, 
          totalCommission: 0, 
          count: 0 
        };
      }
      acc[barberId].totalRevenue += curr.totalPrice;
      acc[barberId].totalCommission += (curr.commissionAmountInCents || 0);
      acc[barberId].count += 1;
      return acc;
    }, {});

  const totalComissoesCents = Object.values(barberStats).reduce((acc, curr) => acc + curr.totalCommission, 0);

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen text-white animate-fade-in-up">
      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon">
          <CalendarRange className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Fechamento Diário</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Resumo operacional de {todayStart.toLocaleDateString('pt-BR')}</p>
        </div>
      </header>

      {/* CARDS DE RESUMO RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <Activity className="absolute -bottom-2 -right-4 w-24 h-24 text-zinc-800 opacity-20 group-hover:scale-110 transition-transform" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Atendimentos</p>
          <p className="text-4xl font-black text-white">{totalCortesHoje}</p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-green-500/30 transition-all">
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Produtos Vendidos</p>
           <p className="text-4xl font-black text-green-400">{totalItensVendidos}</p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">A Receber Hoje</p>
          <p className="text-4xl font-black text-orange-400">{BRL.format(pendenteServicosCents / 100)}</p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Total em Comissões</p>
           <p className="text-4xl font-black text-blue-400">{BRL.format(totalComissoesCents / 100)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* RECIBO Z CONSOLIDADO */}
        <div className="col-span-1 border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-10 bg-[#030303] flex flex-col items-center shadow-2xl">
          <FileText className="w-12 h-12 text-zinc-700 mb-6" />
          <h3 className="text-2xl font-black tracking-widest uppercase text-white mb-2">Relatório Z</h3>
          <p className="text-zinc-600 text-xs font-black uppercase tracking-widest mb-10">Conferência de Caixa</p>

          <div className="w-full space-y-6">
             <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-bold flex items-center gap-2"><Scissors className="w-4 h-4"/> Serviços (Pagos)</span>
                <span className="font-black text-zinc-100">{BRL.format(pagoServicosCents / 100)}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-bold flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Produtos (PDV)</span>
                <span className="font-black text-zinc-100">{BRL.format(totalVendasProdutosCents / 100)}</span>
             </div>
             <div className="flex justify-between items-center text-sm pb-6 border-b border-zinc-900">
                <span className="text-blue-500 font-bold">Total Comissões</span>
                <span className="font-black text-blue-500">-{BRL.format(totalComissoesCents / 100)}</span>
             </div>

             <div className="pt-4 bg-zinc-950 rounded-3xl p-6 border border-zinc-900">
                <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] block mb-2 text-center">Lucro Líquido Barbearia (Hoje)</span>
                <p className="text-4xl font-black text-emerald-500 text-center leading-none tracking-tighter">
                   {BRL.format((pagoServicosCents + totalVendasProdutosCents - totalComissoesCents) / 100)}
                </p>
             </div>
          </div>

          <div className="mt-10 w-full space-y-4 border-t border-zinc-900 pt-8">
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4 text-center">Rateio por Profissional</p>
             {Object.values(barberStats).map((stat: any) => (
               <div key={stat.name} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center font-black text-[10px]">{stat.name.charAt(0)}</div>
                    <div>
                       <p className="text-xs font-bold text-white">{stat.name}</p>
                       <p className="text-[9px] text-zinc-500">{stat.count} cortes realizados</p>
                    </div>
                  </div>
                  <p className="text-xs font-black text-blue-400">{BRL.format(stat.totalCommission / 100)}</p>
               </div>
             ))}
          </div>
        </div>

        {/* TIMELINE DE HOJE */}
        <div className="col-span-1 lg:col-span-2 bg-[#0a0a0a] border border-zinc-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 text-orange-500/5 -rotate-12 select-none"><Scissors className="w-40 h-40"/></div>
          <h3 className="text-2xl font-black text-white mb-8 border-b border-zinc-900 pb-6 relative z-10 flex items-center gap-3">
             Extrato de Operações <Badge className="bg-zinc-900 border-zinc-800 text-zinc-500">Live Feed</Badge>
          </h3>
          
          <div className="flex flex-col gap-5 relative z-10">
             {/* LISTA DE SERVIÇOS */}
             <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-2">Agendamentos</p>
             {todaysAppointments.map(app => {
               const timeStr = app.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
               const isPaid = app.paymentStatus === 'PAID';
               
               return (
                 <div key={app.id} className="flex justify-between items-center bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl group hover:bg-zinc-900/30 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="text-orange-500 font-black text-2xl w-14 group-hover:scale-110 transition-transform">{timeStr}</div>
                       <div>
                          <p className="text-white font-bold">{app.customer.name}</p>
                          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-tighter mt-0.5">{app.service.name} c/ {app.barber.name}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-right">
                       <div>
                          <p className="text-white font-black">{BRL.format(app.totalPrice / 100)}</p>
                          {isPaid && <p className="text-[9px] text-emerald-500 font-bold">Comissão: {BRL.format((app.commissionAmountInCents || 0) / 100)}</p>}
                       </div>
                       {isPaid ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[9px] font-black">Pago</Badge>
                       ) : app.status === 'CANCELLED' ? (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 uppercase text-[9px] font-black">Cancelado</Badge>
                       ) : (
                          <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 uppercase text-[9px] font-black">Aberto</Badge>
                       )}
                    </div>
                 </div>
               )
             })}

             {/* LISTA DE VENDAS DE PRODUTOS */}
             <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mt-6 mb-2">Vendas de Balcão (Produtos)</p>
             {todaysSales.map(sale => (
               <div key={sale.id} className="flex justify-between items-center bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl border-l-green-500/50 border-l-4">
                  <div className="flex items-center gap-5">
                     <div className="bg-zinc-900 p-2.5 rounded-xl text-green-500"><ShoppingBag className="w-5 h-5" /></div>
                     <div>
                        <p className="text-white font-bold">{sale.items.length} item(s) vendido(s)</p>
                        <p className="text-zinc-600 text-[10px] font-black uppercase mt-0.5">
                           Venda via PDV às {sale.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                  </div>
                  <span className="text-xl font-black text-green-400">{BRL.format(sale.totalPrice / 100)}</span>
               </div>
             ))}

             {todaysAppointments.length === 0 && todaysSales.length === 0 && (
               <div className="text-center py-20 text-zinc-700 font-bold border-2 border-dashed border-zinc-900 rounded-3xl">
                  Nenhum registro encontrado para hoje.
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
