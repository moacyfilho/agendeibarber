import { BookingCalendar } from "@/components/BookingCalendar";
import { prisma } from "@/lib/prisma";
import { Scissors, Calendar, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER' } });
  const services = await prisma.service.findMany({ where: { isActive: true } });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white italic shadow-[0_0_20px_rgba(249,115,22,0.4)]">A</div>
             <span className="text-2xl font-black tracking-tighter uppercase italic">Agendei Barber</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-400 uppercase tracking-widest">
             <Link href="#agendar" className="hover:text-white transition-colors">Agendamento</Link>
             <Link href="#servicos" className="hover:text-white transition-colors">Serviços</Link>
             <Link href="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-full hover:bg-orange-500 hover:text-white transition-all">Área do Barbeiro</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* BACKGROUND IMAGE WITH NEON GLOW */}
        <div className="absolute inset-0 z-0">
           <img 
             src="/barber_hero_bg_1774376474349.png" 
             alt="Agendei Barber Interior" 
             className="w-full h-full object-cover opacity-40 scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl pt-20">
           <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap className="w-4 h-4" /> A Experiência Definitiva em Barbearia
           </div>
           
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
             Corte com Estilo, <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Agende com Classe.</span>
           </h1>
           
           <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
             O Agendei Barber conecta você aos mestres da tesoura em uma plataforma premium de agendamento em tempo real.
           </p>

           <div className="flex flex-col md:flex-row gap-4 items-center justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link href="#agendar" className="bg-orange-500 hover:bg-orange-600 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl transition-all shadow-orange-950/20 active:scale-95 group">
                RESERVAR AGORA <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-zinc-900/50 backdrop-blur rounded-2xl border border-zinc-800">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>)}
                </div>
                <div className="text-left leading-none">
                   <p className="text-white font-bold text-sm">500+ Agendamentos</p>
                   <div className="flex text-orange-500 mt-1"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                </div>
              </div>
           </div>
        </div>

        {/* MOUSE SCROLL INDICATOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
           <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-orange-500 rounded-full"></div>
           </div>
        </div>
      </section>

      {/* AGENDAMENTO SECTION */}
      <section id="agendar" className="py-32 px-6 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic uppercase">Escolha sua Experiência</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Selecione o serviço e o profissional abaixo</p>
         </div>

         <div className="max-w-5xl mx-auto bg-zinc-950/50 backdrop-blur-2xl border border-zinc-900 p-8 md:p-14 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full"></div>
            
            <BookingCalendar
               barbers={barbers}
               services={services}
            />
         </div>
      </section>

      {/* FEATURES / DIFERENCIAIS */}
      <section className="py-32 bg-[#050505] border-t border-zinc-900">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-balance">
               <div className="space-y-6">
                  <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-orange-500 shadow-xl"><Calendar className="w-8 h-8" /></div>
                  <h3 className="text-xl font-black uppercase tracking-widest italic">Agendamento Real</h3>
                  <p className="text-zinc-500 font-medium">Veja a disponibilidade imediata e reserve sem ligações ou espera.</p>
               </div>
               <div className="space-y-6">
                  <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-orange-500 shadow-xl"><ShieldCheck className="w-8 h-8" /></div>
                  <h3 className="text-xl font-black uppercase tracking-widest italic">Garantia SaaS</h3>
                  <p className="text-zinc-500 font-medium">Dados protegidos e confirmação automática via e-mail e app.</p>
               </div>
               <div className="space-y-6">
                  <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-orange-500 shadow-xl"><Scissors className="w-8 h-8" /></div>
                  <h3 className="text-xl font-black uppercase tracking-widest italic">Mestres do Corte</h3>
                  <p className="text-zinc-500 font-medium">Trabalhamos apenas com as barbearias de elite do mercado nacional.</p>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-zinc-900 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center font-black text-zinc-500">A</div>
               <span className="font-black text-zinc-500 uppercase tracking-tighter">Agendei Barber © 2026</span>
            </div>
            <div className="flex gap-8 text-zinc-700 font-black text-[10px] uppercase tracking-widest">
               <Link href="#" className="hover:text-zinc-200 transition-colors">Termos</Link>
               <Link href="#" className="hover:text-zinc-200 transition-colors">Privacidade</Link>
               <Link href="#" className="hover:text-zinc-200 transition-colors">Suporte</Link>
            </div>
         </div>
      </footer>
    </main>
  );
}
