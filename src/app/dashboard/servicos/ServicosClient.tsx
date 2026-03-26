'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, Pencil, Trash2, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/Toast';
import { createServicoAction, updateServicoAction, deleteServicoAction } from '@/app/actions';

type Servico = { id: string; name: string; durationMinutes: number; priceInCents: number };

const SERVICE_COLORS = [
  { bg: 'bg-orange-500/10', border: 'border-orange-500/15', text: 'text-orange-400', icon: 'bg-orange-500/15' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/15', text: 'text-blue-400', icon: 'bg-blue-500/15' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', text: 'text-emerald-400', icon: 'bg-emerald-500/15' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/15', text: 'text-purple-400', icon: 'bg-purple-500/15' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/15', text: 'text-pink-400', icon: 'bg-pink-500/15' },
];

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',');
}

export function ServicosClient({ initialServicos }: { initialServicos: Servico[] }) {
  const [servicos, setServicos] = useState(initialServicos);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(s: Servico) { setEditing(s); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (editing) {
        await updateServicoAction(editing.id, fd);
        toast('Serviço atualizado!');
      } else {
        await createServicoAction(fd);
        toast('Serviço criado com sucesso!');
      }
      closeModal();
      router.refresh();
    } catch {
      toast('Erro ao salvar serviço.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Excluir o serviço "${name}"?`)) return;
    try {
      await deleteServicoAction(id);
      setServicos(prev => prev.filter(s => s.id !== id));
      toast('Serviço removido.');
    } catch {
      toast('Erro ao excluir serviço.', 'error');
    }
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Serviços</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{servicos.length} serviço{servicos.length !== 1 ? 's' : ''} no cardápio</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/15 active:scale-95 text-sm transition-all gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </header>

      {/* Cards */}
      {servicos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7 text-zinc-700" />
          </div>
          <p className="text-zinc-500 font-medium">Nenhum serviço cadastrado ainda.</p>
          <button onClick={openCreate} className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors">
            + Adicionar primeiro serviço
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {servicos.map((s, i) => {
            const color = SERVICE_COLORS[i % SERVICE_COLORS.length];
            return (
              <div
                key={s.id}
                className={`group relative bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all`}
              >
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(s)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${color.icon} flex items-center justify-center ${color.text}`}>
                  <Briefcase className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-white text-sm leading-tight mb-2">{s.name}</h3>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{s.durationMinutes} min</span>
                  </div>
                </div>

                {/* Price */}
                <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${color.bg} border ${color.border}`}>
                  <span className={`text-sm font-black ${color.text}`}>R$ {formatPrice(s.priceInCents)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-white">{editing ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                <p className="text-zinc-500 text-xs mt-0.5">{editing ? 'Atualize os dados.' : 'Adicione ao cardápio.'}</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Nome do Serviço</Label>
                <Input
                  name="sname"
                  defaultValue={editing?.name}
                  required
                  placeholder="Corte Clássico"
                  className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Duração (min)</Label>
                  <Input
                    name="stime"
                    type="number"
                    defaultValue={editing?.durationMinutes}
                    placeholder="45"
                    className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Preço (R$)</Label>
                  <Input
                    name="sprice"
                    defaultValue={editing ? formatPrice(editing.priceInCents) : ''}
                    placeholder="50,00"
                    className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-11 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 text-sm font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all disabled:opacity-60 active:scale-95"
                >
                  {loading ? 'Salvando...' : editing ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
