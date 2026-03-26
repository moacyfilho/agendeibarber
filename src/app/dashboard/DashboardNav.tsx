'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Scissors, Briefcase, Package,
  Calendar, CalendarDays, CreditCard,
  DollarSign, Clock, Wallet, TrendingDown,
  TrendingUp, BarChart2, Calculator, Scale,
  Palette, Star, ShoppingBag, type LucideIcon
} from 'lucide-react';

function NavItem({ href, icon: Icon, label, alert, badge, collapsed }: {
  href: string; icon: LucideIcon; label: string;
  alert?: boolean; badge?: string; collapsed?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`group relative flex items-center gap-3 rounded-xl text-[13px] font-medium border transition-all duration-200
        ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3.5 py-2'}
        ${isActive
          ? 'bg-orange-500/8 text-orange-300 border-orange-500/15 shadow-[0_0_12px_rgba(249,115,22,0.06)]'
          : 'text-zinc-500 border-transparent hover:bg-white/[0.03] hover:text-zinc-300 hover:border-white/[0.04]'
        }`}
    >
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
      )}
      <Icon className={`flex-shrink-0 transition-colors ${collapsed ? 'w-[18px] h-[18px]' : 'w-[16px] h-[16px]'}
        ${alert ? 'text-red-400' : isActive ? 'text-orange-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
      {!collapsed && <span className="truncate leading-none">{label}</span>}
      {alert && !collapsed && <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)] animate-pulse" />}
      {alert && collapsed  && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      {badge && !collapsed && (
        <span className="absolute right-3 text-[8px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/15 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SectionDivider({ label, collapsed }: { label: string; collapsed?: boolean }) {
  if (collapsed) return <div className="h-px bg-zinc-800/60 mx-1 my-2" />;
  return (
    <div className="flex items-center gap-3 px-4 mt-5 mb-1.5">
      <span className="text-[9px] font-bold tracking-[0.15em] text-zinc-600 uppercase whitespace-nowrap">{label}</span>
      <div className="h-px bg-zinc-800/60 flex-1" />
    </div>
  );
}

export function DashboardNav({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const isDashboardRoot = pathname === '/dashboard';

  return (
    <nav className={`flex flex-col gap-0.5 pb-8 ${collapsed ? 'px-2' : 'px-3'}`}>
      <Link
        href="/dashboard"
        title={collapsed ? 'Painel Principal' : undefined}
        className={`group relative flex items-center gap-3 rounded-xl text-[13px] font-semibold border transition-all duration-200
          ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3.5 py-2.5'}
          ${isDashboardRoot
            ? 'bg-orange-500/8 text-orange-300 border-orange-500/15 shadow-[0_0_12px_rgba(249,115,22,0.06)]'
            : 'text-zinc-500 border-transparent hover:bg-white/[0.03] hover:text-zinc-300 hover:border-white/[0.04]'
          }`}
      >
        {isDashboardRoot && !collapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.9)]" />}
        <LayoutDashboard className={`flex-shrink-0 ${collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4'} ${isDashboardRoot ? 'text-orange-400' : 'text-zinc-600'}`} />
        {!collapsed && 'Painel Principal'}
      </Link>

      <SectionDivider label="Gestão" collapsed={collapsed} />
      <NavItem href="/dashboard/clientes"     icon={Users}        label="Clientes"      collapsed={collapsed} />
      <NavItem href="/dashboard/barbeiros"    icon={Scissors}     label="Barbeiros"     collapsed={collapsed} />
      <NavItem href="/dashboard/servicos"     icon={Briefcase}    label="Serviços"      collapsed={collapsed} />
      <NavItem href="/dashboard/produtos"     icon={Package}      label="Produtos"      collapsed={collapsed} />
      <NavItem href="/dashboard/atendimentos" icon={Calendar}     label="Atendimentos"  collapsed={collapsed} />
      <NavItem href="/dashboard/agenda"       icon={CalendarDays} label="Agenda"        collapsed={collapsed} />
      <NavItem href="/dashboard/horarios"     icon={Clock}        label="Horários"      collapsed={collapsed} />

      <SectionDivider label="Financeiro" collapsed={collapsed} />
      <NavItem href="/dashboard/caixa"     icon={Wallet}       label="Caixa (PDV)"      collapsed={collapsed} />
      <NavItem href="/dashboard/pdv"       icon={Package}      label="Venda Rápida"     collapsed={collapsed} />
      <NavItem href="/dashboard/vendas"    icon={ShoppingBag}  label="Histórico Vendas"  collapsed={collapsed} />
      <NavItem href="/dashboard/comissoes" icon={DollarSign}   label="Comissões"        collapsed={collapsed} />
      <NavItem href="/dashboard/pagar"     icon={TrendingDown} label="Contas a Pagar"   collapsed={collapsed} alert />
      <NavItem href="/dashboard/receber"   icon={TrendingUp}   label="Contas a Receber" collapsed={collapsed} />

      <SectionDivider label="Inteligência" collapsed={collapsed} />
      <NavItem href="/dashboard/relatorios"        icon={BarChart2}  label="Relatórios"       collapsed={collapsed} badge="AI" />
      <NavItem href="/dashboard/fechamento-diario" icon={Calculator} label="Fechamento Diário" collapsed={collapsed} />
      <NavItem href="/dashboard/fechamento-mensal" icon={Scale}      label="Balanço Mensal"    collapsed={collapsed} />

      <SectionDivider label="Assinaturas" collapsed={collapsed} />
      <NavItem href="/dashboard/planos"      icon={Star}       label="Planos p/ Clientes" collapsed={collapsed} badge={collapsed ? undefined : 'novo'} />
      <NavItem href="/dashboard/assinaturas" icon={CreditCard} label="Minha Assinatura"   collapsed={collapsed} />

      <SectionDivider label="Config" collapsed={collapsed} />
      <NavItem href="/dashboard/configuracoes" icon={Palette} label="Personalizar" collapsed={collapsed} />
    </nav>
  );
}
