import { Plus, MoreHorizontal, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getBarbeiros } from "@/lib/db"
import { createBarbeiroAction } from "@/app/actions"

export default function BarbeirosPage() {
  const barbers = getBarbeiros();

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Scissors className="text-orange-500 w-10 h-10" /> Equipe de Barbeiros
          </h2>
          <p className="text-zinc-400 font-medium text-lg">Módulo Fullstack Server-Component.</p>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-xl shadow-lg active:scale-95 text-lg">
            <Plus className="mr-2 w-6 h-6" /> Contratar
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#0a0a0a] border border-zinc-900 text-white shadow-2xl rounded-3xl p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-orange-500 text-3xl font-black">Adicionar Barbeiro</DialogTitle>
            </DialogHeader>

            <form action={createBarbeiroAction} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bname" className="text-zinc-300 font-bold ml-1">Vulgo Artístico</Label>
                <Input id="bname" name="bname" required placeholder="Ex: Zeca Navalha" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comm" className="text-zinc-300 font-bold ml-1">Comissão Split (%)</Label>
                <Input id="comm" name="comm" type="number" placeholder="50" className="bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 h-12 rounded-xl" />
              </div>
              <Button type="submit" className="mt-4 bg-orange-500 hover:bg-orange-600 w-full text-white font-bold h-14 rounded-xl text-lg shadow-lg">Criar Acesso</Button>
            </form>

          </DialogContent>
        </Dialog>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black py-5 pl-8">Profissional</TableHead>
              <TableHead className="text-zinc-500 font-black py-5">Rateio Base</TableHead>
              <TableHead className="text-zinc-500 font-black py-5">Mestre em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbers.map((b: any) => (
              <TableRow key={b.id} className="border-zinc-900 hover:bg-zinc-900/50">
                <TableCell className="font-bold text-white py-6 pl-8 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-orange-500 font-black text-xl shadow-inner border border-zinc-800">
                    {b.name.charAt(0)}
                  </div>
                  <span className="text-lg">{b.name}</span>
                </TableCell>
                <TableCell>
                  <span className="font-black text-white bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800">
                    <span className="text-orange-500">💳</span> {b.commission}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-400 font-medium text-base">{b.special}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
