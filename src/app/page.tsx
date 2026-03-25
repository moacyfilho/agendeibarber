import {
  Scissors, Calendar, Zap, ArrowRight, Star,
  BarChart2, Users, Smartphone, Check, Crown, Clock,
  DollarSign, TrendingUp, MessageSquare, Gift, ChevronRight,
  X, Shield, Play, Briefcase, CreditCard,
  Lock, BarChart, Activity, ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-orange-500/25 overflow-x-hidden font-sans">

      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04]" style={{ background: 'rgba(3,3,3,0.85)', backdropFilter: 'blur(24px)' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-black tracking-tight">
              <span className="text-orange-400">AGENDEI</span>
              <span className="text-zinc-500 font-light"> BARBER</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-zinc-600 uppercase tracking-[0.15em]">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/auth/login" className="hidden sm:block text-[12px] font-bold text-zinc-500 hover:text-white px-4 py-2 transition-colors">
              Entrar
            </Link>
            <Link href="/auth/login" className="text-[12px] font-black px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all active:scale-95 shadow-[0_2px_16px_rgba(249,115,22,0.35)]">
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-5 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/[0.06] blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-orange-600/[0.04] blur-[100px] rounded-full" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.018]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/8 border border-orange-500/20 px-4 py-1.5 rounded-full mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-[11px] font-black uppercase tracking-[0.2em]">7 dias grátis · sem cartão de crédito</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-black tracking-tighter leading-[0.9] mb-6">
            Pare de perder
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
              clientes no WhatsApp.
            </span>
          </h1>

          <p className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Agenda online inteligente, gestão de barbeiros, caixa automático e programa de fidelidade —
            tudo num painel que <strong className="text-zinc-300">funciona enquanto você corta</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-14">
            <Link
              href="/auth/login"
              className="group flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-black text-[15px] transition-all shadow-[0_4px_32px_rgba(249,115,22,0.35)] active:scale-[0.98]"
            >
              TESTAR 7 DIAS GRÁTIS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#recursos"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-orange-400" />
              Ver como funciona
            </a>
          </div>

          {/* Social proof inline */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-14">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {['C', 'M', 'R', 'J'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030303] bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />)}
                  <span className="text-[10px] font-black text-zinc-500 ml-1">5.0</span>
                </div>
                <p className="text-zinc-500 text-[11px] font-medium">+1.200 agendamentos realizados</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-zinc-800" />
            <div className="flex items-center gap-3">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-zinc-600 text-[11px] font-bold">Setup em 5 minutos</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-zinc-600 text-[11px] font-bold">Sem taxa por agendamento</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-zinc-600 text-[11px] font-bold">Cancele quando quiser</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            {/* Glow behind card */}
            <div className="absolute inset-x-8 bottom-0 h-32 bg-orange-500/10 blur-3xl" />
            <div className="relative bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-zinc-800 rounded-lg px-4 py-1 text-[10px] text-zinc-600 font-mono flex items-center gap-2">
                    <Lock className="w-2.5 h-2.5 text-emerald-500" />
                    agendeibarber.com/sua-barbearia
                  </div>
                </div>
              </div>
              {/* Fake dashboard content */}
              <div className="p-5 md:p-6 bg-[#0a0a0a]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Dashboard</p>
                    <p className="text-white font-bold text-base">Bom dia, Carlos 👋</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-[11px] font-bold">3 agendamentos hoje</span>
                  </div>
                </div>
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Receita do mês', value: 'R$ 4.820', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Agendamentos', value: '47', icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Clientes ativos', value: '128', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Ticket médio', value: 'R$ 68', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  ].map(kpi => (
                    <div key={kpi.label} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3">
                      <div className={`w-7 h-7 ${kpi.bg} rounded-lg flex items-center justify-center mb-2`}>
                        <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                      </div>
                      <p className="text-white font-black text-base leading-none mb-1">{kpi.value}</p>
                      <p className="text-zinc-600 text-[10px] font-medium">{kpi.label}</p>
                    </div>
                  ))}
                </div>
                {/* Schedule preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Agenda de Hoje</p>
                    <div className="space-y-2">
                      {[
                        { time: '09:00', name: 'João Silva', service: 'Corte + Barba', barber: 'Carlos', status: 'done' },
                        { time: '10:30', name: 'Pedro Lima', service: 'Degradê', barber: 'Marcos', status: 'active' },
                        { time: '11:00', name: 'Lucas Rocha', service: 'Corte Navalhado', barber: 'Carlos', status: 'next' },
                      ].map((item) => (
                        <div key={item.time} className={`flex items-center gap-3 p-2.5 rounded-lg ${item.status === 'active' ? 'bg-orange-500/8 border border-orange-500/20' : 'bg-zinc-900/40'}`}>
                          <span className="text-[10px] font-black text-zinc-600 w-10 flex-shrink-0">{item.time}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-bold truncate ${item.status === 'done' ? 'text-zinc-600 line-through' : 'text-white'}`}>{item.name}</p>
                            <p className="text-[10px] text-zinc-600 truncate">{item.service}</p>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md flex-shrink-0 ${
                            item.status === 'active' ? 'bg-orange-500/20 text-orange-400' :
                            item.status === 'done' ? 'bg-zinc-800 text-zinc-600' :
                            'bg-zinc-800 text-zinc-500'
                          }`}>
                            {item.status === 'active' ? 'Em andamento' : item.status === 'done' ? 'Concluído' : 'Aguardando'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Top Barbeiros</p>
                    <div className="space-y-3">
                      {[
                        { name: 'Carlos', value: 'R$ 2.640', pct: 78 },
                        { name: 'Marcos', value: 'R$ 1.480', pct: 44 },
                        { name: 'Rafael', value: 'R$ 700', pct: 21 },
                      ].map((b, i) => (
                        <div key={b.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[11px] font-bold text-zinc-400">{b.name}</span>
                            <span className="text-[10px] font-black text-zinc-500">{b.value}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: `${b.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* ─── METRICS BAR ────────────────────────────────────────────── */}
      <section className="border-y border-zinc-900/60 bg-zinc-950/40">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:divide-x md:divide-zinc-900">
            {[
              { value: '1.200+', label: 'Agendamentos realizados' },
              { value: '98%', label: 'Satisfação dos donos' },
              { value: '5 min', label: 'Tempo médio de setup' },
              { value: '24h', label: 'Suporte disponível' },
            ].map(m => (
              <div key={m.label} className="text-center md:px-8">
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{m.value}</p>
                <p className="text-zinc-600 text-[11px] font-medium">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEMA → SOLUÇÃO ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              O problema
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              Você ainda gerencia sua barbearia<br />
              <span className="text-orange-500">como se fosse 2010?</span>
            </h2>
            <p className="text-zinc-600 text-sm font-medium max-w-lg mx-auto">
              WhatsApp, caderno e planilha funcionam — mas te custam tempo, dinheiro e clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sem o Agendei */}
            <div className="relative p-7 md:p-8 border border-red-900/20 bg-red-950/[0.04] rounded-2xl overflow-hidden">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                <X className="w-4 h-4 text-red-500/70" />
              </div>
              <p className="text-[11px] font-black text-red-400/80 uppercase tracking-[0.2em] mb-5">Sem o Agendei</p>
              <ul className="space-y-4">
                {[
                  { icon: MessageSquare, text: '"Tem horário amanhã?" às 23h no WhatsApp' },
                  { icon: X, text: 'Dois clientes marcados no mesmo horário' },
                  { icon: BarChart, text: 'Zero controle de quanto cada barbeiro faz' },
                  { icon: Clock, text: 'Horas perdidas marcando e remarcando no caderno' },
                  { icon: Users, text: 'Clientes fiéis que somem sem avisar' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-zinc-500 font-medium">
                    <div className="w-5 h-5 rounded-lg bg-red-500/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-3 h-3 text-red-500/60" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Com o Agendei */}
            <div className="relative p-7 md:p-8 border border-emerald-900/20 bg-emerald-950/[0.04] rounded-2xl overflow-hidden">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400/80" />
              </div>
              <p className="text-[11px] font-black text-emerald-400/80 uppercase tracking-[0.2em] mb-5">Com o Agendei</p>
              <ul className="space-y-4">
                {[
                  { icon: Smartphone, text: 'Cliente agenda pelo link, sozinho, a qualquer hora' },
                  { icon: Calendar, text: 'Sistema bloqueia conflitos de horário automaticamente' },
                  { icon: DollarSign, text: 'Comissão calculada em tempo real, sem discussão' },
                  { icon: Activity, text: 'Dashboard completo com todas as métricas do mês' },
                  { icon: Gift, text: 'Programa de pontos que fideliza sem você precisar fazer nada' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-3 h-3 text-emerald-400" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RECURSOS ───────────────────────────────────────────────── */}
      <section id="recursos" className="py-24 md:py-32 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Tudo incluído
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              Um sistema completo.<br />
              <span className="text-orange-500">Zero gambiarra.</span>
            </h2>
            <p className="text-zinc-600 text-sm font-medium max-w-md mx-auto">
              Cada recurso foi pensado pra realidade da sua barbearia — não de um escritório.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Calendar,
                title: 'Agenda Inteligente',
                desc: 'Link exclusivo da sua barbearia. Clientes agendam 24h por dia. Sem WhatsApp, sem conflito de horário.',
                highlight: 'Link próprio da barbearia',
                color: { border: 'hover:border-orange-500/20', bg: 'hover:bg-orange-500/[0.025]', icon: 'text-orange-400 bg-orange-500/10 border-orange-500/15' },
              },
              {
                icon: Users,
                title: 'Gestão de Barbeiros',
                desc: 'Cadastre cada profissional, defina comissões individuais e acompanhe a performance de cada um.',
                highlight: 'Comissão automática',
                color: { border: 'hover:border-blue-500/20', bg: 'hover:bg-blue-500/[0.025]', icon: 'text-blue-400 bg-blue-500/10 border-blue-500/15' },
              },
              {
                icon: DollarSign,
                title: 'Caixa & Financeiro',
                desc: 'Fechamento diário automático. Entradas, saídas, contas a pagar e receber — tudo em um lugar.',
                highlight: 'Fechamento automático',
                color: { border: 'hover:border-emerald-500/20', bg: 'hover:bg-emerald-500/[0.025]', icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15' },
              },
              {
                icon: Gift,
                title: 'Fidelidade Digital',
                desc: 'Programa de pontos que roda sozinho. A cada visita o cliente acumula — o sistema avisa na hora de resgatar.',
                highlight: 'Retenção automatizada',
                color: { border: 'hover:border-purple-500/20', bg: 'hover:bg-purple-500/[0.025]', icon: 'text-purple-400 bg-purple-500/10 border-purple-500/15' },
              },
              {
                icon: BarChart2,
                title: 'Relatórios Smart',
                desc: 'Ticket médio, retenção de clientes, serviços mais vendidos. Tome decisões com base em dados reais.',
                highlight: 'Insights em tempo real',
                color: { border: 'hover:border-pink-500/20', bg: 'hover:bg-pink-500/[0.025]', icon: 'text-pink-400 bg-pink-500/10 border-pink-500/15' },
              },
              {
                icon: Briefcase,
                title: 'PDV & Produtos',
                desc: 'Venda produtos no balcão, controle estoque e integre com o caixa. Tudo no mesmo painel.',
                highlight: 'Estoque integrado',
                color: { border: 'hover:border-cyan-500/20', bg: 'hover:bg-cyan-500/[0.025]', icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15' },
              },
            ].map(({ icon: Icon, title, desc, highlight, color }) => (
              <div
                key={title}
                className={`group p-6 bg-zinc-950/60 border border-zinc-900/60 rounded-2xl transition-all duration-300 cursor-default ${color.border} ${color.bg}`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                  <span className="text-[8px] font-black text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded whitespace-nowrap mt-0.5">
                    {highlight}
                  </span>
                </div>
                <p className="text-zinc-600 text-[13px] font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ──────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Simples assim
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              Do zero ao <span className="text-orange-500">primeiro agendamento</span><br />em 5 minutos.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Cadastre sua barbearia',
                desc: 'Crie sua conta, adicione os barbeiros e os serviços que vocês oferecem.',
                icon: Scissors,
              },
              {
                step: '02',
                title: 'Compartilhe o link',
                desc: 'Você recebe um link exclusivo. Coloque no WhatsApp, Instagram e Google.',
                icon: Smartphone,
              },
              {
                step: '03',
                title: 'Clientes agendam sozinhos',
                desc: 'Eles escolhem serviço, barbeiro e horário. Você só corta o cabelo.',
                icon: Calendar,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-zinc-800 to-transparent z-0 -translate-y-0.5" />
                )}
                <div className="relative z-10 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-[11px] font-black text-orange-500/60 uppercase tracking-widest">Passo {item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-600 text-[13px] font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANOS ─────────────────────────────────────────────────── */}
      <section id="planos" className="py-24 md:py-32 px-5 md:px-8 relative border-t border-zinc-900/40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/[0.05] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Preços transparentes
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              Menos que um corte por semana.<br />
              <span className="text-orange-500">Resultado por mês inteiro.</span>
            </h2>
            <p className="text-zinc-600 text-sm font-medium max-w-md mx-auto">
              Sem taxa por agendamento. Sem surpresas na fatura. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

            {/* Starter */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-7 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-white">Starter</h3>
                </div>
                <p className="text-zinc-600 text-xs font-medium">Para quem trabalha solo</p>
              </div>
              <div className="mb-6">
                <div className="flex items-end gap-0.5 leading-none mb-1">
                  <span className="text-[11px] font-bold text-zinc-500 mb-1.5 mr-0.5">R$</span>
                  <span className="text-4xl font-black text-white">49</span>
                  <span className="text-xl font-black text-zinc-500 mb-1">,90</span>
                </div>
                <span className="text-zinc-600 text-xs font-medium">por mês</span>
              </div>
              <div className="h-px bg-zinc-900 mb-5" />
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '1 barbeiro',
                  'Agendamentos ilimitados',
                  'Link exclusivo da barbearia',
                  'Gestão de clientes',
                  'Caixa & fechamento diário',
                  'Programa de fidelidade',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-zinc-500 font-medium">
                    <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-zinc-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center border border-zinc-800 hover:border-zinc-700 active:scale-[0.98]">
                Começar Agora
              </Link>
            </div>

            {/* Profissional — DESTAQUE */}
            <div className="relative flex flex-col md:-mt-4 md:-mb-4">
              {/* Gradient border trick */}
              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-orange-500 via-orange-600 to-red-600 p-px">
                <div className="w-full h-full bg-[#0a0808] rounded-[19px]" />
              </div>
              <div className="relative z-10 p-7 flex flex-col">
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                  <Crown className="w-3 h-3" /> Mais Popular
                </div>
                <div className="mb-6 pt-2">
                  <h3 className="text-lg font-black text-white mb-1">Profissional</h3>
                  <p className="text-zinc-500 text-xs font-medium">Para barbearias em crescimento</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-0.5 leading-none mb-1">
                    <span className="text-[11px] font-bold text-orange-400/60 mb-1.5 mr-0.5">R$</span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-500">99</span>
                    <span className="text-xl font-black text-orange-400/60 mb-1">,90</span>
                  </div>
                  <span className="text-zinc-600 text-xs font-medium">por mês</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400">Melhor custo-benefício</span>
                  </div>
                </div>
                <div className="h-px bg-orange-500/10 mb-5" />
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    'Até 3 barbeiros',
                    'Agendamentos ilimitados',
                    'Tudo do Starter',
                    'Comissões por profissional',
                    'PDV integrado (produtos)',
                    'Relatórios inteligentes',
                    'Contas a pagar/receber',
                    'Suporte prioritário',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-[13px] text-zinc-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-orange-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(249,115,22,0.3)] active:scale-[0.98]">
                  COMEÇAR 7 DIAS GRÁTIS <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] text-zinc-700 text-center mt-2.5 font-medium">Sem cartão de crédito no trial</p>
              </div>
            </div>

            {/* Premium */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-7 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-white">Premium</h3>
                  <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-purple-400" />
                  </div>
                </div>
                <p className="text-zinc-600 text-xs font-medium">Para equipes grandes</p>
              </div>
              <div className="mb-6">
                <div className="flex items-end gap-0.5 leading-none mb-1">
                  <span className="text-[11px] font-bold text-zinc-500 mb-1.5 mr-0.5">R$</span>
                  <span className="text-4xl font-black text-white">149</span>
                  <span className="text-xl font-black text-zinc-500 mb-1">,90</span>
                </div>
                <span className="text-zinc-600 text-xs font-medium">por mês</span>
              </div>
              <div className="h-px bg-zinc-900 mb-5" />
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Até 6 barbeiros',
                  'Agendamentos ilimitados',
                  'Tudo do Profissional',
                  'Múltiplas unidades',
                  'Relatórios avançados',
                  'Fechamento mensal completo',
                  'Suporte VIP via WhatsApp',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-zinc-500 font-medium">
                    <div className="w-4 h-4 rounded-full bg-zinc-900 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-purple-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login" className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center border border-zinc-800 hover:border-purple-500/20 active:scale-[0.98]">
                Assinar Premium
              </Link>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-[11px] font-bold text-zinc-700">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500/50" /> Garantia de 30 dias</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-zinc-600" /> Dados 100% seguros</span>
            <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-zinc-600" /> Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ────────────────────────────────────────────── */}
      <section id="depoimentos" className="py-24 md:py-32 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Quem usa, recomenda
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              Donos de barbearia que<br />
              <span className="text-orange-500">mudaram de patamar.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Carlos "Navalha"',
                shop: 'Barbearia do Navalha — SP',
                avatar: 'C',
                text: 'Antes eu passava 2h por dia no WhatsApp marcando horário. Agora o link faz tudo sozinho e meus clientes adoram a praticidade.',
                metric: '+40% agendamentos',
                metricColor: 'text-emerald-400 bg-emerald-500/8 border-emerald-500/15',
              },
              {
                name: 'Marcos Henrique',
                shop: 'MH Barber Studio — RJ',
                avatar: 'M',
                text: 'O fechamento automático de comissões salvou minha vida. Sem discussão, sem erro. O barbeiro vê quanto tem a receber na hora.',
                metric: 'Zero erros no caixa',
                metricColor: 'text-orange-400 bg-orange-500/8 border-orange-500/15',
              },
              {
                name: 'Rafael Costa',
                shop: 'Corte & Estilo — MG',
                avatar: 'R',
                text: 'Meu cliente fiel não sabia que tinha pontos acumulados. Quando mostrei, ele ficou impressionado. O programa de fidelidade fideliza de verdade.',
                metric: '+25% retenção',
                metricColor: 'text-purple-400 bg-purple-500/8 border-purple-500/15',
              },
            ].map(t => (
              <div key={t.name} className="bg-zinc-950/60 border border-zinc-900/60 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />)}
                </div>
                <p className="text-zinc-400 text-[13px] font-medium leading-relaxed mb-6 flex-1">"{t.text}"</p>
                <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-black text-zinc-300">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-bold text-[13px]">{t.name}</p>
                      <p className="text-zinc-700 text-[10px] font-medium">{t.shop}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black border px-2.5 py-1 rounded-lg uppercase tracking-wider flex-shrink-0 ${t.metricColor}`}>
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 md:py-32 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Dúvidas frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              Respondemos antes<br />de você perguntar.
            </h2>
          </div>
          <div className="space-y-2">
            {[
              {
                q: 'Preciso instalar algum aplicativo?',
                a: 'Não! O Agendei funciona 100% no navegador. Acesse de qualquer dispositivo — celular, tablet ou computador. Nada para instalar.',
              },
              {
                q: 'Meu cliente precisa fazer cadastro para agendar?',
                a: 'Não. Ele só informa nome e telefone na hora de agendar. Se já agendou antes, o sistema reconhece automaticamente.',
              },
              {
                q: 'Posso cancelar quando quiser?',
                a: 'Sim, sem multa e sem burocracia. Você cancela direto no painel em 2 cliques. Sem cartas, sem ligações.',
              },
              {
                q: 'Tem limite de clientes cadastrados?',
                a: 'Não! Em qualquer plano você pode cadastrar quantos clientes quiser. Não cobramos por volume.',
              },
              {
                q: 'Funciona para mais de uma unidade?',
                a: 'Sim. Cada unidade tem seu próprio ambiente isolado com link exclusivo. No plano Premium você pode gerenciar múltiplas barbearias.',
              },
              {
                q: 'Como funciona o trial de 7 dias?',
                a: 'Você acessa todos os recursos do plano Profissional por 7 dias, sem precisar cadastrar cartão de crédito. Após o período, você decide se quer continuar.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-zinc-950/60 border border-zinc-900/60 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-bold text-zinc-400 hover:text-white transition-colors list-none gap-3">
                  <span>{q}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-[13px] text-zinc-500 font-medium leading-relaxed border-t border-zinc-900/40 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-5 md:px-8 relative border-t border-zinc-900/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/[0.07] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/[0.05] blur-[100px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Scissors className="w-7 h-7 text-orange-500" strokeWidth={2} />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 leading-[0.95]">
            Sua barbearia merece<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
              sair do caderninho.
            </span>
          </h2>
          <p className="text-zinc-500 text-base font-medium mb-10 leading-relaxed max-w-md mx-auto">
            Configure em 5 minutos. Compartilhe o link. Nunca mais perca um agendamento por falta de organização.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] px-10 py-4 rounded-2xl font-black text-base transition-all shadow-[0_4px_40px_rgba(249,115,22,0.35)] group"
          >
            COMEÇAR 7 DIAS GRÁTIS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-4 text-[11px] text-zinc-700 font-medium flex items-center justify-center gap-3">
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-zinc-600" />Sem cartão</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-zinc-600" />7 dias grátis</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3 text-zinc-600" />Cancele quando quiser</span>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="py-10 border-t border-zinc-900/40 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-zinc-600" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-zinc-700 text-sm">
                Agendei Barber © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-6 text-zinc-800 font-bold text-[11px] uppercase tracking-widest">
              <Link href="#" className="hover:text-zinc-500 transition-colors">Termos de uso</Link>
              <Link href="#" className="hover:text-zinc-500 transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-zinc-500 transition-colors">Suporte</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
