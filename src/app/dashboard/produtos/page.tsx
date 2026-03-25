import { Package, Plus, MoreHorizontal, AlertTriangle, CheckCircle2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/prisma"
import { createProductAction } from "@/app/actions"
import { getTenantId } from '@/lib/session'

export default async function ProdutosPage() {
  const tenantId = await getTenantId();
  const products = await prisma.product.findMany({
    where: { tenantId },
    orderBy: { stock: 'asc' }
  });

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen text-white animate-fade-in-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Produtos</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Controle de estoque e itens de revenda</p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-xl text-lg shadow-lg shadow-orange-500/10 transition-all active:scale-95">
            <Plus className="mr-2 w-6 h-6" /> Novo Produto
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-[#0a0a0a] border-zinc-900 text-white rounded-3xl p-8">
            <DialogHeader>
              <DialogTitle className="text-orange-500 text-3xl font-black">Cadastrar Produto</DialogTitle>
              <DialogDescription className="text-zinc-400 font-medium">Adicione novos itens para revenda na sua barbearia.</DialogDescription>
            </DialogHeader>
            <form action={createProductAction} className="grid gap-6 py-6">
              <div className="grid gap-2">
                 <Label htmlFor="name" className="ml-1 font-bold text-zinc-300">Nome do Produto</Label>
                 <Input id="name" name="name" required placeholder="Ex: Pomada Modeladora Luxo" className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus:border-orange-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                   <Label htmlFor="price" className="ml-1 font-bold text-zinc-300">Preço Venda (R$)</Label>
                   <Input id="price" name="price" required placeholder="50,00" className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus:border-orange-500" />
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="stock" className="ml-1 font-bold text-zinc-300">Estoque Inicial</Label>
                   <Input id="stock" name="stock" type="number" required placeholder="10" className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus:border-orange-500" />
                </div>
              </div>

              <div className="grid gap-2">
                 <Label htmlFor="minStock" className="ml-1 font-bold text-zinc-300">Aviso Estoque Baixo (Min.)</Label>
                 <Input id="minStock" name="minStock" type="number" defaultValue={5} className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus:border-orange-500" />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-xl font-black text-lg shadow-lg">
                Salvar Produto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest pl-10 py-6 text-xs">Produto</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs">Disponibilidade</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs">Preço Venda</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest text-right pr-10 py-6 text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const isLowStock = p.stock <= p.minStock && p.stock > 0;
              const isOutOfStock = p.stock <= 0;

              return (
                <TableRow key={p.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                  <TableCell className="font-bold text-white text-lg pl-10 py-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500">
                       <ShoppingCart className="w-6 h-6" />
                    </div>
                    {p.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                       <span className={`text-xl font-black ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-500' : 'text-zinc-100'}`}>
                         {p.stock} <small className="text-[10px] text-zinc-500 uppercase">Unidades</small>
                       </span>
                       {isLowStock && <span className="text-yellow-500/70 text-[10px] font-bold uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Reposição Necessária</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-500 font-black text-2xl">
                    {BRL.format(p.priceInCents / 100)}
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    {isOutOfStock ? (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 uppercase text-[10px] font-black">Esgotado</Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 uppercase text-[10px] font-black">Em Linha</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {products.length === 0 && (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={4} className="py-24 text-center">
                   <div className="flex flex-col items-center justify-center text-zinc-600 gap-4">
                      <Package className="w-20 h-20 opacity-10" />
                      <p className="text-xl font-bold">Nenhum produto cadastrado no estoque.</p>
                      <p className="max-w-xs mx-auto text-zinc-500">Comece adicionando itens que você revende no balcão da barbearia.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
