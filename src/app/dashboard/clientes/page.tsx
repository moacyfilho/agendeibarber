import { Plus, Search, MoreHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/prisma"
import { createClienteAction } from "@/app/actions"

export default async function ClientesPage() {
  const clients = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Clientes</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Base de clientes e programa de fidelidade</p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-500/10 active:scale-95 text-sm transition-all">
            <Plus className="mr-2 w-4 h-4" /> Novo Cliente
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-2xl p-6 md:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-black text-white">Cadastrar Cliente</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">
                Adicione um novo cliente à base da barbearia.
              </DialogDescription>
            </DialogHeader>

            <form action={createClienteAction} className="grid gap-5 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-zinc-400 font-medium text-xs ml-1">Nome Completo</Label>
                <Input id="name" name="name" placeholder="Ex: João Silva" required className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-zinc-400 font-medium text-xs ml-1">WhatsApp</Label>
                <Input id="phone" name="phone" placeholder="(11) 99999-9999" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-11 rounded-xl" />
              </div>
              
              <Button type="submit" className="mt-2 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-11 rounded-xl shadow-lg">
                Cadastrar
              </Button>
            </form>

          </DialogContent>
        </Dialog>
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
            {clients.map((client: any) => (
              <TableRow key={client.id} className="border-zinc-900/60 hover:bg-zinc-900/30 transition-colors group table-row-premium">
                <TableCell className="font-bold text-white py-5 pl-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 font-bold text-sm">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm">{client.name}</span>
                    <div className="mt-0.5">
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/15 text-[9px] uppercase">
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400 font-medium text-sm">{client.phone}</TableCell>
                <TableCell>
                  <span className="font-bold text-white bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center w-fit gap-1.5 text-sm">
                    <span className="text-orange-500 text-base leading-none">★</span> {client.points} pts
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-orange-500 w-8 h-8 rounded-xl">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
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
    </div>
  );
}
