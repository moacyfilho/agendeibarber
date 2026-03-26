'use client';
import { useState, useEffect } from 'react';
import { Scissors, ShieldCheck, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { DashboardNav } from './DashboardNav';

interface Props {
  tenantName?: string;
}

export function SidebarWrapper({ tenantName }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed(c => {
      localStorage.setItem('sidebar-collapsed', String(!c));
      return !c;
    });
  }

  return (
    <aside
      id="sidebar"
      className={`
        fixed inset-y-0 left-0 z-50
        bg-[#060606]/95 backdrop-blur-3xl
        border-r border-white/[0.04]
        flex flex-col h-full overflow-hidden
        shadow-[1px_0_0_rgba(255,255,255,0.02)]
        sidebar-mobile transition-all duration-300
        ${collapsed ? 'lg:w-[68px]' : 'lg:w-[260px]'}
        lg:relative lg:transform-none lg:z-20
      `}
    >
      {/* Logo */}
      <div className={`border-b border-white/[0.04] flex-shrink-0 ${collapsed ? 'px-3 py-5 flex justify-center' : 'px-5 py-6'}`}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/20 transition-all group-hover:shadow-[0_0_24px_rgba(249,115,22,0.4)] flex-shrink-0">
            <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="leading-none min-w-0">
              <div>
                <span className="text-[15px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                  AGENDEI
                </span>
                <span className="text-[15px] font-light text-zinc-400 tracking-tight"> BARBER</span>
              </div>
              {tenantName && (
                <span className="text-[11px] text-zinc-600 font-medium truncate max-w-[160px] block mt-0.5">
                  {tenantName}
                </span>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* Nav scrollable */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-none">
        <DashboardNav collapsed={collapsed} />
      </div>

      {/* Bottom */}
      <div className={`border-t border-white/[0.04] flex-shrink-0 space-y-1 ${collapsed ? 'px-2 py-3' : 'px-4 py-4'}`}>
        {!collapsed && (
          <>
            <a
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/10 transition-all group"
            >
              <div className="w-5 h-5 bg-zinc-900 rounded-md flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors flex-shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" strokeWidth={2.5} />
              </div>
              <span>Super Admin</span>
            </a>
            <Link
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06] transition-all group"
            >
              <div className="w-5 h-5 bg-zinc-800 rounded-md flex items-center justify-center group-hover:bg-orange-500/10 transition-colors flex-shrink-0">
                <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-orange-400 transition-colors" strokeWidth={2.5} />
              </div>
              <span>Ver página pública</span>
            </Link>
          </>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className={`w-full flex items-center gap-3 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06] transition-all ${collapsed ? 'justify-center py-2.5' : 'px-3.5 py-2.5'}`}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4 flex-shrink-0" /><span>Recolher menu</span></>
          }
        </button>
      </div>
    </aside>
  );
}
