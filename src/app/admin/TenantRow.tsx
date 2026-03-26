"use client";

import { Power, Loader2, Trash2, ExternalLink, Users, Calendar, Briefcase, Clock, Crown, Star, Package, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toggleTenantStatusAction, deleteTenantAction, updateTenantPlanAction } from "@/app/actions";
import { useState } from "react";
import { EditTenantModal } from "./EditTenantModal";

const PLANS = [
  { value: 'STARTER',      label: 'Starter',      price: 'R$49',  Icon: Package, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', dot: 'bg-emerald-500' },
  { value: 'PROFISSIONAL', label: 'Pro',           price: 'R$99',  Icon: Star,    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',   dot: 'bg-orange-500' },
  { value: 'PREMIUM',      label: 'Premium',       price: 'R$149', Icon: Crown,   color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',   dot: 'bg-purple-500' },
] as const;

const PLAN_PRICES: Record<string, number> = {
  STARTER: 49.90, PROFISSIONAL: 99.90, PREMIUM: 149.90
};

const AVATAR_COLORS: Record<string, string> = {
  STARTER:      'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
  PROFISSIONAL: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
  PREMIUM:      'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
  FREE:         'from-zinc-700/20 to-zinc-800/10 border-zinc-700/30 text-zinc-500',
};

export function TenantRow({ t }: { t: any }) {
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = t.plan || 'FREE';
  const avatarStyle = AVATAR_COLORS[plan] || AVATAR_COLORS.FREE;
  const monthlyRevenue = PLAN_PRICES[plan];

  async function handleToggle() {
    setLoading(true);
    setError('');
    try {
      await toggleTenantStatusAction(t.id, t.isActive);
    } catch {
      setError('Erro ao alterar status.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePlanChange(newPlan: string) {
    if (newPlan === plan) return;
    setPlanLoading(true);
    setError('');
    try {
      await updateTenantPlanAction(t.id, newPlan);
    } catch {
      setError('Erro ao atualizar plano.');
    } finally {
      setPlanLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Excluir permanentemente "${t.name}"? Todos os dados serão apagados e esta ação não pode ser desfeita.`)) return;
    setLoading(true);
    setError('');
    try {
      await deleteTenantAction(t.id);
    } catch {
      setError('Erro ao excluir.');
      setLoading(false);
    }
  }

  const userCount = t._count?.users ?? 0;
  const serviceCount = t._count?.services ?? 0;
  const appointmentCount = t._count?.appointments ?? 0;

  return (
    <div className={`group relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-5 md:p-6 border rounded-2xl transition-all duration-200 ${
      t.isActive
        ? 'border-zinc-800/60 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700/60'
        : 'border-red-900/20 bg-red-950/5 opacity-70 hover:opacity-90'
    }`}>

      {/* LEFT: Avatar + Identity */}
      <div className="flex items-start gap-4 min-w-0 flex-1">

        {/* Gradient Avatar */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarStyle} border flex items-center justify-center font-black text-xl flex-shrink-0 transition-transform group-hover:scale-105`}>
          {t.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          {/* Name + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-black text-white text-base">{t.name}</p>
            {!t.isActive && (
              <span className="text-[8px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                Bloqueado
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <a
              href={`/${t.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:border-emerald-500/25 hover:text-emerald-400 transition-all text-zinc-500 text-[10px] font-bold"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              /{t.slug}
            </a>
            <a
              href={`/${t.slug}/painel`}
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:border-orange-500/25 hover:text-orange-400 transition-all text-zinc-500 text-[10px] font-bold"
            >
              <Briefcase className="w-2.5 h-2.5" />
              painel
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
              <Users className="w-3 h-3 opacity-50" /> {userCount}
              <span className="text-[9px] text-zinc-700 font-normal">users</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
              <Briefcase className="w-3 h-3 opacity-50" /> {serviceCount}
              <span className="text-[9px] text-zinc-700 font-normal">serv.</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
              <Calendar className="w-3 h-3 opacity-50" /> {appointmentCount}
              <span className="text-[9px] text-zinc-700 font-normal">agend.</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
              <Clock className="w-3 h-3 opacity-50" />
              {format(new Date(t.createdAt), "dd MMM yy", { locale: ptBR })}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Plan + Revenue + Actions */}
      <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap xl:flex-shrink-0">

        {/* Monthly Revenue badge */}
        {monthlyRevenue && (
          <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400/70 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1.5 rounded-lg">
            <DollarSign className="w-3 h-3" />
            {monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
          </div>
        )}

        {/* Plan Selector */}
        <div className="flex items-center gap-0.5 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-1">
          {PLANS.map((p) => {
            const active = plan === p.value;
            return (
              <button
                key={p.value}
                onClick={() => handlePlanChange(p.value)}
                disabled={planLoading}
                title={`${p.label} ${p.price}/mês`}
                className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                  active ? `${p.color} border` : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
                }`}
              >
                {planLoading && active
                  ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  : <p.Icon className="w-2.5 h-2.5" />
                }
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            );
          })}
          {plan === 'FREE' && (
            <span className="text-[9px] font-bold text-zinc-600 px-2.5 py-1.5">Free</span>
          )}
        </div>

        <EditTenantModal t={t} />

        <button
          onClick={handleDelete}
          disabled={loading}
          title="Excluir barbearia"
          className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/25 transition-all disabled:opacity-40"
        >
          {loading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleToggle}
          disabled={loading}
          title={t.isActive ? "Bloquear" : "Ativar"}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40 ${
            t.isActive
              ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white hover:shadow-[0_0_14px_rgba(16,185,129,0.3)]'
              : 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.3)] hover:bg-emerald-400'
          }`}
        >
          {loading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Inline error */}
      {error && (
        <p className="absolute bottom-2 right-4 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
}
