import { Building2, ShieldCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { NewTenantModal } from "./NewTenantModal"
import { TenantRow } from "./TenantRow"

export default async function SuperAdminDashboard() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-10 md:p-14 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER SUPER ADMIN */}
      <header className="mb-14 flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <BadgeAdmin />
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 mb-3 tracking-tight mt-4">
            Gestão Master (SaaS)
          </h2>
          <p className="text-zinc-400 font-medium text-lg flex items-center gap-2">
            Visão isolada do Dono do Software. Nenhuma barbearia pode acessar aqui.
          </p>
        </div>
        
        <NewTenantModal />
      </header>

      {/* METRICAS DO SAAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard title="Total de Assinantes" value="1.204" desc="+12 novas este mês" />
        <MetricCard title="MRR (Faturamento Fixo)" value="R$ 84k" desc="Baseado nos planos mantidos" />
        <MetricCard title="Taxa de Churn (%)" value="1.2%" desc="Considerado Saudável" />
      </section>

      {/* LISTA DE INSTÂNCIAS (TENANTS) */}
      <section className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-8 border-b border-zinc-900/50 pb-6 flex items-center gap-3">
          <Building2 className="text-emerald-500 w-8 h-8" /> Clientes B2B (Barbearias Registradas)
        </h3>
        
        <div className="flex flex-col gap-4">
          {tenants.map(t => (
            <TenantRow key={t.id} t={t} />
          ))}
          {tenants.length === 0 && (
            <div className="text-center py-20 text-zinc-600 font-bold italic">
               Nenhuma barbearia registrada no ecossistema ainda.
            </div>
          )}
        </div>
      </section>

      {/* FOOTER OU INFO EXTRA SE PRECISAR */}
    </div>
  );
}

// Sub-componentes do Super Admin para limpar o código principal
const BadgeAdmin = () => (
  <div className="flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 w-fit px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
    <ShieldCheck className="w-4 h-4" /> SUPER ADMIN
  </div>
);

const MetricCard = ({ title, value, desc }: { title: string, value: string, desc: string }) => (
  <div className="p-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-900 rounded-[2rem] shadow-xl hover:border-emerald-500/30 transition-colors">
    <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-4">{title}</h3>
    <p className="text-4xl lg:text-5xl font-black text-white">{value}</p>
    <p className="text-emerald-500 font-bold text-sm mt-4 bg-emerald-500/10 w-fit px-3 py-1 rounded-lg border border-emerald-500/20">{desc}</p>
  </div>
);
