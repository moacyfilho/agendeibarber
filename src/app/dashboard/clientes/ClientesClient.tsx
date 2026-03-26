'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Users, Pencil, Trash2, Star, Phone, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/Toast';
import { createClienteAction, updateClienteAction, deleteClienteAction } from '@/app/actions';

type Cliente = {
  id: string;
  name: string;
  phone: string | null;
  loyaltyCards: { totalVisits: number; rewardThreshold: number }[];
};

const AVATAR_COLORS = [
  'from-orange-500 to-orange-700',
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-purple-500 to-purple-700',
  'from-pink-500 to-pink-700',
];

export function ClientesClient({ initialClientes }: { initialClientes: Cliente[] }) {
  const [clientes, setClientes] = useState(initialClientes);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(c: Cliente) { setEditing(c); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (editing) {
        await updateClienteAction(editing.id, fd);
        toast('Cliente atualizado com sucesso!');
      } else {
        await createClienteAction(fd);
        toast('Cliente cadastrado com sucesso!');
      }
      closeModal();
      router.refresh();
    } catch {
      toast('Erro ao salvar cliente.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Excluir o cliente "${name}"?`)) return;
    try {
      await deleteClienteAction(id);
      setClientes(prev => prev.filter(c => c.id !== id));
      toast('Cliente removido.');
    } catch {
      toast('Erro ao excluir cliente.', 'error');
    }
  }

  const filtered = clientes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? '').includes(search)
  );

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Clientes</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} cadastrado{clientes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/15 active:scale-95 text-sm transition-all gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </header>

      {/* Search */}
      <div className="mb-6 relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl h-11 pl-4 pr-10 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-zinc-700" />
          </div>
          <p className="text-zinc-500 font-medium">{search ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}</p>
          {!search && (
            <button onClick={openCreate} className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors">
              + Adicionar primeiro cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((client, i) => {
            const card = client.loyaltyCards[0];
            const visits = card?.totalVisits ?? 0;
            const threshold = card?.rewardThreshold ?? 10;
            const progress = Math.min((visits / threshold) * 100, 100);
            const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={client.id}
                className="group bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-black text-lg shadow-lg flex-shrink-0`}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(client)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm leading-tight mb-1">{client.name}</h3>
                  {client.phone ? (
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-700 text-xs">Sem telefone</span>
                  )}
                </div>

                {/* Loyalty */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span>Fidelidade</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-300">{visits}/{threshold}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
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
                <h2 className="text-lg font-black text-white">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <p className="text-zinc-500 text-xs mt-0.5">{editing ? 'Atualize os dados do cliente.' : 'Adicione um novo cliente.'}</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Nome Completo</Label>
                <Input
                  name="name"
                  defaultValue={editing?.name}
                  required
                  placeholder="João Silva"
                  className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">WhatsApp</Label>
                <Input
                  name="phone"
                  defaultValue={editing?.phone ?? ''}
                  placeholder="(92) 99999-9999"
                  className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                />
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
                  {loading ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar'}
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
