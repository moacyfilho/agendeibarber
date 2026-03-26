import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Zap, Circle } from 'lucide-react';

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#020204] min-h-screen w-full relative overflow-x-hidden font-sans text-zinc-50">

      {/* Ambient glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[55%] bg-emerald-600/[0.06] rounded-full blur-[220px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-8%] w-[40%] h-[45%] bg-cyan-600/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[50%] w-[25%] h-[30%] bg-emerald-500/[0.025] rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#020204]/85 backdrop-blur-2xl border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">

          {/* Left: Brand */}
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 hover:text-zinc-300 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="h-3.5 w-px bg-zinc-800/80 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow-[0_0_16px_rgba(16,185,129,0.35)]">
                <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 tracking-tight">
                  SUPER ADMIN
                </span>
                <span className="hidden md:inline text-zinc-700 text-xs font-medium ml-2">· SaaS Control Plane</span>
              </div>
            </div>
          </div>

          {/* Right: Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/70 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">Todos sistemas operacionais</span>
              <span className="sm:hidden">Online</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 bg-zinc-900/60 border border-zinc-800/50 px-2.5 py-1.5 rounded-lg">
              <Zap className="w-2.5 h-2.5" />
              v1.5.0
            </div>
          </div>

        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 w-full min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>

    </div>
  );
}
