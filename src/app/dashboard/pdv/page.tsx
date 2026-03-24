import { prisma } from "@/lib/prisma"
import { Package, ShoppingCart, Info } from "lucide-react"
import { PDVClient } from "@/components/PDVClient"

export default async function PDVPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-8 md:p-14 max-w-7xl mx-auto min-h-screen text-white font-[family-name:var(--font-geist-sans)]">
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div className="flex-1">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-3 tracking-tighter">
            Venda Rápida <span className="text-orange-500">(PDV)</span>
          </h2>
          <p className="text-zinc-500 font-medium text-lg flex items-center gap-2 max-w-2xl">
            Painel otimizado para vendas rápidas de balcão com baixa automática no estoque e registro financeiro.
          </p>
        </div>
        
        <div className="bg-[#0c0c0c]/80 border border-zinc-900 p-6 rounded-3xl flex items-start gap-4 shadow-2xl backdrop-blur-xl max-w-xs group hover:bg-zinc-900/50 transition-all">
           <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Info className="w-6 h-6" />
           </div>
           <div>
              <p className="font-black text-white text-xs uppercase tracking-widest mb-1">Dica de Gestor</p>
              <p className="text-zinc-500 text-xs">Venda produtos de manutenção (pomadas, óleos) para aumentar o ticket médio.</p>
           </div>
        </div>
      </header>

      {/* COMPONENTE INTERATIVO CLIENT-SIDE */}
      <PDVClient products={products} />
      
      <div className="mt-20 border-t border-zinc-900 pt-10 flex flex-col items-center justify-center text-zinc-800 text-center select-none opacity-20 hover:opacity-100 transition-all">
         <ShoppingCart className="w-12 h-12 mb-4" />
         <p className="text-[10px] uppercase font-black tracking-[0.4em] mb-1">Terminal de Ponto de Venda Seguro</p>
         <p className="text-[8px] font-bold">Agendei Barber - Versão 1.5.0</p>
      </div>
    </div>
  )
}
