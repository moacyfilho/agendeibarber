'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, Loader2, X, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { createBillAction, updateBillAction, markBillPaidAction, deleteBillAction } from './actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Bill = {
  id: string;
  type: string;
  description: string;
  amountInCents: number;
  dueDate: Date | string;
  paidAt: Date | string | null;
  status: string;
  category: string | null;
  notes: string | null;
};

const CATEGORIES_PAGAR = ['Aluguel', 'Energia', 'Água', 'Internet', 'Salário', 'Produto', 'Equipamento', 'Imposto', 'Outros'];
const CATEGORIES_RECEBER = ['Fiado', 'Serviço', 'Produto', 'Parcela', 'Outros'];

function BillModal({ bill, type, onClose }: { bill?: Bill; type: string; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const categories = type === 'PAGAR' ? CATEGORIES_PAGAR : CATEGORIES_RECEBER;

  const dueDateStr = bill?.dueDate
    ? new Date(bill.dueDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    fd.set('type', type);
    const res = bill ? await updateBillAction(bill.id, fd) : await createBillAction(fd);
    setLoading(false);
    if (res && 'error' in res) { setError(res.error); return; }
    onClose();
  }

  const isPagar = type === 'PAGAR';
  const accent = isPagar ? 'border-red-500/50 focus:border-red-500' : 'border-emerald-500/50 focus:border-emerald-500';
  const btnColor = isPagar ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white">
            {bill ? 'Editar' : 'Nova'} Conta a {isPagar ? 'Pagar' : 'Receber'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Descrição *</label>
            <input
              name="description"
              defaultValue={bill?.description}
              required
              placeholder={isPagar ? 'Ex: Aluguel do salão' : 'Ex: Fiado do João'}
              className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none transition-colors ${accent}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Valor (R$) *</label>
              <input
                name="amount"
                defaultValue={bill ? (bill.amountInCents / 100).toFixed(2).replace('.', ',') : ''}
                required
                placeholder="0,00"
                className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none transition-colors ${accent}`}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Vencimento *</label>
              <input
                name="dueDate"
                type="date"
                defaultValue={dueDateStr}
                required
                className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none transition-colors ${accent}`}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Categoria</label>
            <select
              name="category"
              defaultValue={bill?.category ?? ''}
              className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none transition-colors ${accent}`}
            >
              <option value="">Selecionar categoria</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Observação</label>
            <textarea
              name="notes"
              defaultValue={bill?.notes ?? ''}
              rows={2}
              placeholder="Informações adicionais..."
              className={`w-full bg-zinc-900 border rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none transition-colors resize-none ${accent}`}
            />
          </div>
          {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 ${btnColor} text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : bill ? 'Salvar' : 'Adicionar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function ContasClient({ initialBills, type }: { initialBills: Bill[]; type: 'PAGAR' | 'RECEBER' }) {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBill, setEditBill] = useState<Bill | undefined>();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const isPagar = type === 'PAGAR';

  function closeModal() { setModalOpen(false); setEditBill(undefined); window.location.reload(); }
  function openEdit(b: Bill) { setEditBill(b); setModalOpen(true); }

  async function handlePaid(b: Bill) {
    if (!confirm(`Marcar "${b.description}" como ${isPagar ? 'pago' : 'recebido'}?`)) return;
    setLoadingId(b.id);
    await markBillPaidAction(b.id);
    setBills(bs => bs.map(x => x.id === b.id ? { ...x, status: 'PAID', paidAt: new Date() } : x));
    setLoadingId(null);
  }

  async function handleDelete(b: Bill) {
    if (!confirm(`Excluir "${b.description}"?`)) return;
    setLoadingId(b.id);
    await deleteBillAction(b.id);
    setBills(bs => bs.filter(x => x.id !== b.id));
    setLoadingId(null);
  }

  const fmt = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const pending = bills.filter(b => b.status === 'PENDING');
  const paid = bills.filter(b => b.status === 'PAID');
  const totalPending = pending.reduce((a, b) => a + b.amountInCents, 0);
  const totalPaid = paid.reduce((a, b) => a + b.amountInCents, 0);

  const now = new Date();

  function getStatus(b: Bill) {
    if (b.status === 'PAID') return 'paid';
    if (new Date(b.dueDate) < now) return 'overdue';
    return 'pending';
  }

  const accentColor = isPagar
    ? { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/8', btnBg: 'bg-red-500 hover:bg-red-600', icon: 'text-red-400' }
    : { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/8', btnBg: 'bg-emerald-500 hover:bg-emerald-600', icon: 'text-emerald-400' };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
      {modalOpen && <BillModal bill={editBill} type={type} onClose={closeModal} />}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className={`bg-zinc-950/60 border ${accentColor.border} rounded-2xl p-5`}>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">
            {isPagar ? 'A Pagar' : 'A Receber'}
          </p>
          <p className={`text-2xl font-black ${accentColor.text}`}>{fmt(totalPending)}</p>
          <p className="text-zinc-600 text-xs font-medium mt-0.5">{pending.length} conta{pending.length !== 1 ? 's' : ''} pendente{pending.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-5">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">
            {isPagar ? 'Já Pago' : 'Já Recebido'}
          </p>
          <p className="text-2xl font-black text-zinc-300">{fmt(totalPaid)}</p>
          <p className="text-zinc-600 text-xs font-medium mt-0.5">{paid.length} conta{paid.length !== 1 ? 's' : ''} {isPagar ? 'paga' : 'recebida'}{paid.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="col-span-2 md:col-span-1 flex items-center justify-end">
          <button
            onClick={() => { setEditBill(undefined); setModalOpen(true); }}
            className={`flex items-center gap-2 ${accentColor.btnBg} text-white font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg active:scale-95 w-full md:w-auto justify-center`}
          >
            <Plus className="w-4 h-4" /> Nova Conta
          </button>
        </div>
      </div>

      {/* Empty state */}
      {bills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-950/40 border border-zinc-900/60 rounded-2xl">
          <div className={`w-14 h-14 ${accentColor.bg} border ${accentColor.border} rounded-2xl flex items-center justify-center mb-4`}>
            <AlertCircle className={`w-6 h-6 ${accentColor.icon}`} />
          </div>
          <p className="text-white font-bold mb-1">Nenhuma conta cadastrada</p>
          <p className="text-zinc-600 text-sm font-medium mb-5">
            {isPagar ? 'Cadastre suas despesas fixas e variáveis.' : 'Registre valores a receber de clientes.'}
          </p>
          <button
            onClick={() => { setEditBill(undefined); setModalOpen(true); }}
            className={`flex items-center gap-2 ${accentColor.btnBg} text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all`}
          >
            <Plus className="w-4 h-4" /> Adicionar Conta
          </button>
        </div>
      )}

      {/* Pending bills */}
      {pending.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Pendentes</p>
          <div className="flex flex-col gap-3">
            {pending.map(b => {
              const st = getStatus(b);
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${
                    st === 'overdue'
                      ? 'border-red-500/25 bg-red-500/[0.04]'
                      : 'border-zinc-800/60 bg-zinc-950/40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${st === 'overdue' ? 'bg-red-500/15' : 'bg-zinc-900'}`}>
                    {st === 'overdue'
                      ? <AlertCircle className="w-4 h-4 text-red-400" />
                      : <Clock className="w-4 h-4 text-zinc-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{b.description}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {b.category && <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">{b.category}</span>}
                      <span className={`text-[10px] font-medium ${st === 'overdue' ? 'text-red-400' : 'text-zinc-500'}`}>
                        {st === 'overdue' ? '⚠ Venceu em ' : 'Vence '}
                        {format(new Date(b.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <p className={`font-black text-lg flex-shrink-0 ${isPagar ? 'text-red-400' : 'text-emerald-400'}`}>
                    {fmt(b.amountInCents)}
                  </p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handlePaid(b)}
                      disabled={loadingId === b.id}
                      title={isPagar ? 'Marcar como pago' : 'Marcar como recebido'}
                      className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all disabled:opacity-50"
                    >
                      {loadingId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      disabled={loadingId === b.id}
                      className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paid bills */}
      {paid.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">
            {isPagar ? 'Pagas' : 'Recebidas'}
          </p>
          <div className="flex flex-col gap-2">
            {paid.map(b => (
              <div key={b.id} className="flex items-center gap-4 p-4 border border-zinc-900/40 bg-zinc-950/20 rounded-xl opacity-60">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/8 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-500 font-bold text-sm truncate line-through">{b.description}</p>
                  <p className="text-zinc-700 text-[10px] font-medium">
                    {isPagar ? 'Pago' : 'Recebido'} em {b.paidAt ? format(new Date(b.paidAt), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                  </p>
                </div>
                <p className="font-bold text-zinc-600 flex-shrink-0">{fmt(b.amountInCents)}</p>
                <button
                  onClick={() => handleDelete(b)}
                  disabled={loadingId === b.id}
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800/50 flex items-center justify-center text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
