import { Building2, ShieldCheck, Users, CreditCard, TrendingUp, Activity, Globe, BarChart3, Layers, Clock, Zap, AlertTriangle, DollarSign, Crown } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { NewTenantModal } from "./NewTenantModal"
import { TenantRow } from "./TenantRow"

export const dynamic = 'force-dynamic'

export default async function SuperAdminDashboard() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // ── Real Data from DB ──
  const [
    tenants,
    totalTenants,
    activeTenants,
    totalUsers,
    totalCustomers,
    totalBarbers,
    totalAppointments,
    tenantsThisMonth,
    tenantsLastMonth,
    activeSubscriptions,
    appointmentsThisMonth,
  ] = await Promise.all([
    prisma.tenant.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true, services: true, appointments: true }
        }
      }
    }),
    prisma.tenant.count(),
    prisma.tenant.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'BARBER' } }),
    prisma.appointment.count(),
    prisma.tenant.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.tenant.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.appointment.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  const inactiveTenants = totalTenants - activeTenants;
  const growthRate = tenantsLastMonth > 0 
    ? ((tenantsThisMonth - tenantsLastMonth) / tenantsLastMonth * 100).toFixed(0) 
    : tenantsThisMonth > 0 ? '+100' : '0';
  const churnRate = totalTenants > 0 ? ((inactiveTenants / totalTenants) * 100).toFixed(1) : '0.0';

  // Estimated MRR (R$49.90 per active subscription)
  const mrr = activeSubscriptions * 49.90;
  const mrrFormatted = mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 md:p-10 lg:p-14 max-w-7xl mx-auto min-h-screen space-y-10">
      
      {/* ═══ HERO HEADER ═══ */}
      <header className="relative animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 bg-emerald-500/8 border border-emerald-500/15 w-fit px-3.5 py-1.5 rounded-lg tracking-[0.2em] uppercase">
                <ShieldCheck className="w-3 h-3" /> PAINEL ADMINISTRATIVO
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                Sistema Online
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-emerald-400/60 tracking-tight leading-tight">
              Command Center
            </h1>
            <p className="text-zinc-500 font-medium text-sm mt-2 max-w-md">
              Visão completa do ecossistema SaaS · {totalTenants} barbearia{totalTenants !== 1 ? 's' : ''} registrada{totalTenants !== 1 ? 's' : ''}
            </p>
          </div>
          
          <NewTenantModal />
        </div>
      </header>

      {/* ═══ KPI GRID — REAL DATA ═══ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fade-in-up-delay-1">
        
        {/* MRR */}
        <div className="relative group col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/15 p-5 md:p-7 rounded-2xl overflow-hidden transition-all hover:border-emerald-500/30">
          <DollarSign className="absolute -right-2 -bottom-2 w-20 h-20 text-emerald-500/[0.06] group-hover:text-emerald-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-emerald-500/15 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-[0.15em]">MRR Estimado</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{mrrFormatted}</p>
          <p className="text-[10px] font-bold text-emerald-500/60 mt-2">{activeSubscriptions} assinatura{activeSubscriptions !== 1 ? 's' : ''} ativa{activeSubscriptions !== 1 ? 's' : ''}</p>
        </div>

        {/* Tenants Ativos */}
        <div className="relative group bg-[#0a0a0a] border border-zinc-900 p-5 md:p-7 rounded-2xl overflow-hidden transition-all hover:border-emerald-500/20 metric-card">
          <Building2 className="absolute -right-2 -bottom-2 w-20 h-20 text-zinc-900/70 group-hover:text-emerald-500/5 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
              <Globe className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Tenants</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{activeTenants}</p>
            <span className="text-xs font-bold text-zinc-600 mb-1">/ {totalTenants}</span>
          </div>
          {tenantsThisMonth > 0 && (
            <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> +{tenantsThisMonth} este mês
            </p>
          )}
        </div>

        {/* Total Usuários */}
        <div className="relative group bg-[#0a0a0a] border border-zinc-900 p-5 md:p-7 rounded-2xl overflow-hidden transition-all hover:border-cyan-500/20 metric-card">
          <Users className="absolute -right-2 -bottom-2 w-20 h-20 text-zinc-900/70 group-hover:text-cyan-500/5 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
              <Users className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Usuários</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{totalUsers.toLocaleString()}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[9px] font-bold text-zinc-600">{totalCustomers} clientes</span>
            <span className="text-[9px] font-bold text-zinc-600">{totalBarbers} barbeiros</span>
          </div>
        </div>

        {/* Agendamentos */}
        <div className="relative group bg-[#0a0a0a] border border-zinc-900 p-5 md:p-7 rounded-2xl overflow-hidden transition-all hover:border-purple-500/20 metric-card">
          <Activity className="absolute -right-2 -bottom-2 w-20 h-20 text-zinc-900/70 group-hover:text-purple-500/5 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-zinc-800 rounded-lg group-hover:bg-purple-500/10 transition-colors">
              <BarChart3 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Agendamentos</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">{totalAppointments.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-purple-400/60 mt-2">{appointmentsThisMonth} este mês</p>
        </div>
      </section>

      {/* ═══ HEALTH INDICATORS ═══ */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 animate-fade-in-up-delay-2">
        
        {/* Growth */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 md:p-6 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${Number(growthRate) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Crescimento Mensal</p>
            <p className={`text-xl font-black ${Number(growthRate) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {Number(growthRate) >= 0 ? '+' : ''}{growthRate}%
            </p>
          </div>
        </div>

        {/* Churn */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 md:p-6 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${Number(churnRate) <= 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Taxa de Churn</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-white">{churnRate}%</p>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${Number(churnRate) <= 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15'}`}>
                {Number(churnRate) <= 5 ? 'Saudável' : 'Atenção'}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Activity */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 md:p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Plataforma</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-white">v1.5.0</p>
              <span className="text-[8px] font-bold text-cyan-400/60 bg-cyan-500/8 border border-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                Next.js 16
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TENANT LIST ═══ */}
      <section className="bg-[#060606] border border-zinc-900/80 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up-delay-3">
        
        {/* Section Header */}
        <div className="px-6 md:px-8 py-5 md:py-6 border-b border-zinc-900/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white">Barbearias Registradas</h3>
              <p className="text-[10px] font-medium text-zinc-600 mt-0.5">{totalTenants} ambiente{totalTenants !== 1 ? 's' : ''} no ecossistema</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/8 border border-emerald-500/12 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {activeTenants} ativo{activeTenants !== 1 ? 's' : ''}
            </span>
            {inactiveTenants > 0 && (
              <span className="flex items-center gap-1.5 text-red-400 bg-red-500/8 border border-red-500/12 px-2.5 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {inactiveTenants} bloqueado{inactiveTenants !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        {/* Tenant List */}
        <div className="p-4 md:p-6 flex flex-col gap-3">
          {tenants.map(t => (
            <TenantRow key={t.id} t={t} />
          ))}
          {tenants.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center gap-3">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <Building2 className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-600 font-medium text-sm">Nenhuma barbearia registrada no ecossistema ainda.</p>
              <p className="text-zinc-700 text-xs">Cadastre a primeira usando o botão acima.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-center gap-3 py-6 opacity-20 hover:opacity-60 transition-opacity">
        <div className="p-1 bg-emerald-500 rounded">
          <ShieldCheck className="w-2 h-2 text-white" strokeWidth={3} />
        </div>
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
          Agendei Barber · SaaS Control Plane · v1.5.0
        </span>
      </footer>

    </div>
  );
}
