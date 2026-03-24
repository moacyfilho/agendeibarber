import { TrendingDown, CalendarClock } from "lucide-react"

export default function ContasPagarPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10 flex flex-col items-start gap-4">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <TrendingDown className="text-red-500 w-10 h-10" /> 
          Contas a Pagar
        </h2>
        <p className="text-zinc-400 font-medium text-lg">Gestão inteligente de aluguel, luz, salários, boletos e água.</p>
      </header>

      <ul className="flex flex-col gap-4">
        <li className="flex justify-between items-center p-6 border border-red-500/30 rounded-2xl bg-red-500/5 group">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-xl font-black">💸</div>
            <div>
              <p className="font-extrabold text-white text-xl">Aluguel do Salão</p>
              <p className="text-sm font-medium text-red-400 flex items-center gap-2">Venceu Ontem! (Dia 05)</p>
            </div>
          </div>
          <p className="font-black text-3xl text-red-500">- R$ 2.450,00</p>
        </li>

        <li className="flex justify-between items-center p-6 border border-zinc-800 rounded-2xl bg-[#0a0a0a] group">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-blue-500 text-xl font-black">⚡</div>
            <div>
              <p className="font-extrabold text-white text-xl">Luz Enel / Cemig</p>
              <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">Vence dia 15</p>
            </div>
          </div>
          <p className="font-black text-3xl text-zinc-300">R$ 320,00</p>
        </li>
      </ul>
    </div>
  )
}
