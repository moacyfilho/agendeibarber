import { Wallet, ArrowUpCircle, ArrowDownCircle, Info } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function CaixaPage() {
  // Lógica simplificada. Num app real, fazemos queries baseadas no timezone do tenant.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Busca Agendamentos Pagos Totais
  const appointmentsPaidGlobally = await prisma.appointment.findMany({
    where: {
      paymentStatus: 'PAID'
    }
  });

  // Busca Agendamentos Pagos Hoje
  const appointmentsPaidToday = await prisma.appointment.findMany({
    where: {
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
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <Wallet className="text-orange-500 w-10 h-10" /> 
          Frente de Caixa (Caixa)
        </h2>
        <p className="text-zinc-400 font-medium text-lg">Métricas e faturamento real com base nos agendamentos pagos do banco de dados.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-[2rem] relative">
          <ArrowUpCircle className="absolute top-8 right-8 w-12 h-12 text-green-500 opacity-20" />
          <h3 className="text-green-500 text-sm font-bold uppercase tracking-widest mb-2">Entradas (Hoje)</h3>
          <p className="text-5xl font-black text-white">{BRL.format(entradasHoje)}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] relative">
          <ArrowUpCircle className="absolute top-8 right-8 w-12 h-12 text-emerald-500 opacity-20" />
          <h3 className="text-emerald-500 text-sm font-bold uppercase tracking-widest mb-2">Entradas (Totais do Sistema)</h3>
          <p className="text-5xl font-black text-white">{BRL.format(entradasGlobais)}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] relative">
          <ArrowDownCircle className="absolute top-8 right-8 w-12 h-12 text-red-500 opacity-20" />
          <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-2">Saídas Estimadas (Comissões)</h3>
          <p className="text-5xl font-black text-white">{BRL.format(comissoesGlobais)}</p>
          <div className="absolute bottom-6 right-8 flex items-center gap-1 text-red-400 text-xs font-bold uppercase">
            <Info className="w-4 h-4" /> 40% média
          </div>
        </div>
      </section>

      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] p-8 mt-12 mb-8 shadow-2xl flex items-center gap-6">
        <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl">
          <Wallet className="w-10 h-10" />
        </div>
        <div>
           <p className="text-zinc-500 font-bold uppercase tracking-widest mb-1 text-sm">Lucro Bruto Global do Workspace</p>
           <p className="text-4xl font-extrabold text-orange-500">{BRL.format(lucroLiquido)}</p>
        </div>
      </div>

      <div className="w-full h-24 bg-[#0a0a0a] border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-500 font-black text-xl uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-colors cursor-pointer">
        + Lançar Recebimento Avulso (Ex: Cerveja/Refrigerante)
      </div>
    </div>
  )
}
