import { Plus, Search, MoreHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getClientes } from "@/lib/db"
import { createClienteAction } from "@/app/actions"

export default function ClientesPage() {
  const clients = getClientes();

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-zinc-50 mb-2 flex items-center gap-3">
            <User className="text-orange-500 w-10 h-10" /> Gestão de Clientes
          </h2>
          <p className="text-zinc-400 font-medium text-lg">Integração Total Front-Back (Server Components + Actions).</p>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 text-lg">
            <Plus className="mr-2 w-6 h-6" /> Novo Cliente
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-3xl p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-orange-500 text-3xl font-black">Cadastrar</DialogTitle>
              <DialogDescription className="text-zinc-400 font-medium mt-2">
                O formulário aciona o Server Action remoto e revalida a tabela em tempo real.
              </DialogDescription>
            </DialogHeader>

            {/* FORMULÁRIO MÁGICO FULLSTACK NEXT.JS */}
            <form action={createClienteAction} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-zinc-300 font-bold ml-1">Nome Completo</Label>
                <Input id="name" name="name" placeholder="Ex: Rodrigo Faro" required className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl text-lg px-4" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-zinc-300 font-bold ml-1">WhatsApp</Label>
                <Input id="phone" name="phone" placeholder="(11) 99999-9999" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl text-lg px-4" />
              </div>
              
              <Button type="submit" className="mt-4 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-14 rounded-xl text-lg shadow-lg">
                Salvar no Backend
              </Button>
            </form>

          </DialogContent>
        </Dialog>
      </header>

      {/* Tabela de DB REAL */}
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 pl-8">Cliente</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Contato Seguro</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5">Clube de Fidelidade</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase text-xs py-5 text-right pr-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client: any) => (
              <TableRow key={client.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                <TableCell className="font-bold text-white py-6 pl-8 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 font-black text-xl shadow-inner">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-lg">{client.name}</span>
                    <div className="mt-1">
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px] uppercase">
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300 font-medium text-base">{client.phone}</TableCell>
                <TableCell>
                  <span className="font-black text-white bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 flex items-center w-fit gap-2 shadow-inner">
                    <span className="text-orange-500 text-xl leading-none">★</span> {client.points} pts
                  </span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-orange-500 w-10 h-10 rounded-xl">
                    <MoreHorizontal className="w-6 h-6" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
