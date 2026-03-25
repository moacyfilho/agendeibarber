import { Plus, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/prisma"
import { createServicoAction } from "@/app/actions"
import { getTenantId } from '@/lib/session'

export default async function ServicosPage() {
  const tenantId = await getTenantId();
  const servicos = await prisma.service.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Serviços</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Cardápio de serviços oferecidos aos clientes</p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 text-sm transition-all">
            <Plus className="mr-2 w-4 h-4" /> Novo Serviço
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-2xl p-6 md:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-black text-white">Cadastrar Serviço</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">Adicione um novo serviço ao cardápio da barbearia.</DialogDescription>
            </DialogHeader>

            <form action={createServicoAction} className="grid gap-5 py-2">
              <div className="grid gap-2">
                <Label className="text-zinc-400 font-medium text-xs ml-1">Nome do Serviço</Label>
                <Input name="sname" required placeholder="Corte Clássico" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400 font-medium text-xs ml-1">Duração (min)</Label>
                  <Input name="stime" type="number" placeholder="45" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-400 font-medium text-xs ml-1">Preço (R$)</Label>
                  <Input name="sprice" placeholder="50,00" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
                </div>
              </div>
              <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-11 rounded-xl shadow-lg">Adicionar</Button>
            </form>

          </DialogContent>
        </Dialog>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/30">
            <TableRow className="border-zinc-900">
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4 pl-6">Serviço</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4">Duração</TableHead>
              <TableHead className="text-zinc-500 font-bold text-xs uppercase tracking-wider py-4">Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicos.map((s: any) => (
              <TableRow key={s.id} className="border-zinc-900/60 hover:bg-zinc-900/30 transition-colors table-row-premium">
                <TableCell className="font-bold text-white py-5 pl-6 text-sm">{s.name}</TableCell>
                <TableCell className="text-zinc-400 font-medium text-sm">{s.durationMinutes} min</TableCell>
                <TableCell>
                  <span className="font-bold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/15 text-sm">
                    R$ {(s.priceInCents / 100).toFixed(2).replace('.', ',')}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {servicos.length === 0 && (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={3} className="py-16 text-center">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 text-zinc-800" />
                  <p className="text-zinc-500 font-medium">Nenhum serviço cadastrado ainda.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
