import { Wallet, ArrowUpCircle, ArrowDownCircle, Info } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getTenantId } from '@/lib/session'

export default async function CaixaPage() {
  const tenantId = await getTenantId();
  // Lógica simplificada. Num app real, fazemos queries baseadas no timezone do tenant.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Busca Agendamentos Pagos Totais
  const appointmentsPaidGlobally = await prisma.appointment.findMany({
    where: {
      tenantId,
      paymentStatus: 'PAID'
    }
  });

  // Busca Agendamentos Pagos Hoje
  const appointmentsPaidToday = await prisma.appointment.findMany({
    where: {
      tenantId,
      paymentStatus: 'PAID',
      scheduledAt: {
        gte: today
      }
    }
  });

  const entradasGlobais = appointmentsPaidGlobally.reduce((acc, curr) => acc + curr.totalPrice, 0) / 100;
  const entradasHoje = appointmentsPaidToday.reduce((acc, curr) => acc + curr.totalPrice, 0) / 100;
  
  // Simulando 40% de comissões + 5% taxas de cartão
  const comissoesGlobais = entradasGlobais * 0.40;
  const lucroLiquido = entradasGlobais - comissoesGlobais;

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Caixa</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Faturamento e métricas financeiras em tempo real</p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
        <div className="metric-card bg-green-500/5 border border-green-500/15 p-6 md:p-8 rounded-2xl md:rounded-3xl relative">
          <ArrowUpCircle className="absolute top-8 right-8 w-12 h-12 text-green-500 opacity-20" />
          <h3 className="text-green-500 text-sm font-bold uppercase tracking-widest mb-2">Entradas (Hoje)</h3>
          <p className="text-5xl font-black text-white">{BRL.format(entradasHoje)}</p>
        </div>
        <div className="metric-card bg-emerald-500/5 border border-emerald-500/15 p-6 md:p-8 rounded-2xl md:rounded-3xl relative">
          <ArrowUpCircle className="absolute top-8 right-8 w-12 h-12 text-emerald-500 opacity-20" />
          <h3 className="text-emerald-500 text-sm font-bold uppercase tracking-widest mb-2">Entradas (Totais do Sistema)</h3>
          <p className="text-5xl font-black text-white">{BRL.format(entradasGlobais)}</p>
        </div>
        <div className="metric-card bg-red-500/5 border border-red-500/15 p-6 md:p-8 rounded-2xl md:rounded-3xl relative sm:col-span-2 md:col-span-1">
          <ArrowDownCircle className="absolute top-8 right-8 w-12 h-12 text-red-500 opacity-20" />
          <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-2">Saídas Estimadas (Comissões)</h3>
          <p className="text-5xl font-black text-white">{BRL.format(comissoesGlobais)}</p>
          <div className="absolute bottom-6 right-8 flex items-center gap-1 text-red-400 text-xs font-bold uppercase">
            <Info className="w-4 h-4" /> 40% média
          </div>
        </div>
      </section>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 md:p-8 mt-10 mb-6 shadow-xl flex items-center gap-5">
        <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl">
          <Wallet className="w-10 h-10" />
        </div>
        <div>
           <p className="text-zinc-500 font-bold uppercase tracking-widest mb-1 text-sm">Lucro Bruto Global do Workspace</p>
           <p className="text-4xl font-extrabold text-orange-500">{BRL.format(lucroLiquido)}</p>
        </div>
      </div>

      <div className="w-full h-16 md:h-20 bg-[#0a0a0a] border-2 border-dashed border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 font-bold text-sm md:text-base hover:border-orange-500/50 hover:text-orange-500 hover:bg-orange-500/5 transition-colors cursor-pointer">
        + Lançar Recebimento Avulso (Ex: Cerveja/Refrigerante)
      </div>
    </div>
  )
}
