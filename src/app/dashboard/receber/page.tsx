import { TrendingUp, Users } from "lucide-react"

export default function ReceberPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon !bg-green-500/10 !border-green-500/15 !text-green-500">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Contas a Receber</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Fiados e faturas pendentes de clientes</p>
        </div>
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
