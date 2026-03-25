import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function FechamentoMensalPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center animate-fade-in-up">
      <div className="page-header-icon w-16 h-16 rounded-2xl mb-6">
        <Scale className="w-7 h-7" />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">Balanço Mensal</h1>
      <p className="text-zinc-500 font-medium text-sm max-w-sm mx-auto leading-relaxed">Este módulo está em desenvolvimento e estará disponível em breve com fechamentos detalhados e relatórios gerenciais.</p>
      <Link href="/dashboard" className="mt-6 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-colors border border-zinc-800 hover:border-zinc-700">
        Voltar ao Painel
      </Link>
    </div>
  );
}
