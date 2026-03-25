'use client';
import { useState } from 'react';
import { Plus, Users, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClienteAction, updateClienteAction, deleteClienteAction } from '@/app/actions';

type Cliente = {
  id: string;
  name: string;
  phone: string | null;
  loyaltyCards: { totalVisits: number; rewardThreshold: number }[];
};

export function ClientesClient({ initialClientes }: { initialClientes: Cliente[] }) {
  const [clientes, setClientes] = useState(initialClientes);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(c: Cliente) { setEditing(c); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (editing) {
      await updateClienteAction(editing.id, fd);
    } else {
      await createClienteAction(fd);
    }
    setLoading(false);
    closeModal();
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este cliente?')) return;
    await deleteClienteAction(id);
    setClientes(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon"><Users className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Clientes</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Base de clientes e programa de fidelidade</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 text-sm transition-all">
          <Plus className="mr-2 w-4 h-4" /> Novo Cliente
        </button>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/30">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-bold uppercase text-xs tracking-wider py-4 pl-6">Cliente</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase text-xs tracking-wider py-4">Contato</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase text-xs tracking-wider py-4">Fidelidade</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase text-xs tracking-wider py-4 text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map(client => {
              const card = client.loyaltyCards[0];
              const visits = card?.totalVisits ?? 0;
              const threshold = card?.rewardThreshold ?? 10;
              return (
                <TableRow key={client.id} className="border-zinc-900/60 hover:bg-zinc-900/30 transition-colors">
                  <TableCell className="font-bold text-white py-5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 font-bold text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <span className="text-sm">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 font-medium text-sm">{client.phone || '—'}</TableCell>
                  <TableCell>
                    <span className="font-bold text-white bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center w-fit gap-1.5 text-sm">
                      <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      {visits}/{threshold} visitas
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button onClick={() => openEdit(client)} variant="ghost" size="icon" className="text-zinc-500 hover:text-orange-500 w-8 h-8 rounded-xl">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(client.id)} variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 w-8 h-8 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {clientes.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="py-16 text-center">
                  <Users className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
                  <p className="text-zinc-500 font-medium">Nenhum cliente cadastrado ainda.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white mb-1">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            <p className="text-zinc-500 text-sm mb-6">{editing ? 'Atualize os dados do cliente.' : 'Adicione um novo cliente à base da barbearia.'}</p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">Nome Completo</Label>
                <Input name="name" defaultValue={editing?.name} required placeholder="João Silva" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-zinc-400 text-xs ml-1">WhatsApp</Label>
                <Input name="phone" defaultValue={editing?.phone ?? ''} placeholder="(11) 99999-9999" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
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
