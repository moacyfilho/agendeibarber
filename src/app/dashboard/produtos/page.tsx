import { Package, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ProdutosPage() {
  const stock = [
    { p: "Pomada Modeladora Matte 150g", q: 12, cost: "R$ 15,00", sell: "R$ 45,00" },
    { p: "Óleo para Barba (Madeira)", q: 3, cost: "R$ 20,00", sell: "R$ 55,00" },
    { p: "Minoxidil Kirkland 5% (Frasco)", q: 0, cost: "R$ 35,00", sell: "R$ 80,00" },
  ];

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Package className="text-orange-500 w-10 h-10" /> Venda de Produtos
          </h2>
          <p className="text-zinc-400 font-medium text-lg">Controle de prateleira, margem de lucro e estoque para cross-sell (upsell no caixa).</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-xl text-lg shadow-lg">
            <Plus className="mr-2" /> Comprar Estoque
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white rounded-3xl p-8">
            <DialogHeader>
              <DialogTitle className="text-orange-500 text-2xl font-bold">Dar Entrada em Produto</DialogTitle>
              <DialogDescription>Cadastre notas de entrada ou novos SKU para revenda.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label>Nome</Label><Input className="bg-zinc-900 border-zinc-800" />
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Custo Bruto</Label><Input className="bg-zinc-900 border-zinc-800" /></div>
                <div><Label>Preço Gôndola</Label><Input className="bg-zinc-900 border-zinc-800" /></div>
              </div>
            </div>
            <DialogFooter><Button className="w-full bg-orange-500">Salvar no Banco</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black tracking-widest pl-8 py-5">Nome do Produto</TableHead>
              <TableHead className="text-zinc-500 font-black tracking-widest py-5">Estoque Atual</TableHead>
              <TableHead className="text-zinc-500 font-black tracking-widest py-5">Custo (R$)</TableHead>
              <TableHead className="text-zinc-500 font-black tracking-widest py-5">Venda (R$)</TableHead>
              <TableHead className="text-zinc-500 font-black tracking-widest text-right pr-8 py-5">Margem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.map((s, i) => (
              <TableRow key={i} className="border-zinc-900 hover:bg-zinc-900/50">
                <TableCell className="font-bold text-white text-lg pl-8 py-6">{s.p}</TableCell>
                <TableCell>
                  {s.q > 5 ? <Badge className="bg-zinc-800 text-white">{s.q} UND.</Badge> : s.q > 0 ? <Badge className="bg-yellow-500/20 text-yellow-500">{s.q} UND (⚠️ Crítico)</Badge> : <Badge className="bg-red-500/20 text-red-500">❌ ZERO ESTOQUE</Badge>}
                </TableCell>
                <TableCell className="text-red-400 font-medium">{s.cost}</TableCell>
                <TableCell className="text-green-400 font-black text-lg">{s.sell}</TableCell>
                <TableCell className="text-right pr-8 text-orange-400 font-black">+200%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
