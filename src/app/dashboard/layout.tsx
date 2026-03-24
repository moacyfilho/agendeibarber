import { Scissors, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { DashboardNav } from './DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030303] text-zinc-50 font-sans overflow-hidden relative">

      {/* Organic ambient glows */}
      <div className="absolute top-[-20%] left-[-8%] w-[35%] h-[45%] bg-orange-600/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[30%] h-[35%] bg-zinc-700/8 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#080808]/70 backdrop-blur-3xl border-r border-white/[0.04] flex flex-col h-full overflow-hidden relative z-20 shadow-[1px_0_0_rgba(255,255,255,0.03)]">

        {/* Logo */}
        <div className="px-5 py-7 border-b border-white/[0.04] flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.35)] ring-1 ring-orange-500/30 transition-all group-hover:shadow-[0_0_24px_rgba(249,115,22,0.5)]">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                AGENDEI
              </span>
              <span className="text-base font-light text-zinc-300 tracking-tight"> BARBER</span>
            </div>
          </Link>
        </div>

        {/* Nav — scrollable */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-none">
          <DashboardNav />
        </div>

        {/* Bottom links */}
        <div className="px-4 py-4 border-t border-white/[0.04] flex-shrink-0 space-y-1">
          {/* Admin — usa <a> nativo para forçar full page load (evita conflito com client router) */}
          <a
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-700 hover:text-emerald-400 hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/10 transition-all group"
          >
            <div className="w-5 h-5 bg-zinc-900 rounded-md flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-700 group-hover:text-emerald-400 transition-colors" strokeWidth={2.5} />
            </div>
            <span>Super Admin</span>
          </a>
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06] transition-all group"
          >
            <div className="w-5 h-5 bg-zinc-800 rounded-md flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
              <Scissors className="w-2.5 h-2.5 text-zinc-500 group-hover:text-orange-400 transition-colors" strokeWidth={2.5} />
            </div>
            <span>Ver página pública</span>
          </Link>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto relative z-10 scroll-smooth">
        <div className="relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}
