import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

export default function CaixaPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <Wallet className="text-orange-500 w-10 h-10" /> 
          Frente de Caixa (PDV)
        </h2>
        <p className="text-zinc-400 font-medium text-lg">Seu resumo de fechamento de turno diário na barbearia.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-[2rem] relative">
          <ArrowUpCircle className="absolute top-8 right-8 w-12 h-12 text-green-500 opacity-20" />
          <h3 className="text-green-500 font-bold uppercase tracking-widest mb-2">Entradas Hoje (Cartões/Pix/Dinheiro)</h3>
          <p className="text-5xl font-black text-white">R$ 1.250,50</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] relative">
          <ArrowDownCircle className="absolute top-8 right-8 w-12 h-12 text-red-500 opacity-20" />
          <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2">Saídas Hoje (Comissões/Taxas)</h3>
          <p className="text-5xl font-black text-white">R$ 450,00</p>
        </div>
      </section>

      <div className="w-full h-40 bg-[#0a0a0a] border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-500 font-black text-2xl uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer">
        + Lançar Recebimento Avulso
      </div>
    </div>
  )
}
