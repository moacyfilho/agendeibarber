'use client';
import { useState } from 'react';
import { Package, Plus, ShoppingCart, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createProductAction, updateProductAction, deleteProductAction } from '@/app/actions';

type Product = { id: string; name: string; priceInCents: number; stock: number; minStock: number };

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function ProdutosClient({ initialProdutos }: { initialProdutos: Product[] }) {
  const [produtos, setProdutos] = useState(initialProdutos);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(p: Product) { setEditing(p); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (editing) {
      await updateProductAction(editing.id, fd);
    } else {
      await createProductAction(fd);
    }
    setLoading(false);
    closeModal();
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este produto?')) return;
    await deleteProductAction(id);
    setProdutos(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen text-white animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon"><Package className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Produtos</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Controle de estoque e itens de revenda</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 text-sm transition-all">
          <Plus className="mr-2 w-4 h-4" /> Novo Produto
        </button>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest pl-10 py-6 text-xs">Produto</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs">Disponibilidade</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs">Preço Venda</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs">Status</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest text-right pr-10 py-6 text-xs">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map(p => {
              const isLowStock = p.stock <= p.minStock && p.stock > 0;
              const isOutOfStock = p.stock <= 0;
              return (
                <TableRow key={p.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                  <TableCell className="font-bold text-white text-lg pl-10 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    {p.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xl font-black ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-500' : 'text-zinc-100'}`}>
                        {p.stock} <small className="text-[10px] text-zinc-500 uppercase">un</small>
                      </span>
                      {isLowStock && <span className="text-yellow-500/70 text-[10px] font-bold uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Reposição Necessária</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-500 font-black text-xl">{BRL.format(p.priceInCents / 100)}</TableCell>
                  <TableCell>
                    {isOutOfStock
                      ? <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 uppercase text-[10px] font-black">Esgotado</Badge>
                      : <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 uppercase text-[10px] font-black">Em Linha</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex items-center justify-end gap-2">
                      <Button onClick={() => openEdit(p)} variant="ghost" size="icon" className="text-zinc-500 hover:text-orange-500 w-8 h-8 rounded-xl">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(p.id)} variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 w-8 h-8 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {produtos.length === 0 && (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={5} className="py-24 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-zinc-800" />
                  <p className="text-lg font-bold text-zinc-500">Nenhum produto cadastrado no estoque.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-1">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
            <p className="text-zinc-500 text-sm mb-6">{editing ? 'Atualize os dados do produto.' : 'Adicione um novo item ao estoque.'}</p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Nome do Produto</Label>
                <Input name="name" defaultValue={editing?.name} required placeholder="Pomada Modeladora" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Preço Venda (R$)</Label>
                  <Input name="price" defaultValue={editing ? String(editing.priceInCents) : ''} required placeholder="5000" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Estoque</Label>
                  <Input name="stock" type="number" defaultValue={editing?.stock ?? 0} required className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Aviso Estoque Mínimo</Label>
                <Input name="minStock" type="number" defaultValue={editing?.minStock ?? 5} className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" onClick={closeModal} variant="outline" className="flex-1 border-zinc-800 text-zinc-400 h-11 rounded-xl">Cancelar</Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl">
                  {loading ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
