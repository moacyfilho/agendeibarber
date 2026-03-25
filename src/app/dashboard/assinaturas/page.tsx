import { CreditCard, Rocket, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { createStripeCheckoutSessionAction } from "@/app/actions"
import { redirect } from "next/navigation"
import { getTenantId } from '@/lib/session'

export default async function AssinaturasPage({ searchParams }: { searchParams: { success?: string, canceled?: string } }) {
  const tenantId = await getTenantId();
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  
  if (!tenant) return <div>Tenant não encontrado. Favor voltar ao dashboard.</div>;

  // Busca a assinatura do tenant
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' }
  });

  const hasPlan = tenant?.plan && tenant.plan !== 'FREE' && tenant.plan !== null && tenant.plan !== '';
  const isSubscribed = (subscription && subscription.status === 'ACTIVE') || hasPlan;
  const isGracePeriod = subscription && subscription.status === 'PAST_DUE';

  const planLabel: Record<string, string> = {
    STARTER: 'Starter',
    PROFISSIONAL: 'Profissional',
    PREMIUM: 'Premium',
  };
  const currentPlanName = tenant?.plan && planLabel[tenant.plan]
    ? planLabel[tenant.plan]
    : (isSubscribed ? 'Pro' : 'Free Trial');

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-screen animate-fade-in-up">
      {searchParams.success && (
        <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-6 h-6" /> Parabéns! Sua assinatura Pro foi ativada com sucesso.
        </div>
      )}

      {searchParams.canceled && (
        <div className="mb-8 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 font-bold flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" /> O pagamento foi cancelado. Se tiver dúvidas, entre em contato.
        </div>
      )}

      <header className="mb-8 flex items-center gap-4">
        <div className="page-header-icon">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Assinatura</h1>
          <p className="text-zinc-500 font-medium text-sm mt-0.5">Gerencie seu plano e acesso ao sistema</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* CARD DO PLANO ATUAL */}
        <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-20"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-2">Plano Atual</p>
              <h3 className="text-4xl font-black text-white flex items-center gap-3">
                {currentPlanName}
                {isSubscribed && <CheckCircle2 className="text-green-500 w-6 h-6" />}
              </h3>
            </div>
            {isSubscribed ? (
               <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs px-3 py-1 uppercase">Ativo</Badge>
            ) : isGracePeriod ? (
               <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs px-3 py-1 uppercase">Vencido</Badge>
            ) : (
               <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs px-3 py-1 uppercase">Teste Acabando</Badge>
            )}
          </div>

          <div className="space-y-4 mb-10 relative z-10">
             <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-zinc-400">Valor Mensal</span>
                <span className="text-white font-bold text-xl">R$ 149,90</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-zinc-400">Renovação / Vencimento</span>
                <span className="text-white font-bold">
                   {subscription ? subscription.currentPeriodEnd.toLocaleDateString('pt-BR') : "14 Dias (Trial)"}
                </span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-zinc-400">ID da Fatura</span>
                <span className="text-zinc-500 font-medium text-sm">
                   {subscription?.stripeSubscriptionId || "N/A (Processando no Stripe)"}
                </span>
             </div>
          </div>

          <form action={async () => {
             'use server';
             // Placeholder para Portal do Cliente - redirecionar para checkout por enquanto ou logar erro
             console.log("Stripe Portal ainda exige CustomerId.");
          }} className="relative z-10">
            <Button disabled={!isSubscribed} type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-14 rounded-xl text-lg flex items-center justify-center gap-2">
               Acessar Portal do Cliente Stripe <ExternalLink className="w-5 h-5 opacity-50" />
            </Button>
            <p className="text-center text-xs text-zinc-500 mt-4">* Abre o Customer Portal oficial do Stripe para atualizar cartão de crédito e emitir NFe.</p>
          </form>
        </div>

        {/* UPGRADE E BENEFÍCIOS */}
        <div>
          {!isSubscribed && (
            <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-10 rounded-[2rem] shadow-[0_0_40px_rgba(249,115,22,0.15)] relative overflow-hidden mb-8 group cursor-pointer">
               <Rocket className="absolute -bottom-4 right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-3xl font-black text-white mb-2">Faça o Upgrade Hoje</h3>
               <p className="text-orange-100 font-medium mb-8">E garanta acesso ao link exclusivo da sua barbearia para que seus clientes agendem de casa.</p>
               
               <form action={createStripeCheckoutSessionAction}>
                 <Button type="submit" className="bg-white hover:bg-zinc-100 text-orange-600 font-black h-12 px-8 rounded-xl w-full sm:w-auto shadow-xl transition-transform active:scale-95">
                   Assinar Barbearia Pro
                 </Button>
               </form>
            </div>
          )}

          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2rem] p-8 shadow-2xl">
             <h4 className="text-white font-bold text-xl mb-4 border-b border-zinc-800 pb-2">O que está incluso?</h4>
             <ul className="space-y-4">
                <li className="flex items-start gap-3 text-zinc-400">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  Página de Agendamentos Pública com link customizado (Ex: seudominio.com).
                </li>
                <li className="flex items-start gap-3 text-zinc-400">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  Fechamentos Diários Automáticos, Relatórios e Cálculo Limpo de Comissões.
                </li>
                <li className="flex items-start gap-3 text-zinc-400">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  Robô de Lembretes Automáticos via WhatsApp sem custo adicional por envio.
                </li>
                <li className="flex items-start gap-3 text-zinc-400">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  Até 8 profissionais barbeiros com agendas simultâneas integradas.
                </li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
