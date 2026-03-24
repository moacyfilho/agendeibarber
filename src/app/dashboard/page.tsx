import { Banknote, Users, CalendarPlus, Search, ArrowRight, Wallet, Activity, Calendar, Rocket, TrendingUp, Sparkles, MessageSquare, Star, Zap, ShoppingBag } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { OnboardingWizard } from "@/components/OnboardingWizard"

export default async function DashboardPage() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Faturamento Hoje (Consolidando Serviços + Vendas de Produtos)
  const completedToday = await prisma.appointment.findMany({
    where: {
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
  });

  const productSalesToday = await prisma.sale.findMany({
    where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    include: { items: true }
  });

  const serviceRevenue = completedToday.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const productRevenue = productSalesToday.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalRevenueToday = (serviceRevenue + productRevenue) / 100;
  
  const revenueFormatted = totalRevenueToday.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // 2. Agendamentos Hoje
  const totalAppointmentsToday = await prisma.appointment.count({
    where: {
      status: { in: ['CONFIRMED', 'COMPLETED'] },
      scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
  });

  // 3. Novos Clientes no Mês
  const newCustomersMonth = await prisma.user.count({
    where: {
      role: 'CUSTOMER',
      createdAt: { gte: startOfMonth }
    }
  });

  // 4. Agendamentos Próximos
  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'CONFIRMED',
      scheduledAt: { gte: now }
    },
    include: { customer: true, barber: true, service: true },
    orderBy: { scheduledAt: 'asc' },
    take: 3
  });

  // 5. Verifica status da assinatura do tenant
  const tenant = await prisma.tenant.findUnique({ where: { slug: 'matriz' } });
  
  // 💡 Lógica de Onboarding: Se o nome for o padrão de criação automática, mostrar Wizard
  const showOnboarding = tenant?.name === 'Matriz - Agendei Barber';

  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: tenant?.id },
    orderBy: { createdAt: 'desc' }
  });
  const isSubscribed = subscription && subscription.status === 'ACTIVE';

  return (
    <div className="p-8 md:p-14 max-w-7xl mx-auto min-h-screen space-y-12">
      
      {/* WIZARD DE BOAS-VINDAS (OPCIONAL) */}
      {showOnboarding && <OnboardingWizard tenantName={tenant?.name || ""} />}

      {/* HEADER SOFISTICADO */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10 text-white">
        <div>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-3 tracking-tight">
            {tenant?.name || "Dashboard Master"}
          </h2>
          <p className="text-zinc-400 font-medium text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
            Gestão estratégica em tempo real
          </p>
        </div>
        
        {!isSubscribed ? (
          <Link href="/dashboard/assinaturas" className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 max-w-sm shadow-[0_0_30px_rgba(249,115,22,0.15)] group transition-all hover:scale-105 active:scale-95">
            <div className="bg-[#120a0a]/90 backdrop-blur-xl px-6 py-5 rounded-[23px] flex items-center gap-5">
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-orange-400 text-sm tracking-widest uppercase">Trial Grátis</p>
                <p className="text-zinc-300 text-sm mt-0.5 whitespace-nowrap">Assine para manter o crescimento.</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r from-green-500/50 to-emerald-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <div className="bg-[#0a0c0a]/90 backdrop-blur-xl px-6 py-5 rounded-[23px] flex items-center gap-5">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 py-1.5 px-4 font-black">PLANO PRO ATIVO</Badge>
            </div>
          </div>
        )}
      </header>

      {/* MÉTRICAS DE IMPACTO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#0a0a0a] border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
           <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-zinc-900/50 group-hover:text-green-500/5 transition-colors" />
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Caixa Consolidado (Hoje)</p>
           <p className="text-5xl font-black text-white tracking-tighter">{revenueFormatted}</p>
           <p className="mt-4 text-xs font-bold text-zinc-500 flex items-center gap-2">
             <span className="text-green-500">+{serviceRevenue > 0 ? ((productRevenue / serviceRevenue) * 100).toFixed(0) : 0}%</span> em vendas de produtos extras
           </p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
           <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-zinc-900/50 group-hover:text-orange-500/5 transition-colors" />
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Taxa de Ocupação</p>
           <p className="text-5xl font-black text-white tracking-tighter">
             {Math.min(100, (totalAppointmentsToday / 12) * 100).toFixed(0)}%
           </p>
           <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{totalAppointmentsToday} / 12 slots ocupados hoje</p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
           <Star className="absolute -right-4 -bottom-4 w-32 h-32 text-zinc-900/50 group-hover:text-purple-500/5 transition-colors" />
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Novos Leads (Recorrência)</p>
           <p className="text-5xl font-black text-white tracking-tighter">{newCustomersMonth}</p>
           <p className="mt-4 text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full w-fit">Expansão Ativa</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-zinc-900 rounded-[2.5rem] p-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                 <Calendar className="text-orange-500" />Próximos da Agenda
              </h3>
              <Link href="/dashboard/agenda" className="text-xs font-black uppercase tracking-widest text-orange-500 hover:underline">Ir para Agenda Direta &rarr;</Link>
           </div>

           <div className="space-y-4">
              {appointments.map(app => (
                <div key={app.id} className="flex justify-between items-center p-6 bg-zinc-950/50 border border-zinc-900 rounded-3xl hover:border-orange-500/30 transition-all group">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center font-black text-white border border-zinc-800 transition-transform group-hover:scale-110">
                         {app.customer.name.charAt(0)}
                      </div>
                      <div>
                         <p className="font-bold text-white text-lg">{app.customer.name}</p>
                         <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-0.5">{app.service.name} / {app.barber.name}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-orange-500">{app.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">CONFIRMADO</p>
                   </div>
                </div>
              ))}
              {appointments.length === 0 && <p className="text-center py-10 text-zinc-700 font-bold italic">Nenhum atendimento eminente...</p>}
           </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-1 rounded-[2.5rem] overflow-hidden shadow-2xl">
           <div className="bg-[#050505] h-full rounded-[2.3rem] p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 shadow-glow border border-orange-500/20">
                 <Sparkles className="text-orange-500 w-10 h-10 animate-pulse" />
              </div>
              <h4 className="text-2xl font-black text-white mb-2 italic tracking-tighter">Insight Estratégico</h4>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">Baseado no seu fluxo de hoje, temos uma recomendação para sua barbearia:</p>
              
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl w-full text-left space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><MessageSquare className="text-blue-500 w-4 h-4" /></div>
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Ação Sugerida</p>
                       <p className="text-zinc-400 text-xs">Sua venda de produtos (pomadas) está crescendo. Que tal oferecer um **Combo Barba + Pomada** com 10% de desconto?</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 border-t border-zinc-800 pt-4">
                    <div className="p-2 bg-green-500/10 rounded-lg"><ShoppingBag className="text-green-500 w-4 h-4" /></div>
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Impacto Previsto</p>
                       <p className="text-zinc-400 text-xs">Pode aumentar seu faturamento diário em até **15%** sem ocupar novos horários na agenda.</p>
                    </div>
                 </div>
              </div>

              <button className="mt-8 w-full h-14 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                 <Zap className="w-5 h-5" /> ATIVAR CAMPANHA
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
