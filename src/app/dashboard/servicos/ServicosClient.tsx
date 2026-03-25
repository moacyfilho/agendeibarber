'use client';
import { useState } from 'react';
import { Plus, Briefcase, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createServicoAction, updateServicoAction, deleteServicoAction } from '@/app/actions';

type Servico = { id: string; name: string; durationMinutes: number; priceInCents: number };

export function ServicosClient({ initialServicos }: { initialServicos: Servico[] }) {
  const [servicos, setServicos] = useState(initialServicos);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(false);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(s: Servico) { setEditing(s); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (editing) {
      await updateServicoAction(editing.id, fd);
    } else {
      await createServicoAction(fd);
    }
    setLoading(false);
    closeModal();
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este serviço?')) return;
    await deleteServicoAction(id);
    setServicos(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon"><Briefcase className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Serviços</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Cardápio de serviços oferecidos aos clientes</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 text-sm transition-all">
          <Plus className="mr-2 w-4 h-4" /> Novo Serviço
        </button>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/30">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4 pl-6">Serviço</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4">Duração</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4">Preço</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4 text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicos.map(s => (
              <TableRow key={s.id} className="border-zinc-900/60 hover:bg-zinc-900/30 transition-colors">
                <TableCell className="font-bold text-white py-5 pl-6 text-sm">{s.name}</TableCell>
                <TableCell className="text-zinc-400 font-medium text-sm">{s.durationMinutes} min</TableCell>
                <TableCell>
                  <span className="font-bold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/15 text-sm">
                    R$ {(s.priceInCents / 100).toFixed(2).replace('.', ',')}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => openEdit(s)} variant="ghost" size="icon" className="text-zinc-500 hover:text-orange-500 w-8 h-8 rounded-xl">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(s.id)} variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 w-8 h-8 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {servicos.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="py-16 text-center">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
                  <p className="text-zinc-500 font-medium">Nenhum serviço cadastrado ainda.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-1">{editing ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            <p className="text-zinc-500 text-sm mb-6">{editing ? 'Atualize os dados do serviço.' : 'Adicione um novo serviço ao cardápio.'}</p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Nome do Serviço</Label>
                <Input name="sname" defaultValue={editing?.name} required placeholder="Corte Clássico" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Duração (min)</Label>
                  <Input name="stime" type="number" defaultValue={editing?.durationMinutes} placeholder="45" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-zinc-400 text-xs ml-1">Preço (centavos)</Label>
                  <Input name="sprice" defaultValue={editing?.priceInCents} placeholder="5000" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" onClick={closeModal} variant="outline" className="flex-1 border-zinc-800 text-zinc-400 h-11 rounded-xl">Cancelar</Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl">
                  {loading ? 'Salvando...' : editing ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
