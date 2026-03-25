import { Plus, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/prisma"
import { createBarbeiroAction } from "@/app/actions"

export default async function BarbeirosPage() {
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER' }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Barbeiros</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Gerencie a equipe de profissionais da sua barbearia</p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 text-sm transition-all">
            <Plus className="mr-2 w-4 h-4" /> Novo Barbeiro
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-2xl p-6 md:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-black text-white">Adicionar Barbeiro</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">Cadastre um novo profissional na equipe.</DialogDescription>
            </DialogHeader>

            <form action={createBarbeiroAction} className="grid gap-5 py-2">
              <div className="grid gap-2">
                <Label htmlFor="bname" className="text-zinc-400 font-medium text-xs ml-1">Nome do Profissional</Label>
                <Input id="bname" name="bname" required placeholder="Ex: Carlos Silva" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comm" className="text-zinc-400 font-medium text-xs ml-1">Comissão (%)</Label>
                <Input id="comm" name="comm" type="number" placeholder="50" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-11 rounded-xl shadow-lg">Cadastrar</Button>
            </form>

          </DialogContent>
        </Dialog>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/30">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4 pl-6">Profissional</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4">Comissão</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4">Especialidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbers.map((b: any) => (
              <TableRow key={b.id} className="border-zinc-900/60 hover:bg-zinc-900/30 transition-colors table-row-premium">
                <TableCell className="font-bold text-white py-5 pl-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-orange-500 font-bold text-sm border border-zinc-800">
                    {b.name.charAt(0)}
                  </div>
                  <span className="text-sm">{b.name}</span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-white bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-sm">
                    {b.commission}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-400 font-medium text-sm">{b.special || '—'}</TableCell>
              </TableRow>
            ))}
            {barbers.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={3} className="py-16 text-center">
                  <Scissors className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
                  <p className="text-zinc-500 font-medium">Nenhum barbeiro cadastrado ainda.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
