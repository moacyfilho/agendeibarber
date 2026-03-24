import { BookingCalendar } from "@/components/BookingCalendar";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'
import { Scissors, Calendar, ShieldCheck, Zap, ArrowRight, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER' } });
  const services = await prisma.service.findMany({ where: { isActive: true } });

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/25">

      {/* ─── NAVBAR ──────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white italic shadow-[0_0_16px_rgba(249,115,22,0.4)]">
              A
            </div>
            <span className="text-lg font-black tracking-tight uppercase italic text-white">Agendei Barber</span>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <Link href="#agendar" className="hover:text-white transition-colors">Agendamento</Link>
              <Link href="#servicos" className="hover:text-white transition-colors">Serviços</Link>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-black px-5 py-2.5 bg-white text-black rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95"
            >
              Área do Barbeiro
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/barber_hero_bg_1774376474349.png"
            alt="Agendei Barber Interior"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]/80" />
        </div>
        {/* Ambient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh] bg-orange-500/6 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/8 border border-orange-500/15 px-4 py-2 rounded-full text-orange-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
            <Zap className="w-3.5 h-3.5" /> A Experiência Definitiva em Barbearia
          </div>

          <h1 className="text-6xl md:text-[88px] font-black tracking-tighter mb-6 leading-[0.9]">
            Corte com Estilo,{' '}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Agende com Classe.
            </span>
          </h1>

          <p className="text-zinc-500 text-base md:text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            Conectamos você aos mestres da tesoura em uma plataforma premium de agendamento em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="#agendar"
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 px-8 py-4 rounded-2xl font-black text-base flex items-center gap-2.5 transition-all shadow-[0_4px_24px_rgba(249,115,22,0.3)] group"
            >
              RESERVAR AGORA
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 px-5 py-3.5 bg-zinc-900/60 backdrop-blur rounded-2xl border border-zinc-800/60">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#050505] bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-400"
                  >
                    U{i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-xs leading-none mb-1">500+ agendamentos</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-1.5">
            <div className="w-0.5 h-1.5 bg-orange-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── BOOKING ─────────────────────────────────────────── */}
      <section id="agendar" className="py-28 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-orange-500/4 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.25em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-5">
            Agendamento
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 uppercase italic">
            Escolha sua Experiência
          </h2>
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
            Selecione o serviço e o profissional abaixo
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-zinc-950/60 backdrop-blur-2xl border border-zinc-900/80 p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/8 blur-[60px] rounded-full" />
            <BookingCalendar barbers={barbers} services={services} />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <section id="servicos" className="py-28 border-t border-zinc-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">Por que escolher a gente?</h2>
            <p className="text-zinc-600 text-sm font-medium max-w-xs mx-auto">A plataforma que une tecnologia e tradição</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Agendamento Real',
                desc: 'Veja a disponibilidade imediata e reserve sem ligações ou esperas desnecessárias.',
              },
              {
                icon: ShieldCheck,
                title: 'Garantia SaaS',
                desc: 'Dados protegidos, confirmação automática e histórico completo dos seus atendimentos.',
              },
              {
                icon: Scissors,
                title: 'Mestres do Corte',
                desc: 'Trabalhamos apenas com as barbearias de elite e profissionais altamente qualificados.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-8 bg-zinc-900/30 border border-zinc-900/60 rounded-3xl hover:border-zinc-800 hover:bg-zinc-900/50 transition-all text-center">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-orange-500 mb-6 group-hover:border-orange-500/20 group-hover:bg-orange-500/5 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black uppercase tracking-widest italic mb-3">{title}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-14 border-t border-zinc-900/60 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center font-black text-zinc-500 text-xs italic">A</div>
            <span className="font-black text-zinc-600 uppercase tracking-tight text-sm">Agendei Barber © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8 text-zinc-700 font-bold text-[10px] uppercase tracking-widest">
            <Link href="#" className="hover:text-zinc-400 transition-colors">Termos</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
