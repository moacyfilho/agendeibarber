'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Package, Plus, AlertTriangle, Pencil, Trash2, X, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/Toast';
import { createProductAction, updateProductAction, deleteProductAction } from '@/app/actions';

type Product = { id: string; name: string; priceInCents: number; stock: number; minStock: number };

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',');
}

export function ProdutosClient({ initialProdutos }: { initialProdutos: Product[] }) {
  const [produtos, setProdutos] = useState(initialProdutos);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const router = useRouter();
  const { toast } = useToast();

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(p: Product) { setEditing(p); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (editing) {
        await updateProductAction(editing.id, fd);
        toast('Produto atualizado!');
      } else {
        await createProductAction(fd);
        toast('Produto adicionado ao estoque!');
      }
      closeModal();
      router.refresh();
    } catch {
      toast('Erro ao salvar produto.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Excluir "${name}" do estoque?`)) return;
    try {
      await deleteProductAction(id);
      setProdutos(prev => prev.filter(p => p.id !== id));
      toast('Produto removido.');
    } catch {
      toast('Erro ao excluir produto.', 'error');
    }
  }

  const lowStock = produtos.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const outOfStock = produtos.filter(p => p.stock <= 0);

  const filtered = produtos.filter(p => {
    if (filter === 'low') return p.stock > 0 && p.stock <= p.minStock;
    if (filter === 'out') return p.stock <= 0;
    return true;
  });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Produtos</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{produtos.length} produto{produtos.length !== 1 ? 's' : ''} no estoque</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/15 active:scale-95 text-sm transition-all gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </header>

      {/* Alert banners */}
      {outOfStock.length > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">
          <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300 font-medium">
            {outOfStock.length} produto{outOfStock.length > 1 ? 's' : ''} esgotado{outOfStock.length > 1 ? 's' : ''}: {outOfStock.map(p => p.name).join(', ')}
          </span>
        </div>
      )}
      {lowStock.length > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-yellow-500/8 border border-yellow-500/15 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <span className="text-sm text-yellow-300 font-medium">
            {lowStock.length} produto{lowStock.length > 1 ? 's' : ''} com estoque baixo
          </span>
        </div>
      )}

      {/* Filter tabs */}
      {produtos.length > 0 && (
        <div className="flex gap-2 mb-6">
          {(['all', 'low', 'out'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'bg-zinc-900/40 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {f === 'all' ? `Todos (${produtos.length})` : f === 'low' ? `Baixo (${lowStock.length})` : `Esgotado (${outOfStock.length})`}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Package className="w-7 h-7 text-zinc-700" />
          </div>
          <p className="text-zinc-500 font-medium">
            {filter !== 'all' ? 'Nenhum produto nessa categoria.' : 'Nenhum produto no estoque.'}
          </p>
          {filter === 'all' && (
            <button onClick={openCreate} className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors">
              + Adicionar primeiro produto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => {
            const isOut = p.stock <= 0;
            const isLow = !isOut && p.stock <= p.minStock;
            const stockPct = Math.min((p.stock / Math.max(p.minStock * 2, 1)) * 100, 100);

            return (
              <div
                key={p.id}
                className={`group relative bg-zinc-900/40 border rounded-2xl p-5 flex flex-col gap-4 transition-all
                  ${isOut
                    ? 'border-red-500/20 hover:border-red-500/30'
                    : isLow
                    ? 'border-yellow-500/20 hover:border-yellow-500/30'
                    : 'border-zinc-800/60 hover:border-zinc-700/60'
                  } hover:bg-zinc-900/60`}
              >
                {/* Status badge */}
                <div className="absolute top-4 right-4 flex gap-1 items-center">
                  {isOut ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/15">Esgotado</span>
                  ) : isLow ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/15">Baixo</span>
                  ) : (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">OK</span>
                  )}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-orange-400">
                  <Package className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 pr-2">
                  <h3 className="font-bold text-white text-sm leading-tight mb-3">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${isOut ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-zinc-100'}`}>
                      {p.stock}
                    </span>
                    <span className="text-zinc-600 text-xs uppercase font-bold">unidades</span>
                  </div>
                  {/* Stock bar */}
                  <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isOut ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                      style={{ width: `${isOut ? 0 : stockPct}%` }}
                    />
                  </div>
                </div>

                {/* Price + actions */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50">
                  <span className="text-sm font-black text-emerald-400">{BRL.format(p.priceInCents / 100)}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(p)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
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
                <h2 className="text-lg font-black text-white">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
                <p className="text-zinc-500 text-xs mt-0.5">{editing ? 'Atualize os dados.' : 'Adicione um item ao estoque.'}</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Nome do Produto</Label>
                <Input
                  name="name"
                  defaultValue={editing?.name}
                  required
                  placeholder="Pomada Modeladora"
                  className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Preço (R$)</Label>
                  <Input
                    name="price"
                    defaultValue={editing ? formatPrice(editing.priceInCents) : ''}
                    required
                    placeholder="35,00"
                    className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Estoque</Label>
                  <Input
                    name="stock"
                    type="number"
                    defaultValue={editing?.stock ?? 0}
                    required
                    min={0}
                    className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500/50 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Aviso Estoque Mínimo</Label>
                <Input
                  name="minStock"
                  type="number"
                  defaultValue={editing?.minStock ?? 5}
                  min={0}
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
