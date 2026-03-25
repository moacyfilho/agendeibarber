"use client";

import { Power, Loader2, Trash2, ExternalLink, Users, Calendar, Briefcase, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toggleTenantStatusAction, deleteTenantAction, updateTenantPlanAction } from "@/app/actions";
import { useState } from "react";
import { EditTenantModal } from "./EditTenantModal";

const PLANS = [
  { value: 'STARTER', label: 'Starter R$49,90', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { value: 'PROFISSIONAL', label: 'Profissional R$99,90', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { value: 'PREMIUM', label: 'Premium R$149,90', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
];

export function TenantRow({ t }: { t: any }) {
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleTenantStatusAction(t.id, t.isActive);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlanChange(plan: string) {
    if (plan === (t.plan || 'FREE')) return;
    setPlanLoading(true);
    try {
      await updateTenantPlanAction(t.id, plan);
    } catch (err) {
      console.error(err);
    } finally {
      setPlanLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente "${t.name}"? Todos os dados serão apagados.`)) return;
    setLoading(true);
    try {
      await deleteTenantAction(t.id);
    } catch (err) {
      alert("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  }

  const userCount = t._count?.users ?? 0;
  const serviceCount = t._count?.services ?? 0;
  const appointmentCount = t._count?.appointments ?? 0;

  return (
    <div
      className={`group relative flex flex-col lg:flex-row lg:justify-between lg:items-center p-5 md:p-6 border rounded-xl transition-all duration-300 ${
        t.isActive
          ? 'border-zinc-900 bg-zinc-950/30 hover:bg-zinc-950/60 hover:border-emerald-500/20'
          : 'border-red-900/20 bg-red-950/5 opacity-75 hover:opacity-100'
      }`}
    >
      {/* Left: Identity */}
      <div className="flex items-start gap-4 min-w-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all flex-shrink-0 ${
            t.isActive
              ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5'
              : 'bg-red-950/30 border border-red-900/30 text-red-500/50'
          }`}
        >
          {t.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="font-bold text-white text-base truncate">{t.name}</p>
            {!t.isActive && (
              <span className="text-[8px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Bloqueado
              </span>
            )}
            {t.isActive && (
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Ativo
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <a
              href={`/${t.slug}`}
              target="_blank"
              className="group/link flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all w-fit"
            >
              <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover/link:border-emerald-500/30">
                <ExternalLink className="w-2.5 h-2.5 text-zinc-600 group-hover/link:text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-700 uppercase leading-none mb-0.5">Agendamento</span>
                <span className="text-[11px] font-bold text-zinc-400 group-hover/link:text-emerald-400 tracking-tight transition-colors">/{t.slug}</span>
              </div>
            </a>

            <a
              href={`/${t.slug}/painel`}
              target="_blank"
              className="group/link flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-orange-500/20 hover:bg-orange-500/5 transition-all w-fit"
            >
              <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover/link:border-orange-500/30">
                <Briefcase className="w-2.5 h-2.5 text-zinc-600 group-hover/link:text-orange-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-700 uppercase leading-none mb-0.5">Painel Admin</span>
                <span className="text-[11px] font-bold text-zinc-400 group-hover/link:text-orange-400 tracking-tight transition-colors">/{t.slug}/painel</span>
              </div>
            </a>
          </div>

          {/* Stats mini-bar */}
          <div className="flex items-center gap-3 mt-4">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
              <Users className="w-3 h-3 opacity-50" /> {userCount} <span className="text-[9px] opacity-40 font-medium">users</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
              <Briefcase className="w-3 h-3 opacity-50" /> {serviceCount} <span className="text-[9px] opacity-40 font-medium">serviços</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
              <Calendar className="w-3 h-3 opacity-50" /> {appointmentCount} <span className="text-[9px] opacity-40 font-medium">slots</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Metadata + Actions */}
      <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-600 bg-zinc-900/50 border border-zinc-800/50 px-2.5 py-1.5 rounded-lg">
          <Clock className="w-2.5 h-2.5" />
          {format(new Date(t.createdAt), "dd MMM yyyy", { locale: ptBR })}
        </div>

        <div className="flex items-center gap-1 bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-1">
          {PLANS.map((p) => {
            const active = (t.plan || 'FREE') === p.value;
            return (
              <button
                key={p.value}
                onClick={() => handlePlanChange(p.value)}
                disabled={planLoading}
                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all disabled:opacity-50 ${
                  active ? p.color + ' border' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {planLoading && active ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : p.label}
              </button>
            );
          })}
        </div>

        <EditTenantModal t={t} />

        <button
          onClick={handleDelete}
          disabled={loading}
          title="Excluir Barbearia"
          className="w-9 h-9 rounded-lg bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleToggle}
          disabled={loading}
          title={t.isActive ? "Bloquear Barbearia" : "Ativar Barbearia"}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all disabled:opacity-50 ${
            t.isActive
              ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
          }`}
        >
          {loading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
