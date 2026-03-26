import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/session';
import { CalendarDays, TrendingUp, DollarSign, Scissors, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default async function FechamentoMensalPage({ searchParams }: { searchParams: { mes?: string; ano?: string; barbeiro?: string } }) {
  const tenantId = await getTenantId();

  const now = new Date();
  const year = parseInt(searchParams.ano ?? String(now.getFullYear()));
  const month = parseInt(searchParams.mes ?? String(now.getMonth() + 1));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const prevDate = new Date(year, month - 2, 1);
  const nextDate = new Date(year, month, 1);
  const prevLink = `/dashboard/fechamento-mensal?mes=${prevDate.getMonth() + 1}&ano=${prevDate.getFullYear()}`;
  const nextLink = `/dashboard/fechamento-mensal?mes=${nextDate.getMonth() + 1}&ano=${nextDate.getFullYear()}`;
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const selectedBarbeiro = searchParams.barbeiro || 'all';
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER', tenantId }, select: { id: true, name: true }, orderBy: { name: 'asc' } });
  const monthLabel = start.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const [appointments, sales, billsPaid] = await Promise.all([
    prisma.appointment.findMany({
      where: { tenantId, status: 'COMPLETED', paymentStatus: 'PAID', scheduledAt: { gte: start, lt: end }, ...(selectedBarbeiro !== 'all' ? { barberId: selectedBarbeiro } : {}) },
      include: { barber: { select: { name: true } } },
    }),
    prisma.sale.findMany({
      where: { tenantId, createdAt: { gte: start, lt: end } },
    }),
    prisma.bill.findMany({
      where: { tenantId, type: 'PAGAR', status: 'PAID', paidAt: { gte: start, lt: end } },
    }),
  ]);

  const receitaServicos = appointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const receitaProdutos = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const receitaTotal = receitaServicos + receitaProdutos;
  const totalDespesas = billsPaid.reduce((sum, b) => sum + b.amountInCents, 0);
  const totalComissoes = appointments.reduce((sum, a) => {
    const rate = (a.commissionPercentageAtBooking ?? 50) / 100;
    return sum + a.totalPrice * rate;
  }, 0);
  const lucroLiquido = receitaTotal - totalDespesas - totalComissoes;

  // Por barbeiro
  const barberMap = new Map<string, { name: string; revenue: number; commission: number; count: number }>();
  for (const a of appointments) {
    const key = a.barberId ?? 'sem-barbeiro';
    const rate = (a.commissionPercentageAtBooking ?? 50) / 100;
    const existing = barberMap.get(key) ?? { name: a.barber?.name ?? '—', revenue: 0, commission: 0, count: 0 };
    existing.revenue += a.totalPrice;
    existing.commission += a.totalPrice * rate;
    existing.count += 1;
    barberMap.set(key, existing);
  }
  const barberData = Array.from(barberMap.values()).sort((a, b) => b.revenue - a.revenue);

  // Top dias
  const dayMap = new Map<string, number>();
  for (const a of appointments) {
    const d = new Date(a.scheduledAt).toLocaleDateString('pt-BR');
    dayMap.set(d, (dayMap.get(d) ?? 0) + a.totalPrice);
  }
  const topDays = Array.from(dayMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon"><CalendarDays className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Fechamento Mensal</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5 capitalize">{monthLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={prevLink} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold capitalize min-w-[160px] text-center">
            {monthLabel}
          </span>
          <Link href={isCurrentMonth ? '#' : nextLink} className={`w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 transition-colors ${isCurrentMonth ? 'text-zinc-700 pointer-events-none' : 'text-zinc-400 hover:text-white hover:border-zinc-700'}`}>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Barbeiro:</span>
          <div className="flex flex-wrap gap-1.5">
            <a
              href={`/dashboard/fechamento-mensal?mes=${month}&ano=${year}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedBarbeiro === 'all' ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' : 'bg-zinc-900/40 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'}`}
            >
              Todos
            </a>
            {barbers.map(b => (
              <a
                key={b.id}
                href={`/dashboard/fechamento-mensal?mes=${month}&ano=${year}&barbeiro=${b.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedBarbeiro === b.id ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' : 'bg-zinc-900/40 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'}`}
              >
                {b.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Receita Total', value: fmt(receitaTotal), Icon: TrendingUp, color: 'text-green-400' },
          { label: 'Serviços', value: fmt(receitaServicos), Icon: Scissors, color: 'text-blue-400' },
          { label: 'Produtos', value: fmt(receitaProdutos), Icon: ShoppingBag, color: 'text-purple-400' },
          { label: 'Lucro Líquido', value: fmt(lucroLiquido), Icon: DollarSign, color: lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-xl">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Por barbeiro */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-orange-500" /> Desempenho por Barbeiro
          </h2>
          {barberData.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-8">Sem atendimentos no período.</p>
          ) : (
            <div className="space-y-3">
              {barberData.map(b => (
                <div key={b.name} className="flex items-center justify-between bg-zinc-900/40 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-white font-bold text-sm">{b.name}</p>
                    <p className="text-zinc-500 text-xs">{b.count} atendimentos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-black text-sm">{fmt(b.revenue)}</p>
                    <p className="text-orange-400 text-xs">comissão: {fmt(b.commission)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumo financeiro */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-500" /> Resumo Financeiro
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Receita de Serviços', value: fmt(receitaServicos), color: 'text-green-400' },
              { label: 'Receita de Produtos', value: fmt(receitaProdutos), color: 'text-green-400' },
              { label: '— Comissões dos Barbeiros', value: `- ${fmt(totalComissoes)}`, color: 'text-orange-400' },
              { label: '— Despesas do Mês', value: `- ${fmt(totalDespesas)}`, color: 'text-red-400' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                <span className="text-zinc-400 text-sm">{row.label}</span>
                <span className={`font-bold text-sm ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-white font-black text-sm">Lucro Líquido</span>
              <span className={`font-black text-xl ${lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(lucroLiquido)}</span>
            </div>
          </div>
        </div>
      </div>

      {topDays.length > 0 && (
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-white font-bold text-base mb-4">Top 5 Dias de Maior Faturamento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {topDays.map(([day, value], i) => (
              <div key={day} className="bg-zinc-900/40 rounded-xl p-4 text-center">
                <div className="text-orange-500 font-black text-lg mb-1">#{i + 1}</div>
                <div className="text-white text-sm font-bold">{day}</div>
                <div className="text-green-400 text-xs font-bold mt-1">{fmt(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && sales.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold capitalize">Sem movimentação em {monthLabel}.</p>
        </div>
      )}
    </div>
  );
}
