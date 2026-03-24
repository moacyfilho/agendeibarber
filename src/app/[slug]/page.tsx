import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'
import { MapPin, Clock, Instagram, Scissors, Star, ChevronRight, CheckCircle } from "lucide-react";
import { CustomerEntryFlow } from "@/components/CustomerEntryFlow";

export default async function BarbeariaPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });

  if (!tenant) return notFound();

  const [barbers, services] = await Promise.all([
    prisma.user.findMany({ where: { role: 'BARBER', tenantId: tenant.id } }),
    prisma.service.findMany({ where: { isActive: true, tenantId: tenant.id }, orderBy: { priceInCents: 'asc' } }),
  ]);

  const initial = tenant.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#060606] text-zinc-50 font-sans selection:bg-orange-500/30 selection:text-white">

      {/* ─── NAVBAR ────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#060606]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-[0_0_14px_rgba(249,115,22,0.4)] flex-shrink-0">
              {initial}
            </div>
            <span className="font-bold text-white text-sm truncate">{tenant.name}</span>
          </div>
          <a
            href="#agendar"
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-[0_2px_12px_rgba(249,115,22,0.3)] flex items-center gap-1.5"
          >
            Agendar <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <header className="relative w-full pt-16" style={{ height: '58vh', minHeight: '440px' }}>
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621644332463-54911d8b74f3?q=80&w=2600&auto=format&fit=crop')" }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-[#060606]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/70 via-transparent to-transparent" />
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-orange-500/6 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-14 px-5 max-w-6xl mx-auto">

          {/* Status badge + logo */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-700 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-[0_0_28px_rgba(249,115,22,0.45)] ring-1 ring-orange-500/30">
              {initial}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Aberto agora
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.92] mb-4 max-w-2xl">
            {tenant.name}
          </h1>

          <p className="text-zinc-400 text-base font-medium max-w-sm mb-8 leading-relaxed">
            Reserve seu horário em minutos — sem ligar, sem esperar.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#agendar"
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 px-7 py-3.5 rounded-2xl font-black text-white text-sm flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
            >
              Reservar Cadeira <ChevronRight className="w-4 h-4" />
            </a>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <span className="font-medium">
                {barbers.length} barbeiro{barbers.length !== 1 ? 's' : ''} disponíve{barbers.length !== 1 ? 'is' : 'l'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── BODY ──────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-5 sm:px-6 pb-24 relative z-20">

        {/* Info cards — overlaps hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 -mt-6 mb-16 relative z-30">
          {[
            { icon: MapPin,    title: 'Localização', value: 'Bairro Central, 120 — SP' },
            { icon: Clock,     title: 'Horário',     value: 'Seg–Sáb, 9h às 20h' },
            { icon: Instagram, title: 'Instagram',   value: `@${tenant.slug}` },
          ].map(({ icon: Icon, title, value }) => (
            <div
              key={title}
              className="bg-zinc-900/80 backdrop-blur border border-zinc-800/70 p-4 rounded-2xl flex items-center gap-3.5 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-default"
            >
              <div className="bg-orange-500/8 border border-orange-500/10 p-2.5 rounded-xl text-orange-400 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">{title}</p>
                <p className="text-sm text-zinc-200 font-semibold truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Services showcase */}
        {services.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Serviços</h2>
                <p className="text-zinc-600 text-xs mt-0.5">Escolha abaixo ao agendar</p>
              </div>
              <a href="#agendar" className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
                Agendar agora <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {services.map(service => (
                <a
                  key={service.id}
                  href="#agendar"
                  className="group bg-zinc-900/50 border border-zinc-800/60 hover:border-orange-500/30 hover:bg-zinc-900/80 p-4 rounded-xl transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-orange-500/8 border border-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500/70 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-200 text-sm truncate group-hover:text-white transition-colors">{service.name}</p>
                      <p className="text-zinc-600 text-xs">{service.durationMinutes} min</p>
                    </div>
                  </div>
                  <p className="text-orange-400 font-black text-base flex-shrink-0">
                    {(service.priceInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Booking section */}
        <section id="agendar" className="scroll-mt-20">
          <div className="text-center mb-10">
            <span className="inline-block text-[10px] font-black text-orange-400 uppercase tracking-[0.25em] bg-orange-500/8 border border-orange-500/15 px-4 py-1.5 rounded-full mb-4">
              Agendamento Online
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Reserve sua Cadeira
            </h2>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
              3 passos rápidos. Sem ligar, sem esperar.
            </p>
          </div>

          <CustomerEntryFlow
            barbers={barbers}
            services={services}
            tenantId={tenant.id}
            tenantName={tenant.name}
          />
        </section>

      </main>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900/60 py-8 bg-[#040404]">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs font-medium">
            © {new Date().getFullYear()} {tenant.name} — Todos os direitos reservados
          </p>
          <div className="flex items-center gap-1.5 opacity-30 hover:opacity-70 transition-opacity cursor-default">
            <span className="text-zinc-500 text-[10px]">Powered by</span>
            <span className="w-3.5 h-3.5 bg-orange-500 rounded-[4px] flex items-center justify-center">
              <Scissors className="w-2 h-2 text-white" strokeWidth={3} />
            </span>
            <strong className="text-zinc-400 font-black text-[10px] uppercase tracking-widest">Agendei Barber</strong>
          </div>
        </div>
      </footer>

    </div>
  );
}
