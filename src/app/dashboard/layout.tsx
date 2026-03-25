import { Scissors, ShieldCheck, Menu, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { DashboardNav } from './DashboardNav';
import { MobileSidebarToggle } from './MobileSidebarToggle';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const tenantId = await getTenantId();
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true } });
  return (
    <div className="flex h-screen bg-[#030303] text-zinc-50 font-sans overflow-hidden relative">

      {/* Organic ambient glows */}
      <div className="absolute top-[-20%] left-[-8%] w-[35%] h-[45%] bg-orange-600/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[30%] h-[35%] bg-zinc-700/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />

      {/* MOBILE SIDEBAR TOGGLE + OVERLAY */}
      <MobileSidebarToggle />

      {/* SIDEBAR (Desktop: fixed, Mobile: drawer via CSS) */}
      <aside
        id="sidebar"
        className="
          fixed inset-y-0 left-0 z-50
          w-[280px] bg-[#060606]/95 backdrop-blur-3xl
          border-r border-white/[0.04]
          flex flex-col h-full overflow-hidden
          shadow-[1px_0_0_rgba(255,255,255,0.02)]
          sidebar-mobile
          lg:relative lg:transform-none lg:w-[260px] lg:z-20
        "
      >

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/[0.04] flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/20 transition-all group-hover:shadow-[0_0_24px_rgba(249,115,22,0.4)]">
              <Scissors className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div>
                <span className="text-[15px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                  AGENDEI
                </span>
                <span className="text-[15px] font-light text-zinc-400 tracking-tight"> BARBER</span>
              </div>
              {tenant?.name && (
                <span className="text-[11px] text-zinc-600 font-medium truncate max-w-[160px] block mt-0.5">
                  {tenant.name}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Nav — scrollable */}
        <div className="flex-1 overflow-y-auto py-3 scrollbar-none">
          <DashboardNav />
        </div>

        {/* Bottom links */}
        <div className="px-4 py-4 border-t border-white/[0.04] flex-shrink-0 space-y-1">
          {/* Admin — usa <a> nativo para forçar full page load */}
          <a
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/10 transition-all group"
          >
            <div className="w-5 h-5 bg-zinc-900 rounded-md flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
              <ShieldCheck className="w-2.5 h-2.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" strokeWidth={2.5} />
            </div>
            <span>Super Admin</span>
          </a>
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06] transition-all group"
          >
            <div className="w-5 h-5 bg-zinc-800 rounded-md flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
              <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-orange-400 transition-colors" strokeWidth={2.5} />
            </div>
            <span>Ver página pública</span>
          </Link>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto relative z-10 scroll-smooth">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#030303]/90 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center gap-3">
          <button
            id="mobile-menu-btn"
            className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/5 hover:border-orange-500/20 transition-all focus-ring"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg">
              <Scissors className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-zinc-300">Agendei Barber</span>
          </div>
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}
