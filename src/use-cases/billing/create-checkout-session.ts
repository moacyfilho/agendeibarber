/**
 * USE CASE: Create Checkout Session
 * Camada: Application Business Rules (Clean Architecture)
 * Responsabilidade: Orquestrar a criação do link de pagamento no Stripe
 * sem depender diretamente das requisições web do Next.js.
 */

interface CreateCheckoutInput {
  tenantSlug: string;
  barberId: string;
  serviceId: string;
  dateStr: string;
  customerEmail: string;
}

export class CreateCheckoutSessionUseCase {
  
  // Dependências seriam injetadas aqui (Inversion of Control)
  // constructor(private readonly stripeService: IStripeService, private readonly db: IAppointmentRepository) {}

  async execute(input: CreateCheckoutInput) {
    console.log(`[USE CASE] Iniciando fechamento de pagamento para o tenant: ${input.tenantSlug}`);
    
    // 1. Busca os detalhes do Serviço e Preço no Banco Real (Mockado Aqui)
    // const service = await this.db.getServiceById(input.serviceId);
    const mockPriceInCents = 4500; // R$ 45,00
    const mockServiceName = "Corte Degradê na Tesoura";

    // 2. Valida se o horário ainda está livre (Pessimistic Lock - Skill Modelagem de Horários)
    // await this.db.lockSlot(input.barberId, input.dateStr);

    // 3. Cria a sessão do Stripe (API Externa)
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      customer_email: input.customerEmail,
      client_reference_id: `TENANT_${input.tenantSlug}`,
      metadata: {
        barberId: input.barberId,
        date: input.dateStr,
        serviceId: input.serviceId
      },
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: mockServiceName },
          unit_amount: mockPriceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://${input.tenantSlug}.barbearia.com.br/success`,
      cancel_url: `https://${input.tenantSlug}.barbearia.com.br/booking`,
    });
    */

    return {
      checkoutUrl: `https://checkout.stripe.com/pay/cs_test_mock_${Date.now()}`,
      status: 'pending_payment'
    };
  }
}
