import { Scissors, Calendar, ShieldCheck, Zap, ArrowRight, Star, BarChart2, Users, Smartphone, Check, Crown, Clock, DollarSign, TrendingUp, MessageSquare, Gift, ChevronRight, X, Sparkles, Heart, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#040404] text-white selection:bg-orange-500/25 overflow-x-hidden">

      {/* ─── NAVBAR ──────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#040404]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-[0_0_14px_rgba(249,115,22,0.35)]">
              <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">AGENDEI</span>
              <span className="text-zinc-400 font-light"> BARBER</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mr-4">
              <a href="#funcionalidades" className="hover:text-white transition-colors">Recursos</a>
              <a href="#planos" className="hover:text-white transition-colors">Planos</a>
              <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
            </div>
            <Link
              href="/auth/login"
              className="text-xs font-bold text-zinc-500 hover:text-white px-4 py-2 transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/auth/login"
              className="text-xs font-black px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all active:scale-95 shadow-[0_2px_12px_rgba(249,115,22,0.3)]"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 px-5">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/15 via-[#040404] to-[#040404]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vw] max-w-3xl bg-orange-500/[0.04] blur-[160px] rounded-full pointer-events-none" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/8 border border-orange-500/15 px-4 py-2 rounded-full text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in-up">
            <Zap className="w-3 h-3" /> 7 dias grátis · Sem cartão de crédito
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tighter mb-6 leading-[0.92] animate-fade-in-up-delay-1">
            Pare de perder{' '}
            <br className="hidden md:block" />
            clientes no{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 animate-shimmer">
              WhatsApp.
            </span>
          </h1>

          <p className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up-delay-2">
            Agenda online inteligente, gestão completa de barbeiros, caixa automático e programa de fidelidade — tudo num painel que{' '}
            <strong className="text-zinc-300">funciona enquanto você corta</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-12 animate-fade-in-up-delay-3">
            <Link
              href="/auth/login"
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 px-8 py-4 rounded-2xl font-black text-base flex items-center gap-2.5 transition-all shadow-[0_4px_24px_rgba(249,115,22,0.3)] group animate-pulse-glow"
            >
              TESTAR 7 DIAS GRÁTIS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 px-5 py-3.5 bg-zinc-900/40 backdrop-blur rounded-2xl border border-zinc-800/40">
              <div className="flex -space-x-2">
                {['C', 'M', 'R'].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#050505] bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-xs leading-none mb-1">+1.200 agendamentos</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="text-[9px] font-bold text-zinc-600 ml-1">5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[10px] font-bold text-zinc-700 uppercase tracking-wider animate-fade-in-up-delay-3">
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Setup em 5 min</span>
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Sem taxa por agendamento</span>
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Cancele quando quiser</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-1.5">
            <div className="w-0.5 h-1.5 bg-orange-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── PROBLEMA → SOLUÇÃO ──────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Por que o Agendei?
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
              Chega de dor de cabeça <span className="text-orange-500">com agenda.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* Without */}
            <div className="p-6 md:p-8 bg-red-500/[0.03] border border-red-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 bg-red-500/10 rounded-lg"><X className="w-3.5 h-3.5 text-red-500" /></div>
                <span className="text-xs font-black text-red-400 uppercase tracking-wider">Sem o Agendei</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  'Cliente manda "tem horário?" no WhatsApp às 23h',
                  'Barbeiro marca dois clientes no mesmo horário',
                  'Você não sabe quanto cada barbeiro produziu',
                  'Caderno lotado de rabiscos e horários trocados',
                  'Perde clientes fiéis porque esqueceu de avisar',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-500 font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* With */}
            <div className="p-6 md:p-8 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Check className="w-3.5 h-3.5 text-emerald-500" /></div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Com o Agendei</span>
              </div>
              <ul className="space-y-3.5">
                {[
                  'Cliente agenda pelo link, sozinho, a qualquer hora',
                  'Sistema bloqueia choques automaticamente',
                  'Comissão calculada em tempo real por profissional',
                  'Dashboard digital com métricas e fechamento',
                  'Programa de fidelidade automático com pontos',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FUNCIONALIDADES ─────────────────────────────────── */}
      <section id="funcionalidades" className="py-20 md:py-28 border-t border-zinc-900/40 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Tudo incluído
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
              Um sistema completo. <span className="text-orange-500">Zero gambiarra.</span>
            </h2>
            <p className="text-zinc-600 text-sm font-medium max-w-md mx-auto">Cada recurso foi pensado para a realidade da sua barbearia.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Calendar,
                title: 'Agenda Inteligente',
                desc: 'Clientes agendam pelo link 24h, sem WhatsApp. Conflitos bloqueados automaticamente.',
                color: 'orange',
              },
              {
                icon: Users,
                title: 'Gestão de Equipe',
                desc: 'Cadastre barbeiros, defina comissões individuais e acompanhe performance.',
                color: 'blue',
              },
              {
                icon: DollarSign,
                title: 'Caixa & Financeiro',
                desc: 'Fechamento diário automático. Entradas, saídas, comissões e contas a pagar/receber.',
                color: 'green',
              },
              {
                icon: Gift,
                title: 'Fidelidade Digital',
                desc: 'Programa de pontos que roda sozinho. Cada visita acumula, o sistema avisa na hora.',
                color: 'purple',
              },
              {
                icon: Smartphone,
                title: 'Página Exclusiva',
                desc: 'Sua barbearia com URL personalizada, catálogo de serviços e reserva online.',
                color: 'cyan',
              },
              {
                icon: BarChart2,
                title: 'Relatórios Smart',
                desc: 'Retenção de clientes, ticket médio, top serviços — decisões baseadas em dados.',
                color: 'pink',
              },
            ].map(({ icon: Icon, title, desc, color }) => {
              const colorMap: Record<string, string> = {
                orange: 'group-hover:border-orange-500/20 group-hover:bg-orange-500/[0.02]',
                blue: 'group-hover:border-blue-500/20 group-hover:bg-blue-500/[0.02]',
                green: 'group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.02]',
                purple: 'group-hover:border-purple-500/20 group-hover:bg-purple-500/[0.02]',
                cyan: 'group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.02]',
                pink: 'group-hover:border-pink-500/20 group-hover:bg-pink-500/[0.02]',
              };
              const iconColorMap: Record<string, string> = {
                orange: 'text-orange-500 bg-orange-500/8 border-orange-500/15',
                blue: 'text-blue-500 bg-blue-500/8 border-blue-500/15',
                green: 'text-emerald-500 bg-emerald-500/8 border-emerald-500/15',
                purple: 'text-purple-500 bg-purple-500/8 border-purple-500/15',
                cyan: 'text-cyan-500 bg-cyan-500/8 border-cyan-500/15',
                pink: 'text-pink-500 bg-pink-500/8 border-pink-500/15',
              };
              return (
                <div key={title} className={`group p-6 bg-[#080808] border border-zinc-900/60 rounded-2xl transition-all duration-300 ${colorMap[color]}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${iconColorMap[color]}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                  <p className="text-zinc-600 text-[13px] font-medium leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PLANOS ─────────────────────────────────────────── */}
      <section id="planos" className="py-20 md:py-28 px-5 md:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/[0.06] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Preços transparentes
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
              Invista menos que um <span className="text-orange-500">corte por semana.</span>
            </h2>
            <p className="text-zinc-600 text-sm font-medium max-w-md mx-auto">Sem taxa por agendamento. Sem surpresas. Cancele quando quiser.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">

            {/* Starter Plan */}
            <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-6 md:p-7 flex flex-col">
              <div className="mb-5">
                <h3 className="text-base font-bold text-white mb-1">Starter</h3>
                <p className="text-zinc-600 text-xs font-medium">Para quem trabalha solo</p>
              </div>
              <div className="mb-5">
                <div className="flex items-end gap-0.5">
                  <span className="text-3xl md:text-4xl font-black text-white">R$ 49</span>
                  <span className="text-zinc-500 text-lg font-bold">,00</span>
                </div>
                <span className="text-zinc-600 text-xs font-medium">/mês</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  '1 barbeiro',
                  'Agendamentos ilimitados',
                  'Página pública exclusiva',
                  'Gestão de clientes',
                  'Caixa & fechamento diário',
                  'Programa de fidelidade',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-zinc-500 font-medium">
                    <Check className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center border border-zinc-800 hover:border-zinc-700"
              >
                Começar Agora
              </Link>
            </div>

            {/* Profissional Plan — HIGHLIGHT */}
            <div className="relative bg-[#080808] rounded-2xl p-6 md:p-7 flex flex-col overflow-hidden md:scale-[1.03]">
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 -z-10">
                <div className="w-full h-full bg-[#080808] rounded-[calc(1rem-1px)]" />
              </div>

              {/* Popular badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[8px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                <Crown className="w-2.5 h-2.5" /> Mais Popular
              </div>

              <div className="mb-5">
                <h3 className="text-base font-bold text-white mb-1">Profissional</h3>
                <p className="text-zinc-600 text-xs font-medium">Para barbearias em crescimento</p>
              </div>
              <div className="mb-5">
                <div className="flex items-end gap-0.5">
                  <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">R$ 99</span>
                  <span className="text-orange-400/60 text-lg font-bold">,90</span>
                </div>
                <span className="text-zinc-600 text-xs font-medium">/mês</span>
                <p className="text-[10px] font-bold text-emerald-500 mt-1.5 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> Melhor custo-benefício
                </p>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  'Até 3 barbeiros',
                  'Agendamentos ilimitados',
                  'Tudo do plano Starter',
                  'Comissões por profissional',
                  'PDV integrado (produtos)',
                  'Relatórios inteligentes',
                  'Contas a pagar e receber',
                  'Suporte prioritário',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.25)] active:scale-[0.98]"
              >
                COMEÇAR 7 DIAS GRÁTIS <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[10px] text-zinc-700 text-center mt-2.5 font-medium">Sem cartão de crédito no trial</p>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-6 md:p-7 flex flex-col">
              <div className="mb-5">
                <h3 className="text-base font-bold text-white mb-1">Premium</h3>
                <p className="text-zinc-600 text-xs font-medium">Para operações com equipe grande</p>
              </div>
              <div className="mb-5">
                <div className="flex items-end gap-0.5">
                  <span className="text-3xl md:text-4xl font-black text-white">R$ 149</span>
                  <span className="text-zinc-500 text-lg font-bold">,90</span>
                </div>
                <span className="text-zinc-600 text-xs font-medium">/mês</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  'Até 6 barbeiros',
                  'Agendamentos ilimitados',
                  'Tudo do plano Profissional',
                  'Múltiplas unidades',
                  'Relatórios avançados',
                  'Fechamento mensal completo',
                  'Suporte VIP via WhatsApp',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-zinc-500 font-medium">
                    <Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center border border-zinc-800 hover:border-zinc-700"
              >
                Assinar Premium
              </Link>
            </div>
          </div>

          {/* Money Back */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-600">
            <Shield className="w-3.5 h-3.5 text-emerald-500/60" />
            Garantia de 30 dias ou seu dinheiro de volta
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─────────────────────────────────────── */}
      <section id="depoimentos" className="py-20 md:py-28 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
              Quem usa, recomenda
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
              Donos de barbearia <span className="text-orange-500">que mudaram de nível.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Carlos "Navalha"',
                shop: 'Barbearia do Navalha - SP',
                text: 'Antes eu passava 2h por dia no WhatsApp marcando horário. Agora o link faz tudo sozinho e meus clientes adoram.',
                metric: '+40% agendamentos',
              },
              {
                name: 'Marcos Henrique',
                shop: 'MH Barber Studio - RJ',
                text: 'O fechamento automático de comissões salvou minha vida. Sem discussão, sem erro. O barbeiro vê quanto tem a receber na hora.',
                metric: 'Zero erros no caixa',
              },
              {
                name: 'Rafael Costa',
                shop: 'Corte & Estilo - MG',
                text: 'Meu cliente mais fiel não sabia que tinha pontos acumulados. Quando mostrei, ele ficou doido! Isso fideliza de verdade.',
                metric: '+25% retenção',
              },
            ].map(t => (
              <div key={t.name} className="bg-[#080808] border border-zinc-900/60 rounded-2xl p-6 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-zinc-400 text-[13px] font-medium leading-relaxed mb-5 flex-1">"{t.text}"</p>
                <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4">
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-zinc-700 text-[10px] font-medium">{t.shop}</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ RÁPIDO ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 border-t border-zinc-900/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">Dúvidas Frequentes</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Preciso instalar algum aplicativo?', a: 'Não! O Agendei funciona 100% no navegador. Acesse de qualquer dispositivo — celular, tablet ou computador.' },
              { q: 'Meu cliente precisa fazer cadastro?', a: 'Não. Ele só informa nome e telefone na hora de agendar. Se já agendou antes, o sistema reconhece automaticamente.' },
              { q: 'Posso cancelar quando quiser?', a: 'Sim, sem multa e sem burocracia. Você cancela direto no painel em 2 cliques.' },
              { q: 'Tem limite de clientes cadastrados?', a: 'No plano Profissional, não! Cadastre quantos clientes quiser.' },
              { q: 'E se eu tiver mais de uma unidade?', a: 'Cada unidade tem seu próprio ambiente isolado. Um dono pode gerenciar múltiplas barbearias.' },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-[#080808] border border-zinc-900/60 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-bold text-zinc-300 hover:text-white transition-colors list-none">
                  {q}
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-4 text-[13px] text-zinc-500 font-medium leading-relaxed border-t border-zinc-900/40 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5 md:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/[0.08] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-orange-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Sua barbearia merece<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              sair do caderninho.
            </span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-medium mb-8 leading-relaxed max-w-md mx-auto">
            Configure em 5 minutos. Compartilhe o link. E nunca mais perca um agendamento.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 px-10 py-4 rounded-2xl font-black text-base transition-all shadow-[0_4px_32px_rgba(249,115,22,0.3)] group"
          >
            COMEÇAR GRÁTIS AGORA
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-4 text-[10px] text-zinc-700 font-medium">
            7 dias gratuitos · Sem cartão · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-12 border-t border-zinc-900/40 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <Scissors className="w-3 h-3 text-zinc-600" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-zinc-700 text-sm">
                Agendei Barber © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex gap-8 text-zinc-800 font-bold text-[10px] uppercase tracking-widest">
              <Link href="#" className="hover:text-zinc-400 transition-colors">Termos</Link>
              <Link href="#" className="hover:text-zinc-400 transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-zinc-400 transition-colors">Suporte</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
