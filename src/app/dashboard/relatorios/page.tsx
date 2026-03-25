import { prisma } from "@/lib/prisma";
import { Star, TrendingUp, Users, AlertTriangle, Clock, ChevronRight, Gift } from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

async function getRetentionData() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return null;
  const tenantId = tenant.id;

  // Clientes inativos há mais de 30 dias
  const thirtyDaysAgo = subDays(new Date(), 30);
  const fortyFiveDaysAgo = subDays(new Date(), 45);

  // Todos os clientes que já agendaram neste tenant
  const allCustomerAppointments = await prisma.appointment.findMany({
    where: { tenantId },
    include: { customer: true, service: true, barber: true },
    orderBy: { scheduledAt: 'desc' }
  });

  // Agrupar por cliente e pegar a última visita
  const customerMap = new Map<string, any>();
  for (const appt of allCustomerAppointments) {
    if (!customerMap.has(appt.customerId)) {
      customerMap.set(appt.customerId, {
        customer: appt.customer,
        lastVisit: appt.scheduledAt,
        totalVisits: 0,
        totalSpent: 0,
        lastService: appt.service?.name,
        lastBarber: appt.barber?.name,
      });
    }
    const c = customerMap.get(appt.customerId)!;
    c.totalVisits++;
    c.totalSpent += appt.totalPrice || 0;
  }

  const allCustomers = Array.from(customerMap.values());

  const inactiveCustomers = allCustomers
    .filter(c => c.lastVisit < thirtyDaysAgo)
    .sort((a, b) => a.lastVisit.getTime() - b.lastVisit.getTime());

  const criticalCustomers = allCustomers
    .filter(c => c.lastVisit < fortyFiveDaysAgo);

  // Top clientes (mais visitas)
  const topCustomers = [...allCustomers]
    .sort((a, b) => b.totalVisits - a.totalVisits)
    .slice(0, 5);

  // Avaliações recentes
  const recentReviews = await prisma.review.findMany({
    where: { tenantId },
    include: { customer: true, barber: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Média de avaliação
  const allReviews = await prisma.review.findMany({ where: { tenantId } });
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : "—";

  // Estoque baixo
  const lowStockProducts = await prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      // SQLite doesn't support lte on comparison between columns,
      // so we fetch all and filter
    }
  });
  const alertProducts = lowStockProducts.filter(p => p.stock <= p.minStock);

  return {
    tenant,
    totalCustomers: allCustomers.length,
    inactiveCustomers,
    criticalCustomers: criticalCustomers.length,
    topCustomers,
    recentReviews,
    avgRating,
    alertProducts,
    totalReviews: allReviews.length
  };
}

const formatPrice = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

export default async function RelatoriosPage() {
  const data = await getRetentionData();
  if (!data) return <div className="text-white p-10">Nenhum dado encontrado.</div>;

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl animate-fade-in-up">
      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Relatórios</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Retenção, avaliações e alertas em tempo real</p>
        </div>
      </header>

      {/* CARDS DE MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
        <MetricCard icon={Users} label="Clientes Únicos" value={String(data.totalCustomers)} />
        <MetricCard icon={Star} label="Nota Média" value={String(data.avgRating)} accent />
        <MetricCard icon={AlertTriangle} label="Clientes Sumidos (45+ dias)" value={String(data.criticalCustomers)} danger />
        <MetricCard icon={Gift} label="Avaliações Recebidas" value={String(data.totalReviews)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CLIENTES INATIVOS (RETENÇÃO) */}
        <section className="bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-500 w-6 h-6" /> Clientes Inativos (30+ dias)
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.inactiveCustomers.length === 0 ? (
              <p className="text-zinc-600 text-center py-8 italic">Nenhum cliente inativo. Todos estão voltando! 🎉</p>
            ) : (
              data.inactiveCustomers.map(c => {
                const daysAgo = Math.floor((Date.now() - c.lastVisit.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={c.customer.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-red-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 font-black text-lg">
                        {c.customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{c.customer.name}</p>
                        <p className="text-zinc-500 text-sm">Último: {c.lastService} • {c.totalVisits} visitas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-black text-lg">{daysAgo}d</p>
                      <p className="text-zinc-600 text-xs">sem voltar</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* TOP CLIENTES */}
        <section className="bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <TrendingUp className="text-emerald-500 w-6 h-6" /> Top Clientes Fiéis
          </h3>
          <div className="space-y-4">
            {data.topCustomers.map((c, i) => (
              <div key={c.customer.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${i === 0 ? 'bg-orange-500/20 text-orange-500' : i === 1 ? 'bg-zinc-700/30 text-zinc-300' : 'bg-zinc-800/30 text-zinc-500'}`}>
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-white font-bold">{c.customer.name}</p>
                    <p className="text-zinc-500 text-sm">{c.customer.phone || '—'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-black">{c.totalVisits} visitas</p>
                  <p className="text-zinc-600 text-xs">Gastou {formatPrice(c.totalSpent)}</p>
                </div>
              </div>
            ))}
            {data.topCustomers.length === 0 && (
              <p className="text-zinc-600 text-center py-8 italic">Nenhum dado de clientes ainda.</p>
            )}
          </div>
        </section>

        {/* AVALIAÇÕES RECENTES */}
        <section className="bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Star className="text-yellow-500 w-6 h-6" /> Avaliações Recentes
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.recentReviews.length === 0 ? (
              <p className="text-zinc-600 text-center py-8 italic">Nenhuma avaliação ainda. Os clientes ainda não avaliaram.</p>
            ) : (
              data.recentReviews.map(r => (
                <div key={r.id} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-bold">{r.customer.name}</p>
                    <div className="flex gap-1">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm">Barbeiro: <span className="text-zinc-300">{r.barber.name}</span></p>
                  {r.comment && <p className="text-zinc-400 mt-2 text-sm italic">"{r.comment}"</p>}
                </div>
              ))
            )}
          </div>
        </section>

        {/* ALERTA DE ESTOQUE */}
        <section className="bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="text-amber-500 w-6 h-6" /> Alertas de Estoque Baixo
          </h3>
          <div className="space-y-4">
            {data.alertProducts.length === 0 ? (
              <p className="text-zinc-600 text-center py-8 italic">Estoque saudável! Nenhum produto abaixo do mínimo. 👏</p>
            ) : (
              data.alertProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                  <div>
                    <p className="text-white font-bold">{p.name}</p>
                    <p className="text-zinc-500 text-sm">{formatPrice(p.priceInCents)} • Mínimo: {p.minStock} un.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-black text-2xl">{p.stock}</p>
                    <p className="text-zinc-600 text-xs">restantes</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const MetricCard = ({ icon: Icon, label, value, accent, danger }: { icon: any, label: string, value: string, accent?: boolean, danger?: boolean }) => (
  <div className={`p-6 rounded-[2rem] border ${danger ? 'border-red-500/20 bg-red-500/5' : accent ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-950/80'}`}>
    <Icon className={`w-6 h-6 mb-3 ${danger ? 'text-red-500' : accent ? 'text-yellow-500' : 'text-orange-500'}`} />
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="text-zinc-500 text-sm font-bold mt-1">{label}</p>
  </div>
);
