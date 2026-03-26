'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Search, Calendar, Users, Scissors, Package, BarChart2,
  Settings, Wallet, CalendarDays, DollarSign, TrendingDown,
  TrendingUp, Calculator, CreditCard, X, ArrowRight
} from 'lucide-react';

const COMMANDS = [
  { label: 'Painel Principal',      href: '/dashboard',                    icon: BarChart2,    section: 'Páginas' },
  { label: 'Agenda',                href: '/dashboard/agenda',             icon: CalendarDays, section: 'Gestão' },
  { label: 'Clientes',              href: '/dashboard/clientes',           icon: Users,        section: 'Gestão' },
  { label: 'Barbeiros',             href: '/dashboard/barbeiros',          icon: Scissors,     section: 'Gestão' },
  { label: 'Serviços',              href: '/dashboard/servicos',           icon: Scissors,     section: 'Gestão' },
  { label: 'Produtos',              href: '/dashboard/produtos',           icon: Package,      section: 'Gestão' },
  { label: 'Atendimentos',          href: '/dashboard/atendimentos',       icon: Calendar,     section: 'Gestão' },
  { label: 'Caixa (PDV)',           href: '/dashboard/caixa',              icon: Wallet,       section: 'Financeiro' },
  { label: 'Comissões',             href: '/dashboard/comissoes',          icon: DollarSign,   section: 'Financeiro' },
  { label: 'Contas a Pagar',        href: '/dashboard/pagar',              icon: TrendingDown, section: 'Financeiro' },
  { label: 'Contas a Receber',      href: '/dashboard/receber',            icon: TrendingUp,   section: 'Financeiro' },
  { label: 'Relatórios',            href: '/dashboard/relatorios',         icon: BarChart2,    section: 'Inteligência' },
  { label: 'Fechamento Diário',     href: '/dashboard/fechamento-diario',  icon: Calculator,   section: 'Inteligência' },
  { label: 'Balanço Mensal',        href: '/dashboard/fechamento-mensal',  icon: Calculator,   section: 'Inteligência' },
  { label: 'Planos p/ Clientes',    href: '/dashboard/planos',             icon: CreditCard,   section: 'Assinaturas' },
  { label: 'Personalizar Barbearia',href: '/dashboard/configuracoes',      icon: Settings,     section: 'Config' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.section.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => setSelected(0), [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) go(filtered[selected].href);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, filtered, selected]);

  function go(href: string) {
    router.push(href);
    setOpen(false);
    setQuery('');
  }

  if (!mounted) return null;

  const sections = [...new Set(filtered.map(c => c.section))];

  return (
    <>
      {/* Hint no sidebar (opcional) */}
      {mounted && createPortal(
        open ? (
          <div
            className="fixed inset-0 z-[500] flex items-start justify-center pt-[15vh] px-4 bg-black/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl w-full max-w-[520px] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800">
                <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar página ou ação..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-zinc-600 hover:text-zinc-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <kbd className="text-[10px] text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-md font-mono">ESC</kbd>
              </div>

              {/* Results */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {filtered.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-zinc-600 text-sm">Nenhum resultado para "{query}"</p>
                  </div>
                )}
                {sections.map(section => (
                  <div key={section}>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-700 px-4 pt-3 pb-1">{section}</p>
                    {filtered.filter(c => c.section === section).map((cmd, i) => {
                      const globalIdx = filtered.indexOf(cmd);
                      return (
                        <button
                          key={cmd.href}
                          onClick={() => go(cmd.href)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                            globalIdx === selected ? 'bg-orange-500/10 text-orange-300' : 'hover:bg-zinc-800/50 text-zinc-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            globalIdx === selected ? 'bg-orange-500/15' : 'bg-zinc-900'
                          }`}>
                            <cmd.icon className={`w-3.5 h-3.5 ${globalIdx === selected ? 'text-orange-400' : 'text-zinc-500'}`} />
                          </div>
                          <span className="text-sm font-medium flex-1">{cmd.label}</span>
                          {globalIdx === selected && <ArrowRight className="w-3.5 h-3.5 text-orange-400" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-zinc-900 flex items-center gap-4 text-[10px] text-zinc-700">
                <span className="flex items-center gap-1"><kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded font-mono">↑↓</kbd> navegar</span>
                <span className="flex items-center gap-1"><kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded font-mono">↵</kbd> abrir</span>
                <span className="flex items-center gap-1"><kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded font-mono">Esc</kbd> fechar</span>
                <span className="ml-auto">⌘K para abrir</span>
              </div>
            </div>
          </div>
        ) : null,
        document.body
      )}
    </>
  );
}
