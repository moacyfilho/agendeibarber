import { Building2, ShieldCheck, Users, TrendingUp, Activity, BarChart3, Zap, DollarSign, Crown, Sparkles, Star, ArrowUpRight, Package } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { NewTenantModal } from "./NewTenantModal"
import { TenantRow } from "./TenantRow"

export const dynamic = 'force-dynamic'

const PLAN_CONFIG = {
  STARTER:      { label: 'Starter',      price: 49.90,  color: 'emerald', hex: '#10b981' },
  PROFISSIONAL: { label: 'Profissional', price: 99.90,  color: 'orange',  hex: '#f97316' },
  PREMIUM:      { label: 'Premium',      price: 149.90, color: 'purple',  hex: '#a855f7' },
} as const

export default async function SuperAdminDashboard() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    tenants,
    totalUsers,
    totalCustomers,
    totalBarbers,
    totalAppointments,
    tenantsThisMonth,
    tenantsLastMonth,
    appointmentsThisMonth,
  ] = await Promise.all([
    prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { users: true, services: true, appointments: true } }
      }
    }),
    prisma.user.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'BARBER' } }),
    prisma.appointment.count(),
    prisma.tenant.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.tenant.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.appointment.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.isActive).length;
  const inactiveTenants = totalTenants - activeTenants;

  // Per-plan breakdown
  const planCounts = {
    STARTER:      tenants.filter(t => t.plan === 'STARTER').length,
    PROFISSIONAL: tenants.filter(t => t.plan === 'PROFISSIONAL').length,
    PREMIUM:      tenants.filter(t => t.plan === 'PREMIUM').length,
  };
  const freeTenants = totalTenants - planCounts.STARTER - planCounts.PROFISSIONAL - planCounts.PREMIUM;

  // Real MRR from active tenants with plans
  const mrr =
    tenants.filter(t => t.isActive && t.plan === 'STARTER').length      * 49.90 +
    tenants.filter(t => t.isActive && t.plan === 'PROFISSIONAL').length  * 99.90 +
    tenants.filter(t => t.isActive && t.plan === 'PREMIUM').length       * 149.90;

  const mrrFormatted = mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const annualizedRevenue = (mrr * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const growthRate = tenantsLastMonth > 0
    ? ((tenantsThisMonth - tenantsLastMonth) / tenantsLastMonth * 100).toFixed(0)
    : tenantsThisMonth > 0 ? '∞' : '0';

  const maxPlanCount = Math.max(planCounts.STARTER, planCounts.PROFISSIONAL, planCounts.PREMIUM, 1);

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8">

      {/* ═══ HERO HEADER ═══ */}
      <header className="animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-500/8 border border-emerald-500/15 w-fit px-3 py-1.5 rounded-lg tracking-[0.18em] uppercase">
                <ShieldCheck className="w-2.5 h-2.5" /> Painel Administrativo
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                {totalTenants} barbearia{totalTenants !== 1 ? 's' : ''} no ecossistema
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-emerald-400/50 tracking-tight leading-tight">
              Command Center
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium">
              Visão completa da operação SaaS em tempo real
            </p>
          </div>
          <NewTenantModal />
        </div>
      </header>

      {/* ═══ KPI ROW ═══ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fade-in-up-delay-1">

        {/* MRR */}
        <div className="col-span-2 lg:col-span-1 relative group bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/20 rounded-2xl p-5 md:p-6 overflow-hidden transition-all hover:border-emerald-500/35 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]">
          <div className="absolute -right-3 -bottom-3 w-24 h-24 bg-emerald-500/[0.05] rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-lg">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-[0.15em]">MRR Real</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{mrrFormatted}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-500/60">{annualizedRevenue}/ano estimado</span>
          </div>
        </div>

        {/* Tenants */}
        <div className="relative group bg-[#090909] border border-zinc-900 rounded-2xl p-5 md:p-6 overflow-hidden transition-all hover:border-zinc-700/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
              <Building2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.15em]">Barbearias</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{activeTenants}</p>
            <span className="text-xs font-bold text-zinc-700 mb-1">/ {totalTenants}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {tenantsThisMonth > 0 && (
              <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> +{tenantsThisMonth} este mês
              </span>
            )}
            {inactiveTenants > 0 && (
              <span className="text-[9px] font-bold text-red-500/60">{inactiveTenants} bloq.</span>
            )}
          </div>
        </div>

        {/* Usuários */}
        <div className="relative group bg-[#090909] border border-zinc-900 rounded-2xl p-5 md:p-6 overflow-hidden transition-all hover:border-zinc-700/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
              <Users className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.15em]">Usuários</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{totalUsers.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] font-bold text-zinc-600">{totalCustomers} clientes</span>
            <span className="w-px h-2.5 bg-zinc-800" />
            <span className="text-[9px] font-bold text-zinc-600">{totalBarbers} barbeiros</span>
          </div>
        </div>

        {/* Agendamentos */}
        <div className="relative group bg-[#090909] border border-zinc-900 rounded-2xl p-5 md:p-6 overflow-hidden transition-all hover:border-zinc-700/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-purple-500/10 transition-colors">
              <BarChart3 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.15em]">Agendamentos</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{totalAppointments.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-purple-400/50 mt-2">
            <Activity className="w-2.5 h-2.5 inline mr-1" />{appointmentsThisMonth} este mês
          </p>
        </div>
      </section>

      {/* ═══ RECEITA POR PLANO ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up-delay-2">
        {(Object.entries(PLAN_CONFIG) as [keyof typeof PLAN_CONFIG, typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG]][]).map(([key, cfg]) => {
          const count = planCounts[key];
          const revenue = count * cfg.price;
          const pct = totalTenants > 0 ? Math.round((count / totalTenants) * 100) : 0;
          const barPct = Math.round((count / maxPlanCount) * 100);

          const colorMap = {
            emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' },
            orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-400',  bar: 'bg-orange-500',  glow: 'shadow-[0_0_20px_rgba(249,115,22,0.1)]' },
            purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  bar: 'bg-purple-500',  glow: 'shadow-[0_0_20px_rgba(168,85,247,0.1)]' },
          } as const;
          const c = colorMap[cfg.color as keyof typeof colorMap];

          return (
            <div key={key} className={`bg-[#090909] border ${c.border} rounded-2xl p-5 md:p-6 transition-all hover:${c.glow}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {key === 'PREMIUM' && <Crown className={`w-3.5 h-3.5 ${c.text}`} />}
                    {key === 'PROFISSIONAL' && <Star className={`w-3.5 h-3.5 ${c.text}`} />}
                    {key === 'STARTER' && <Package className={`w-3.5 h-3.5 ${c.text}`} />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>{cfg.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white">{count}</p>
                  <p className="text-[10px] text-zinc-600 font-medium">barbearia{count !== 1 ? 's' : ''} · {pct}% do total</p>
                </div>
                <div className={`px-3 py-1.5 ${c.bg} border ${c.border} rounded-xl`}>
                  <p className={`text-sm font-black ${c.text}`}>
                    {revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className={`text-[9px] font-bold ${c.text} opacity-60`}>/mês</p>
                </div>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
              <p className={`text-[9px] font-bold text-zinc-600 mt-2`}>
                R$ {cfg.price.toFixed(2).replace('.', ',')} / barbearia / mês
              </p>
            </div>
          );
        })}
      </section>

      {/* ═══ INDICADORES RÁPIDOS ═══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up-delay-2">
        <div className="bg-[#090909] border border-zinc-900 rounded-xl p-4 flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${Number(growthRate) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Crescimento</p>
            <p className={`text-lg font-black ${Number(growthRate) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthRate === '∞' ? '∞' : `${Number(growthRate) >= 0 ? '+' : ''}${growthRate}%`}
            </p>
          </div>
        </div>

        <div className="bg-[#090909] border border-zinc-900 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Taxa Ativa</p>
            <p className="text-lg font-black text-white">
              {totalTenants > 0 ? Math.round((activeTenants / totalTenants) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-[#090909] border border-zinc-900 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Plano médio</p>
            <p className="text-lg font-black text-white">
              {activeTenants > 0
                ? (mrr / activeTenants).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'R$ 0'}
            </p>
          </div>
        </div>

        <div className="bg-[#090909] border border-zinc-900 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Free / Sem plano</p>
            <p className="text-lg font-black text-white">{freeTenants}</p>
          </div>
        </div>
      </section>

      {/* ═══ LISTA DE BARBEARIAS ═══ */}
      <section className="bg-[#060608] border border-zinc-900/80 rounded-2xl overflow-hidden animate-fade-in-up-delay-3">

        <div className="px-6 md:px-8 py-5 border-b border-zinc-900/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Barbearias Registradas</h3>
              <p className="text-[10px] text-zinc-600 font-medium mt-0.5">
                {totalTenants} ambiente{totalTenants !== 1 ? 's' : ''} · {activeTenants} ativo{activeTenants !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/8 border border-emerald-500/12 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {activeTenants} ativo{activeTenants !== 1 ? 's' : ''}
            </span>
            {inactiveTenants > 0 && (
              <span className="flex items-center gap-1.5 text-red-400 bg-red-500/8 border border-red-500/12 px-2.5 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {inactiveTenants} bloqueado{inactiveTenants !== 1 ? 's' : ''}
              </span>
            )}
            {freeTenants > 0 && (
              <span className="flex items-center gap-1.5 text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                {freeTenants} sem plano
              </span>
            )}
          </div>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-3">
          {tenants.map(t => (
            <TenantRow key={t.id} t={t} />
          ))}
          {tenants.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="p-5 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                <Building2 className="w-10 h-10 text-zinc-700" />
              </div>
              <div>
                <p className="text-zinc-500 font-bold text-sm">Nenhuma barbearia registrada ainda</p>
                <p className="text-zinc-700 text-xs mt-1">Cadastre a primeira usando o botão acima</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-center gap-3 py-4 opacity-20 hover:opacity-50 transition-opacity">
        <div className="p-1 bg-emerald-500 rounded-md">
          <ShieldCheck className="w-2 h-2 text-white" strokeWidth={3} />
        </div>
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
          Agendei Barber · SaaS Control Plane · v1.5.0
        </span>
      </footer>

    </div>
  );
}
