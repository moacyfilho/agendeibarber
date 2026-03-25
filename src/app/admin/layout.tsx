import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#020204] min-h-screen w-full relative overflow-x-hidden font-sans text-zinc-50">

      {/* Ambient glows — emerald theme */}
      <div className="fixed top-[-15%] left-[-8%] w-[40%] h-[45%] bg-emerald-600/[0.07] rounded-full blur-[200px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[30%] h-[35%] bg-cyan-600/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#020204]/80 backdrop-blur-2xl border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-300 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Dashboard
            </Link>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow-[0_0_14px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 tracking-tight">
                SUPER ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500/60 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">
              <Zap className="w-2.5 h-2.5" />
              SaaS Control Plane
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 w-full min-h-[calc(100vh-4rem)]">
        {children}
      </main>

    </div>
  );
}
