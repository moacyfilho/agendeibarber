'use server';

import { redirect } from 'next/navigation';
import { CreateCheckoutSessionUseCase } from '@/use-cases/billing/create-checkout-session';

/**
 * NEXT.JS SERVER ACTION
 * Camada: Interface Adapters / Controllers (Clean Architecture)
 * Responsabilidade: Fazer a ponte entre o Client Component (React) e o Use Case do Servidor (Node)
 */
export async function handleStripeCheckoutAction(formData: FormData) {
  
  // Capturando dados enviados de forma oculta pelo formulário Client-Side
  const tenantSlug = formData.get('tenantSlug') as string;
  const barberId = formData.get('barberId') as string;
  const serviceId = formData.get('serviceId') as string;
  const dateStr = formData.get('dateStr') as string;
  const customerEmail = "cliente.dummy@exemplo.com"; // Viria do Auth do usuário logado supabase

  if (!barberId || !dateStr) {
    throw new Error("Dados de agendamento incompletos");
  }

  // 1. Instanciar o Use Case (Blindando o controller da lógica complexa)
  const useCase = new CreateCheckoutSessionUseCase();

  // 2. Executar a regra de negócio
  const result = await useCase.execute({
    tenantSlug,
    barberId,
    serviceId,
    dateStr,
    customerEmail
  });

  if (!result.checkoutUrl) {
    throw new Error("Falha ao gerar o Link de Pagamento.");
  }

  // 3. Redirecionar o usuário diretamente do Servidor
  // O Next.js envia um status HTTP 303 (See Other) jogando para o portal do Stripe
  redirect(result.checkoutUrl);
}
