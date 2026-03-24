import { Building2, Plus, ArrowRight, ShieldCheck, Power } from "lucide-react"

export default function SuperAdminDashboard() {
  const tenants = [
    { id: 1, name: "Barbearia do João", slug: "barbearia-joao", plan: "Pro", since: "Fev 2024", status: "Ativo" },
    { id: 2, name: "Navalha de Ouro", slug: "navalha-ouro", plan: "Basic", since: "Mar 2024", status: "Ativo" },
    { id: 3, name: "Old School Barber", slug: "old-school", plan: "Elite", since: "Jan 2024", status: "Bloqueado" },
  ];

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
        
        <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold h-14 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center gap-2">
          <Plus className="w-6 h-6" /> Cadastrar Nova Barbearia
        </button>
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
            <div key={t.id} className="flex flex-col md:flex-row md:justify-between md:items-center p-6 border border-zinc-800 rounded-3xl bg-zinc-950/50 hover:bg-zinc-900 hover:border-emerald-500/30 transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center font-black text-zinc-500 text-2xl group-hover:text-emerald-500 transition-colors">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-white text-xl mb-1">{t.name}</p>
                  <p className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    app.agendeibarber.com.br/<span className="text-emerald-400">{t.slug}</span>
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 flex flex-wrap items-center gap-4">
                <span className="font-bold text-sm bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl border border-zinc-700">
                  Plano: {t.plan}
                </span>
                {t.status === "Ativo" ? (
                  <span className="font-black text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl tracking-widest uppercase">
                    PAGAMENTO OK
                  </span>
                ) : (
                  <span className="font-black text-[10px] text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl tracking-widest uppercase">
                    INADIMPLENTE
                  </span>
                )}
                <button className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all">
                  <Power className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
