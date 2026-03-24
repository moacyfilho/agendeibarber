import { Banknote, Users, CalendarPlus, Search, ArrowRight, Wallet, Activity } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-8 md:p-14 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER SOFISTICADO */}
      <header className="mb-14 flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-3 tracking-tight">
            Painel Central
          </h2>
          <p className="text-zinc-400 font-medium text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
            Unidade Matriz operando ao vivo
          </p>
        </div>
        
        {/* ALERTA DE CARÊNCIA GLASS */}
        <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r from-red-500/50 to-orange-500/20 max-w-sm shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <div className="bg-[#120a0a]/90 backdrop-blur-xl px-6 py-5 rounded-[23px] flex items-center gap-5">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-red-400 text-sm tracking-widest uppercase">Pendente</p>
              <p className="text-zinc-300 text-sm mt-0.5">Assinatura expira sexta.</p>
            </div>
            <button className="ml-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-900/50 active:scale-95">
              Regularizar
            </button>
          </div>
        </div>
      </header>

      {/* MÉTRICAS (CARDS COM BORDAS DE RADIANTE E GLASSMORPHISM) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card 1 */}
        <div className="relative group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent hover:from-orange-500/30 transition-all duration-500 cursor-default">
          <div className="h-full w-full p-8 bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[31px] relative z-10 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-zinc-800 transition-colors duration-500 group-hover:text-green-500/20">
              <Activity className="w-20 h-20 opacity-30 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-4 relative z-10">Faturamento Hoje</h3>
            <p className="text-6xl font-black text-white relative z-10 tracking-tighter">
              1.4k<span className="text-2xl text-zinc-600 font-bold">,50</span>
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-green-400 font-bold bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/20">
              ↑ 12% a mais que ontem
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/30 transition-all duration-500 cursor-default">
          <div className="h-full w-full p-8 bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[31px] relative z-10 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-zinc-800 transition-colors duration-500 group-hover:text-blue-500/20">
              <CalendarPlus className="w-20 h-20 opacity-30 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-4 relative z-10">Agendamentos Hoje</h3>
            <p className="text-6xl font-black text-white relative z-10 tracking-tighter">18</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400 font-medium">
              4 vagas sobrando na agenda
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/30 transition-all duration-500 cursor-default">
          <div className="h-full w-full p-8 bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-[31px] relative z-10 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-zinc-800 transition-colors duration-500 group-hover:text-purple-500/20">
              <Users className="w-20 h-20 opacity-30 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-4 relative z-10">Novos Clientes (Mês)</h3>
            <p className="text-6xl font-black text-white relative z-10 tracking-tighter">42</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-purple-400 font-bold bg-purple-500/10 w-fit px-3 py-1 rounded-full border border-purple-500/20">
              🎉 Batemos a meta
            </div>
          </div>
        </div>

      </section>

      {/* AGENDA INTELIGENTE */}
      <section className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-zinc-900/50 pb-8 gap-4">
          <div>
            <h3 className="text-3xl font-extrabold text-white">Live Queue (Fila)</h3>
            <p className="text-zinc-500 mt-1">Próximos atendentes marcados para hoje</p>
          </div>
          <button className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 bg-orange-500/10 px-5 py-3 rounded-2xl transition-all hover:bg-orange-500/20 group">
            Ver Todos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <ul className="flex flex-col gap-5">
          {/* Item 1 */}
          <li className="flex flex-col md:flex-row md:justify-between md:items-center p-6 border border-zinc-800/60 rounded-3xl bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center font-black text-zinc-300 text-2xl shadow-inner group-hover:scale-105 transition-transform">
                M
              </div>
              <div>
                <p className="font-extrabold text-white text-xl mb-1.5 group-hover:text-orange-400 transition-colors">Marcos Silva</p>
                <p className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]"></span>
                  Degradê p/ Barbeiro Zeca
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 text-left md:text-right flex flex-col md:items-end gap-3 md:gap-2">
              <p className="font-black text-4xl tracking-tighter text-white">14:00</p>
              <span className="text-[11px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full tracking-widest uppercase">
                PAGO VIA PIX
              </span>
            </div>
          </li>
          
          {/* Item 2 */}
          <li className="flex flex-col md:flex-row md:justify-between md:items-center p-6 border border-orange-500/30 rounded-3xl bg-orange-500/5 hover:bg-orange-500/10 transition-all group shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-3xl shadow-[0_0_15px_rgba(249,115,22,1)]"></div>
            <div className="flex items-center gap-6 pl-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 border border-orange-400 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg ring-4 ring-orange-500/20 group-hover:scale-105 transition-transform">
                J
              </div>
              <div>
                <p className="font-extrabold text-white text-xl mb-1.5 group-hover:text-orange-400 transition-colors">Jonas Oliveira</p>
                <p className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]"></span>
                  Platinado p/ Barbeiro Fê
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 text-left md:text-right flex flex-col md:items-end gap-3 md:gap-2">
              <p className="font-black text-4xl tracking-tighter text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">14:30</p>
              <span className="text-[11px] font-black text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full tracking-widest uppercase">
                Acerto Balcão (R$ 70)
              </span>
            </div>
          </li>
        </ul>
      </section>
      
    </div>
  );
}
