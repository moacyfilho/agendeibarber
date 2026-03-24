import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Camera, Scissors, Clock } from "lucide-react";
import { CustomerEntryFlow } from "@/components/CustomerEntryFlow";

export default async function BarbeariaPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });

  if (!tenant) {
    return notFound();
  }
  
  const barbers = await prisma.user.findMany({ where: { role: 'BARBER', tenantId: tenant.id } });
  const services = await prisma.service.findMany({ where: { isActive: true, tenantId: tenant.id } });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* 📸 HERO SEC / CAPA DA BARBEARIA (Mobile-First) */}
      {/* ========================================================= */}
      <header className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
        
        {/* Placeholder Premium: Foto desfocada e escura simulando ambiente de barbearia */}
        <div className="absolute inset-0 bg-[#0a0a0a] bg-[url('https://images.unsplash.com/photo-1621644332463-54911d8b74f3?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>

        {/* LOGO ROTATÓRIA 3D e NOME */}
        <div className="relative z-10 flex flex-col items-center mt-20 text-center px-4 w-full">
          <div className="w-24 h-24 mb-4 bg-gradient-to-br from-orange-400 to-orange-700 rounded-3xl rotate-3 shadow-[0_0_50px_rgba(249,115,22,0.5)] flex items-center justify-center p-1 hover:rotate-6 transition-transform">
             <div className="w-full h-full bg-[#0a0a0a] rounded-[20px] flex items-center justify-center -rotate-3 text-orange-500">
               <Scissors className="w-10 h-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" strokeWidth={2} />
             </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white px-2 tracking-tighter drop-shadow-2xl">
            {tenant.name}
          </h1>
          
          <p className="text-orange-400 font-black tracking-[0.3em] uppercase text-xs mt-4 flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 py-2 px-5 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)] animate-ping"></span>
            Aberto
          </p>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 🚀 CORPO PRINCIPAL B2C (Área do Cliente Final) */}
      {/* ========================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24 relative z-20">
        
        {/* CARDS ESTILIZADOS DE INFORMAÇÕES (Endereço, Insta, Aberto) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 px-2">
          
          <div className="bg-[#0a0a0a] border border-zinc-900 p-5 rounded-[2rem] flex items-center gap-5 hover:border-orange-500/30 hover:bg-zinc-950 transition-colors shadow-2xl group">
             <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
               <MapPin className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-black text-white uppercase tracking-wider mb-1">Localização</p>
               <p className="text-sm text-zinc-500 font-medium">Bairro Central, 120 - SP</p>
             </div>
          </div>

          <div className="bg-[#0a0a0a] border border-zinc-900 p-5 rounded-[2rem] flex items-center gap-5 hover:border-orange-500/30 hover:bg-zinc-950 transition-colors shadow-2xl group">
             <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
               <Clock className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-black text-white uppercase tracking-wider mb-1">Horários</p>
               <p className="text-sm text-zinc-500 font-medium">09:00 as 20:00 (Seg a Sáb)</p>
             </div>
          </div>

          <div className="bg-[#0a0a0a] border border-zinc-900 p-5 rounded-[2rem] flex items-center gap-5 hover:border-orange-500/30 hover:bg-zinc-950 transition-colors shadow-2xl group cursor-pointer">
             <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
               <Camera className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm font-black text-white uppercase tracking-wider mb-1">Instagram</p>
               <p className="text-sm text-zinc-500 font-medium hover:text-orange-500 transition-colors">@{tenant.slug}_oficial</p>
             </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COMPONENTE WIZARD MASTER DE AGENDAMENTOS */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center justify-center mb-12 relative w-fit mx-auto px-10">
          <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-2">Reserve sua Cadeira</h2>
          <p className="text-zinc-500 font-medium text-lg text-center">3 passos rápidos. Sem ligar, sem esperar.</p>
          <div className="absolute left-0 top-1/2 w-4 h-[2px] bg-orange-500 rounded-full"></div>
          <div className="absolute right-0 top-1/2 w-4 h-[2px] bg-orange-500 rounded-full"></div>
        </div>
        
        {/* O FLUXO DE ENTRADA (POPUP) & CALENDARIO */}
        <CustomerEntryFlow 
          barbers={barbers} 
          services={services} 
          tenantId={tenant.id} 
          tenantName={tenant.name}
        />

      </main>

      {/* ========================================================= */}
      {/* FOOTER SaaS (Branding Invisível) */}
      {/* ========================================================= */}
      <footer className="w-full border-t border-zinc-900 py-10 text-center bg-[#000]">
        <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-zinc-600 text-sm font-medium">Tecnologia fornecida por</span>
            <div className="flex items-center gap-2 opacity-50 px-4 py-2 border border-zinc-800 rounded-full hover:opacity-100 transition-opacity cursor-pointer">
              <span className="w-4 h-4 rounded-md bg-orange-500 flex items-center justify-center">
                <Scissors className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </span>
              <strong className="text-zinc-400 font-black tracking-widest text-xs uppercase">AGENDEI BARBER</strong>
            </div>
        </div>
      </footer>

    </div>
  );
}
