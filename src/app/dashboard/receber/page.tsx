import { TrendingUp, Users } from "lucide-react"

export default function ReceberPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10 flex flex-col items-start gap-4">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="text-green-500 w-10 h-10" /> 
          Contas a Receber (Fiados)
        </h2>
        <p className="text-zinc-400 font-medium text-lg">Controle de clientes que pagam "depois" ou faturas pendentes que exigem cobrança.</p>
      </header>

      <div className="w-full flex flex-col justify-center items-center py-24 bg-[#0a0a0a] border border-zinc-900 rounded-3xl">
        <div className="w-24 h-24 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
          <Users className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4">Zero Inadimplência!</h3>
        <p className="text-zinc-400 text-lg">Nenhum cliente está devendo sua barbearia hoje.</p>
      </div>
    </div>
  )
}
