import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#030303] min-h-screen w-full relative overflow-x-hidden font-sans text-zinc-50">
      
      {/* Luzes de Fundo Exclusivas do Admin (Esmeralda) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/15 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      {/* Container Principal */}
      <main className="relative z-10 w-full min-h-screen border-t-4 border-emerald-500">
        {children}
      </main>

    </div>
  );
}
