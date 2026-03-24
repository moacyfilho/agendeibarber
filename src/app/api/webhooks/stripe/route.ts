import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    // Na produção, você validaria a assinatura HMAC do Stripe.
    // event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    event = JSON.parse(body); // FAKE PARSING
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 1. Pagamento Mensal Aprovado
  if (event.type === 'invoice.payment_succeeded') {
    const subscriptionId = event.data.object.subscription;
    console.log(`✅ [WEBHOOK] Assinatura renovada: ${subscriptionId}. Reativando painel.`);
    // await renovarAssinaturaUseCase.execute({ subscriptionId });
  }

  // 2. Falha de Pagamento - Aplica Carência (Soft Lock)
  if (event.type === 'invoice.payment_failed') {
    const subscriptionId = event.data.object.subscription;
    console.log(`❌ [WEBHOOK] Falha ao capturar pagamento: ${subscriptionId}. Entrando nos 3 dias de grace_period.`);
    // await setAssinaturaAtrasadaUseCase.execute({ subscriptionId, diasCarencia: 3 });
  }

  // 3. Sucesso na Venda do Agendamento pelo Cliente Final (Checkout)
  if (event.type === 'checkout.session.completed') {
    const barberId = event.data.object.metadata.barberId;
    console.log(`✂️ [WEBHOOK] Cliente pagou o agendamento pro barbeiro ${barberId}. Modificando status para 'CONFIRMED'.`);
    // await confirmarPagamentoAgendamentoUseCase.execute({ sessionId: event.data.object.id });
  }

  return NextResponse.json({ received: true });
}
