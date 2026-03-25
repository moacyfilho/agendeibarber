'use client';
import { useState } from 'react';
import { CreditCard, Plus, Pencil, Trash2, Power, Loader2, X, Check, Users } from 'lucide-react';
import {
  createMembershipPlanAction,
  updateMembershipPlanAction,
  toggleMembershipPlanAction,
  deleteMembershipPlanAction,
} from './actions';

type Plan = {
  id: string;
  name: string;
  description: string | null;
  priceInCents: number;
  billingCycle: string;
  serviceNames: string;
  isActive: boolean;
  activeCount: number;
};

const CYCLES = ['MENSAL', 'TRIMESTRAL', 'ANUAL'];

function PlanModal({
  plan,
  onClose,
}: {
  plan?: Plan;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = plan
      ? await updateMembershipPlanAction(plan.id, fd)
      : await createMembershipPlanAction(fd);
    setLoading(false);
    if (res && 'error' in res) { setError(res.error); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white">
            {plan ? 'Editar Plano' : 'Novo Plano de Assinatura'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Nome do Plano *</label>
            <input
              name="name"
              defaultValue={plan?.name}
              required
              placeholder="Ex: Plano Corte Mensal"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Preço (R$) *</label>
              <input
                name="price"
                defaultValue={plan ? (plan.priceInCents / 100).toFixed(2).replace('.', ',') : ''}
                required
                placeholder="69,90"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Ciclo</label>
              <select
                name="billingCycle"
                defaultValue={plan?.billingCycle ?? 'MENSAL'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
              >
                {CYCLES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Serviços incluídos</label>
            <input
              name="serviceNames"
              defaultValue={plan?.serviceNames}
              placeholder="Ex: Corte de cabelo, Barba"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
            />
            <p className="text-[10px] text-zinc-600 mt-1">Separe por vírgula</p>
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Descrição</label>
            <textarea
              name="description"
              defaultValue={plan?.description ?? ''}
              rows={2}
              placeholder="Descreva os benefícios do plano"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan ? 'Salvar Alterações' : 'Criar Plano'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function PlanosList({ initialPlanos }: { initialPlanos: Plan[] }) {
  const [planos, setPlanos] = useState<Plan[]>(initialPlanos);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | undefined>();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function openCreate() { setEditPlan(undefined); setModalOpen(true); }
  function openEdit(p: Plan) { setEditPlan(p); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditPlan(undefined); window.location.reload(); }

  async function handleToggle(p: Plan) {
    setLoadingId(p.id);
    await toggleMembershipPlanAction(p.id, p.isActive);
    setPlanos(ps => ps.map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x));
    setLoadingId(null);
  }

  async function handleDelete(p: Plan) {
    if (!confirm(`Excluir o plano "${p.name}"?`)) return;
    setLoadingId(p.id);
    await deleteMembershipPlanAction(p.id);
    setPlanos(ps => ps.filter(x => x.id !== p.id));
    setLoadingId(null);
  }

  const formatPrice = (cents: number) =>
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
      {modalOpen && <PlanModal plan={editPlan} onClose={closeModal} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Planos de Assinatura</h1>
            <p className="text-zinc-500 text-sm font-medium mt-0.5">Crie planos mensais para fidelizar seus clientes</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_2px_16px_rgba(249,115,22,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4" /> Novo Plano
        </button>
      </div>

      {/* Empty state */}
      {planos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-7 h-7 text-zinc-600" />
          </div>
          <p className="text-white font-bold text-base mb-1">Nenhum plano criado ainda</p>
          <p className="text-zinc-600 text-sm font-medium mb-5">Crie planos mensais para seus clientes assinarem.</p>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-6 py-3 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Criar Primeiro Plano
          </button>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {planos.map(p => (
          <div
            key={p.id}
            className={`relative bg-[#0a0a0a] border rounded-2xl p-6 flex flex-col gap-3 transition-all ${
              p.isActive ? 'border-zinc-800/80' : 'border-zinc-900/40 opacity-60'
            }`}
          >
            {/* Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <button
                onClick={() => openEdit(p)}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDelete(p)}
                disabled={loadingId === p.id}
                className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all disabled:opacity-50"
              >
                {loadingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              </button>
            </div>

            {/* Header */}
            <div className="pr-20">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <CreditCard className="w-3 h-3 text-orange-400" />
                </div>
                <p className="font-bold text-white text-sm truncate">{p.name}</p>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                {p.billingCycle.charAt(0) + p.billingCycle.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Price */}
            <div>
              <p className="text-2xl font-black text-orange-400">{formatPrice(p.priceInCents)}</p>
              <p className="text-[11px] text-zinc-600 font-medium">Usos ilimitados</p>
            </div>

            {/* Description */}
            {p.description && (
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">{p.description}</p>
            )}

            {/* Services */}
            {p.serviceNames && (
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-wider mb-1">Serviços:</p>
                <p className="text-zinc-400 text-xs font-medium">{p.serviceNames}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <Users className="w-3 h-3" />
                {p.activeCount} assinante{p.activeCount !== 1 ? 's' : ''} ativo{p.activeCount !== 1 ? 's' : ''}
              </div>
              <button
                onClick={() => handleToggle(p)}
                disabled={loadingId === p.id}
                className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all disabled:opacity-50 ${
                  p.isActive
                    ? 'text-emerald-400 bg-emerald-500/8 border-emerald-500/20'
                    : 'text-zinc-500 bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {loadingId === p.id
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : p.isActive ? <><Check className="w-3 h-3" /> Ativo</> : <><Power className="w-3 h-3" /> Inativo</>
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
