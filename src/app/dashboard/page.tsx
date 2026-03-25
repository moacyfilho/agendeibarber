import { Banknote, Users, CalendarPlus, Search, ArrowRight, Wallet, Activity, Calendar, Rocket, TrendingUp, Sparkles, MessageSquare, Star, Zap, ShoppingBag, ChevronRight, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { OnboardingWizard } from "@/components/OnboardingWizard"
import { getTenantId } from '@/lib/session'

export default async function DashboardPage() {
  const tenantId = await getTenantId();
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedToday = await prisma.appointment.findMany({
    where: {
      tenantId,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
  });

  const productSalesToday = await prisma.sale.findMany({
    where: { tenantId, createdAt: { gte: startOfDay, lte: endOfDay } },
    include: { items: true }
  });

  const serviceRevenue = completedToday.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const productRevenue = productSalesToday.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalRevenueToday = (serviceRevenue + productRevenue) / 100;
  
  const revenueFormatted = totalRevenueToday.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalAppointmentsToday = await prisma.appointment.count({
    where: {
      tenantId,
      status: { in: ['CONFIRMED', 'COMPLETED'] },
      scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
  });

  const newCustomersMonth = await prisma.user.count({
    where: {
      tenantId,
      role: 'CUSTOMER',
      createdAt: { gte: startOfMonth }
    }
  });

  const appointments = await prisma.appointment.findMany({
    where: {
      tenantId,
      status: 'CONFIRMED',
      scheduledAt: { gte: now }
    },
    include: { customer: true, barber: true, service: true },
    orderBy: { scheduledAt: 'asc' },
    take: 4
  });

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  const showOnboarding = tenant?.name === 'Matriz - Agendei Barber';

  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: tenant?.id },
    orderBy: { createdAt: 'desc' }
  });
  const isSubscribed = subscription && subscription.status === 'ACTIVE';

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  return (
    <div className="p-6 md:p-10 lg:p-14 max-w-7xl mx-auto min-h-screen space-y-10">
      
      {/* WIZARD DE BOAS-VINDAS (OPCIONAL) */}
      {showOnboarding && <OnboardingWizard tenantName={tenant?.name || ""} />}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10 text-white animate-fade-in-up">
        <div>
          <p className="text-zinc-500 text-sm font-medium mb-1.5">{greeting} 👋</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight">
            {tenant?.name || "Dashboard"}
          </h1>
          <p className="text-zinc-500 font-medium text-sm mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
            Gestão em tempo real · {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {!isSubscribed ? (
          <Link href="/dashboard/assinaturas" className="relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 max-w-sm shadow-[0_0_30px_rgba(249,115,22,0.1)] group transition-all hover:scale-[1.02] active:scale-95">
            <div className="bg-[#120a0a]/90 backdrop-blur-xl px-5 py-4 rounded-[15px] flex items-center gap-4">
              <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-orange-400 text-xs tracking-widest uppercase">Trial Grátis</p>
                <p className="text-zinc-400 text-xs mt-0.5">Assine para desbloquear tudo</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-[1px] rounded-2xl overflow-hidden bg-gradient-to-r from-green-500/40 to-emerald-500/15">
            <div className="bg-[#0a0c0a]/90 backdrop-blur-xl px-5 py-4 rounded-[15px] flex items-center gap-3">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 py-1 px-3 font-black text-xs">PLANO PRO</Badge>
            </div>
          </div>
        )}
      </header>

      {/* MÉTRICAS DE IMPACTO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="metric-card bg-[#0a0a0a] border border-zinc-900 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group animate-fade-in-up-delay-1">
           <TrendingUp className="absolute -right-3 -bottom-3 w-24 h-24 text-zinc-900/50 group-hover:text-green-500/5 transition-colors" />
           <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Faturamento (Hoje)</p>
           <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{revenueFormatted}</p>
           <p className="mt-3 text-xs font-medium text-zinc-600 flex items-center gap-1.5">
             <span className="inline-flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md text-[10px] font-bold">
               +{serviceRevenue > 0 ? ((productRevenue / serviceRevenue) * 100).toFixed(0) : 0}%
             </span>
             vendas extras
           </p>
        </div>

        <div className="metric-card bg-[#0a0a0a] border border-zinc-900 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group animate-fade-in-up-delay-2">
           <Zap className="absolute -right-3 -bottom-3 w-24 h-24 text-zinc-900/50 group-hover:text-orange-500/5 transition-colors" />
           <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Ocupação</p>
           <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">
             {Math.min(100, (totalAppointmentsToday / 12) * 100).toFixed(0)}%
           </p>
           <p className="mt-3 text-xs font-medium text-zinc-600">{totalAppointmentsToday} de 12 slots preenchidos</p>
        </div>

        <div className="metric-card bg-[#0a0a0a] border border-zinc-900 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden group animate-fade-in-up-delay-3 sm:col-span-2 lg:col-span-1">
           <Star className="absolute -right-3 -bottom-3 w-24 h-24 text-zinc-900/50 group-hover:text-purple-500/5 transition-colors" />
           <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Novos Clientes</p>
           <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{newCustomersMonth}</p>
           <p className="mt-3">
             <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md">este mês</span>
           </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRÓXIMOS DA AGENDA */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-zinc-900 rounded-2xl md:rounded-3xl p-6 md:p-8 animate-fade-in-up-delay-2">
           <div className="flex justify-between items-center mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2.5">
                 <div className="page-header-icon w-8 h-8 rounded-lg">
                    <Calendar className="w-4 h-4" />
                 </div>
                 Próximos Agendamentos
              </h3>
              <Link href="/dashboard/agenda" className="text-[11px] font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                Ver Agenda <ChevronRight className="w-3.5 h-3.5" />
              </Link>
           </div>

           <div className="space-y-3">
              {appointments.map(app => (
                <div key={app.id} className="flex justify-between items-center p-4 md:p-5 bg-zinc-950/50 border border-zinc-900/80 rounded-2xl hover:border-orange-500/20 transition-all group table-row-premium">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 rounded-xl flex items-center justify-center font-bold text-white text-sm border border-zinc-800 transition-transform group-hover:scale-105">
                         {app.customer.name.charAt(0)}
                      </div>
                      <div>
                         <p className="font-bold text-white text-sm md:text-base">{app.customer.name}</p>
                         <p className="text-zinc-600 text-[11px] font-medium mt-0.5">{app.service.name} · {app.barber.name}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg md:text-xl font-black text-orange-500">{app.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Confirmado</p>
                   </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-12 text-zinc-700">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">Agenda livre no momento</p>
                </div>
              )}
           </div>
        </div>

        {/* INSIGHT CARD */}
        <div className="bg-gradient-to-br from-orange-500/80 to-orange-700/80 p-[1px] rounded-2xl md:rounded-3xl overflow-hidden animate-fade-in-up-delay-3">
           <div className="bg-[#050505] h-full rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 border border-orange-500/20">
                 <Sparkles className="text-orange-500 w-7 h-7 animate-pulse" />
              </div>
              <h4 className="text-lg font-black text-white mb-1.5 tracking-tight">Insight do Dia</h4>
              <p className="text-zinc-500 text-xs leading-relaxed mb-6">Recomendação baseada no seu fluxo de atendimentos:</p>
              
              <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl w-full text-left space-y-3">
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0"><MessageSquare className="text-blue-500 w-3.5 h-3.5" /></div>
                    <div>
                       <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">Sugestão</p>
                       <p className="text-zinc-400 text-xs leading-relaxed">Ofereça um combo Barba + Pomada com 10% de desconto.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 border-t border-zinc-800 pt-3">
                    <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0"><ShoppingBag className="text-green-500 w-3.5 h-3.5" /></div>
                    <div>
                       <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">Impacto</p>
                       <p className="text-zinc-400 text-xs leading-relaxed">Aumento de até 15% no ticket médio.</p>
                    </div>
                 </div>
              </div>

              <button className="mt-6 w-full h-12 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                 <Zap className="w-4 h-4" /> Ativar Campanha
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
