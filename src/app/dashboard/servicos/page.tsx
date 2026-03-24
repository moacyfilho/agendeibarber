import { Plus, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getServicos } from "@/lib/db"
import { createServicoAction } from "@/app/actions"

export default function ServicosPage() {
  const servicos = getServicos();

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Briefcase className="text-orange-500 w-10 h-10" /> Catálogo Interativo
          </h2>
          <p className="text-zinc-400 font-medium text-lg">Banco Fullstack Simulado.</p>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-xl shadow-lg active:scale-95 text-lg">
            <Plus className="mr-2 w-6 h-6" /> Habilitar Corte
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-3xl p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-orange-500 text-3xl font-black">Lançar Oferta</DialogTitle>
            </DialogHeader>

            <form action={createServicoAction} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label className="text-zinc-300 font-bold ml-1">Estilo do Serviço</Label>
                <Input name="sname" required placeholder="Corte Clássico" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-300 font-bold ml-1">Tempo (min)</Label>
                  <Input name="stime" type="number" placeholder="45" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-300 font-bold ml-1">Preço Público</Label>
                  <Input name="sprice" placeholder="R$ 50,00" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl" />
                </div>
              </div>
              <Button type="submit" className="mt-4 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-14 rounded-xl text-lg shadow-lg">Adicionar ao Cardápio</Button>
            </form>

          </DialogContent>
        </Dialog>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900">
              <TableHead className="text-zinc-500 font-black py-5 pl-8">Serviço Ofertado</TableHead>
              <TableHead className="text-zinc-500 font-black py-5">Duração (Lock)</TableHead>
              <TableHead className="text-zinc-500 font-black py-5">Lucro Direto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicos.map((s: any) => (
              <TableRow key={s.id} className="border-zinc-900 hover:bg-zinc-900/50">
                <TableCell className="font-bold text-white py-6 pl-8 text-lg">{s.name}</TableCell>
                <TableCell className="text-zinc-400 font-medium text-base">⏱️ {s.time}</TableCell>
                <TableCell>
                  <span className="font-black text-green-400 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20 text-lg">
                    {s.price}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
