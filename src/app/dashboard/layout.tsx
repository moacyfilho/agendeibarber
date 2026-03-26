import { Menu, Search } from 'lucide-react';
import React from 'react';
import { MobileSidebarToggle } from './MobileSidebarToggle';
import { SidebarWrapper } from './SidebarWrapper';
import { ToastProvider } from '@/components/Toast';
import { CommandPalette } from '@/components/CommandPalette';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const tenantId = await getTenantId();
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true } });

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#030303] text-zinc-50 font-sans overflow-hidden relative">

        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-8%] w-[35%] h-[45%] bg-orange-600/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />
        <div className="absolute bottom-[-15%] right-[-8%] w-[30%] h-[35%] bg-zinc-700/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />

        {/* Mobile overlay */}
        <MobileSidebarToggle />

        {/* Sidebar colapsável */}
        <SidebarWrapper tenantName={tenant?.name} />

        {/* Main content */}
        <main className="flex-1 overflow-auto relative z-10 scroll-smooth">
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 bg-[#030303]/90 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/5 hover:border-orange-500/20 transition-all"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-bold text-zinc-300">{tenant?.name || 'Agendei Barber'}</span>
            </div>
            <button
              onClick={undefined}
              className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
              title="Buscar (Ctrl+K)"
              id="mobile-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="relative z-10">
            {children}
          </div>
        </main>

        {/* Command Palette global */}
        <CommandPalette />
      </div>
    </ToastProvider>
  );
}
