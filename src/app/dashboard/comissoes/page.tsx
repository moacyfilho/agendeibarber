import Link from 'next/link';
export default function ComissoesPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-xl shadow-orange-500/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <h2 className="text-4xl font-extrabold text-zinc-50 mb-4 tracking-tight">Módulo: Comissões</h2>
      <p className="text-zinc-400 font-medium text-lg max-w-md mx-auto">Esta página do painel já está mapeada na Clean Architecture. Implementações completas do CRUD iniciarão na próxima rodada.</p>
      <Link href="/dashboard" className="mt-8 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">Voltar para Dashboard</Link>
    </div>
  );
}
