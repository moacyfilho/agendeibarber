'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Scissors, Briefcase, Package,
  Calendar, CalendarDays, CreditCard,
  DollarSign, Clock, Wallet, TrendingDown,
  TrendingUp, BarChart2, Calculator, Scale,
  Palette, type LucideIcon
} from 'lucide-react';

function NavItem({ href, icon: Icon, label, alert, badge }: {
  href: string;
  icon: LucideIcon;
  label: string;
  alert?: boolean;
  badge?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
        isActive
          ? 'bg-orange-500/10 text-orange-300 border-orange-500/20'
          : 'text-zinc-500 border-transparent hover:bg-white/[0.03] hover:text-zinc-200 hover:border-white/[0.06]'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
      )}
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          alert
            ? 'text-red-400'
            : isActive
            ? 'text-orange-400'
            : 'text-zinc-600 group-hover:text-zinc-400'
        }`}
      />
      <span className="truncate leading-none">{label}</span>
      {alert && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)] animate-pulse" />
      )}
      {badge && (
        <span className="absolute right-3 text-[8px] font-black bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-3 mt-5 mb-1">
      <div className="h-px bg-zinc-800/80 flex-1" />
      <span className="text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="h-px bg-zinc-800/80 flex-1" />
    </div>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const isDashboardRoot = pathname === '/dashboard';

  return (
    <nav className="flex flex-col gap-0.5 px-3 pb-8">

      {/* Visão Central - sempre primeiro */}
      <Link
        href="/dashboard"
        className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
          isDashboardRoot
            ? 'bg-orange-500/10 text-orange-300 border-orange-500/20'
            : 'text-zinc-500 border-transparent hover:bg-white/[0.03] hover:text-zinc-200 hover:border-white/[0.06]'
        }`}
      >
        {isDashboardRoot && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
        )}
        <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${isDashboardRoot ? 'text-orange-400' : 'text-zinc-600'}`} />
        Visão Central
      </Link>

      <SectionDivider label="Gestão" />

      <NavItem href="/dashboard/clientes"     icon={Users}       label="Clientes & Fidelidade" />
      <NavItem href="/dashboard/barbeiros"    icon={Scissors}    label="Barbeiros" />
      <NavItem href="/dashboard/servicos"     icon={Briefcase}   label="Serviços" />
      <NavItem href="/dashboard/produtos"     icon={Package}     label="Produtos" />
      <NavItem href="/dashboard/atendimentos" icon={Calendar}    label="Atendimentos" />
      <NavItem href="/dashboard/agenda"       icon={CalendarDays} label="Agenda Virtual" />
      <NavItem href="/dashboard/assinaturas"  icon={CreditCard}  label="Assinatura SaaS" />

      <SectionDivider label="Financeiro" />

      <NavItem href="/dashboard/caixa"           icon={Wallet}      label="Caixa (PDV)" />
      <NavItem href="/dashboard/comissoes"       icon={DollarSign}  label="Comissões" />
      <NavItem href="/dashboard/horas-comissoes" icon={Clock}       label="Pagamentos" />
      <NavItem href="/dashboard/pagar"           icon={TrendingDown} label="Contas a Pagar" alert />
      <NavItem href="/dashboard/receber"         icon={TrendingUp}  label="Fiados a Receber" />

      <SectionDivider label="Inteligência" />

      <NavItem href="/dashboard/relatorios"       icon={BarChart2}  label="Relatórios" badge="AI" />
      <NavItem href="/dashboard/fechamento-diario" icon={Calculator} label="Fechamento do Dia" />
      <NavItem href="/dashboard/fechamento-mensal" icon={Scale}      label="Balanço Mensal" />
      <NavItem href="/dashboard/planos"           icon={Package}    label="Planos do App" />
      <NavItem href="/dashboard/configuracoes"    icon={Palette}    label="Personalizar Marca" badge="novo" />

    </nav>
  );
}
