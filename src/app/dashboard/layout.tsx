import { 
  LayoutDashboard, Users, Scissors, Briefcase, Package, 
  Calendar, CalendarDays, CreditCard, Settings, 
  DollarSign, Clock, Wallet, TrendingDown, 
  TrendingUp, BarChart2, Calculator, Scale,
  Star, Gift, Palette
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Helper visual para evitar repetição massiva de classes grandes.
const NavItem = ({ href, icon: Icon, label, alert, badge }: { href: string, icon: any, label: string, alert?: boolean, badge?: string }) => (
  <Link href={href} className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-zinc-400 font-medium border border-transparent hover:bg-white/[0.04] hover:text-zinc-100 hover:border-white/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg relative">
    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${alert ? "text-red-400/80 group-hover:text-red-400" : "group-hover:text-zinc-100"}`} />
    <span className="truncate">{label}</span>
    {alert && <span className="absolute right-3 w-2 h-2 rounded-full bg-red-500 blur-[2px] animate-pulse"></span>}
    {badge && <span className="absolute right-3 text-[9px] font-black bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full uppercase">{badge}</span>}
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030303] text-zinc-50 font-sans overflow-hidden relative">
      
      {/* GLOWS ORGÂNICOS DE FUNDO */}
      <div className="absolute top-[-15%] left-[-10%] w-[40%] h-[50%] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[35%] h-[40%] bg-zinc-700/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* SIDEBAR WIDENED COM GLASSMORPHISM REAL */}
      <aside className="w-72 bg-[#080808]/60 backdrop-blur-3xl border-r border-white/5 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-[20px_0_40px_rgba(0,0,0,0.5)] relative z-20">
        
        {/* LOGO GLOW */}
        <div className="px-8 py-10 sticky top-0 bg-transparent z-10 mb-2">
          <h1 className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 flex items-center gap-3 drop-shadow-sm">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] ring-1 ring-orange-500/50">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            AGENDEI <span className="text-zinc-100 font-light">BARBER</span>
          </h1>
        </div>

        {/* NAVEGAÇÃO INICIAL */}
        <nav className="flex flex-col gap-2 px-5 pb-8">
          
          <Link href="/dashboard" className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500/15 to-transparent text-orange-400 font-bold border border-orange-500/20 relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-r-full shadow-[0_0_12px_rgba(249,115,22,1)]"></div>
            <LayoutDashboard className="w-5 h-5 flex-shrink-0 group-hover:animate-pulse" />
            Visão Central
          </Link>
          
          <NavItem href="/dashboard/clientes" icon={Users} label="Clientes & Fidelidade" />
          <NavItem href="/dashboard/barbeiros" icon={Scissors} label="Gestão de Barbeiros" />
          <NavItem href="/dashboard/servicos" icon={Briefcase} label="Catálogo de Serviços" />
          <NavItem href="/dashboard/produtos" icon={Package} label="Vitrine & Produtos" />
          <NavItem href="/dashboard/atendimentos" icon={Calendar} label="Filas & Atendimentos" />
          <NavItem href="/dashboard/agenda" icon={CalendarDays} label="Agenda Virtual" />
          <NavItem href="/dashboard/assinaturas" icon={CreditCard} label="Assinatura SaaS" />

          {/* DIVISOR FINANCEIRO */}
          <div className="mt-6 mb-3 px-4 flex items-center gap-3 opacity-60">
            <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent flex-1"></div>
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Caixa & Gestão</span>
            <div className="h-px bg-gradient-to-l from-zinc-700 to-transparent flex-1"></div>
          </div>

          <NavItem href="/dashboard/caixa" icon={Wallet} label="Meu Caixa (PDV)" />
          <NavItem href="/dashboard/comissoes" icon={DollarSign} label="Apuração de Comissão" />
          <NavItem href="/dashboard/horas-comissoes" icon={Clock} label="Pagamento Geral" />
          <NavItem href="/dashboard/pagar" icon={TrendingDown} label="Contas a Pagar (Despesas)" alert />
          <NavItem href="/dashboard/receber" icon={TrendingUp} label="Fiados a Receber" />
          
          {/* DIVISOR EXPERIÊNCIA */}
          <div className="mt-6 mb-3 px-4 flex items-center gap-3 opacity-60">
            <div className="h-px bg-gradient-to-r from-zinc-700 to-transparent flex-1"></div>
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Experiência</span>
            <div className="h-px bg-gradient-to-l from-zinc-700 to-transparent flex-1"></div>
          </div>

          <NavItem href="/dashboard/relatorios" icon={BarChart2} label="Relatórios Inteligentes" badge="AI" />
          <NavItem href="/dashboard/fechamento-diario" icon={Calculator} label="Fechamento do Dia" />
          <NavItem href="/dashboard/fechamento-mensal" icon={Scale} label="Balanço Mensal" />
          <NavItem href="/dashboard/planos" icon={Package} label="Planos do App" />
          <NavItem href="/dashboard/configuracoes" icon={Palette} label="Personalizar Marca" badge="novo" />

        </nav>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 overflow-auto relative z-10 scroll-smooth">
        {/* Camada sutil de textura sobre o main, opcional. */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}
