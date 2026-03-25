import { prisma } from "@/lib/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingBag, ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"

export default async function VendasLogPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen text-white animate-fade-in-up">
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <Link href="/dashboard/pdv" className="text-zinc-500 hover:text-orange-500 flex items-center gap-2 mb-4 font-bold transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar ao PDV
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Histórico <span className="text-orange-500">de Vendas</span>
          </h1>
          <p className="text-zinc-500 font-medium text-sm">Registro cronológico de todas as transações de produtos.</p>
        </div>
      </header>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900/40">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest pl-10 py-6 text-xs">Data/Hora</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs">Itens Vendidos</TableHead>
              <TableHead className="text-zinc-500 font-black uppercase tracking-widest py-6 text-xs text-right pr-10">Valor Bruto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <TableCell className="pl-10 py-8">
                   <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-zinc-600" />
                      <div className="flex flex-col">
                         <span className="font-bold text-zinc-200">{sale.createdAt.toLocaleDateString('pt-BR')}</span>
                         <span className="text-xs text-zinc-500">{sale.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                   </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-wrap gap-2">
                      {sale.items.map((item, idx) => (
                        <div key={idx} className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                           <Tag className="w-3 h-3 text-orange-500" />
                           <span className="text-xs font-bold text-zinc-300">
                             {item.quantity}x {item.product.name}
                           </span>
                        </div>
                      ))}
                   </div>
                </TableCell>
                <TableCell className="text-right pr-10">
                   <span className="text-2xl font-black text-white tracking-tighter">
                      {BRL.format(sale.totalPrice / 100)}
                   </span>
                </TableCell>
              </TableRow>
            ))}

            {sales.length === 0 && (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={3} className="py-24 text-center">
                   <div className="flex flex-col items-center justify-center text-zinc-600 gap-4">
                      <ShoppingBag className="w-16 h-16 opacity-10" />
                      <p className="text-xl font-bold">Nenhuma venda registrada ainda.</p>
                      <p className="text-sm text-zinc-500">As vendas feitas no PDV aparecerão aqui automaticamente.</p>
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
