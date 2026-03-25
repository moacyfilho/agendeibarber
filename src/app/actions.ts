'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import { getTenantId } from '@/lib/session';

// Only initialize Resend if the API key is provided.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Usa a sessão do usuário logado para obter o tenantId correto
async function getTenantContext() {
  return getTenantId();
}

export async function createTenantAction(formData: FormData) {
  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;
  const ownerName = formData.get('ownerName') as string;
  const ownerEmail = formData.get('ownerEmail') as string;
  const ownerPassword = formData.get('ownerPassword') as string;

  if (!name || !rawSlug) return { error: "Nome e Slug obrigatórios" };
  if (!ownerName || !ownerEmail || !ownerPassword) return { error: "Nome, e-mail e senha do responsável são obrigatórios" };
  if (ownerPassword.length < 6) return { error: "A senha deve ter no mínimo 6 caracteres" };

  const slug = rawSlug
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  // Verifica se e-mail já está em uso
  const existingUser = await prisma.user.findFirst({ where: { email: ownerEmail } });
  if (existingUser) return { error: "Este e-mail já está cadastrado no sistema." };

  try {
    const passwordHash = await bcrypt.hash(ownerPassword, 12);

    const tenant = await prisma.tenant.create({ data: { name, slug } });

    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: ownerName,
        email: ownerEmail,
        passwordHash,
        role: 'OWNER',
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "Erro ao criar: Este slug já está em uso ou é inválido." };
  }
}

export async function toggleTenantStatusAction(tenantId: string, currentStatus: boolean) {
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { isActive: !currentStatus }
  });
  revalidatePath('/admin');
}

export async function updateTenantAction(tenantId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;

  if (!name || !rawSlug) return { error: "Nome e Slug obrigatórios" };

  const slug = rawSlug.trim().toLowerCase().replace(/\s+/g, '-');

  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { name, slug }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "Erro ao atualizar: Slug já existe ou inválido." };
  }
}

export async function deleteTenantAction(tenantId: string) {
  try {
    await prisma.tenant.delete({
      where: { id: tenantId }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: "Erro ao excluir barbearia." };
  }
}

export async function createClienteAction(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  if (!name) return;

  const tenantId = await getTenantContext();
  await prisma.user.create({
    data: {
      name,
      phone: phone || "(Sem Fone)",
      email: `cliente_${Date.now()}@email.com`, // Email fake pra simplificar form
      role: 'CUSTOMER',
      tenantId
    }
  });

  revalidatePath('/dashboard/clientes');
}

export async function createBarbeiroAction(formData: FormData) {
  const name = formData.get('bname') as string;
  const commission = formData.get('comm') as string;
  const valPerHour = formData.get('valuePerHour') as string;
  if (!name) return;

  const commissionNum = parseInt(commission) || 50;
  const valPerHourCents = parseInt(valPerHour?.replace(/\D/g, '') || '0');
  
  const tenantId = await getTenantContext();
  
  await prisma.user.create({
    data: {
      name,
      phone: `+55 (**) ${commissionNum}% / R$ ${valPerHourCents/100} h`, 
      email: `barbeiro_${Date.now()}@email.com`,
      role: 'BARBER',
      commissionPercentage: commissionNum,
      valuePerHourInCents: valPerHourCents,
      tenantId
    }
  });

  revalidatePath('/dashboard/barbeiros');
}

export async function createServicoAction(formData: FormData) {
  const name = formData.get('sname') as string;
  const time = formData.get('stime') as string;
  const price = formData.get('sprice') as string;
  if (!name) return;

  const numTime = parseInt(time) || 30;
  // Convertemos o "R$ 50,00" limpando texto para salvar um inteiro
  const priceClean = parseInt(price?.replace(/\D/g, '') || '3000'); 

  const tenantId = await getTenantContext();
  await prisma.service.create({
    data: {
      name,
      durationMinutes: numTime,
      priceInCents: priceClean,
      isActive: true,
      tenantId
    }
  });

  revalidatePath('/dashboard/servicos');
}

export async function createAppointmentAction(data: {
  barberId: string;
  serviceId: string;
  scheduledAt: Date;
  customerName: string;
  customerPhone: string;
}) {
  const tenantId = await getTenantContext();

  // Procurar ou criar cliente baseado no telefone (ou nome)
  let customer = await prisma.user.findFirst({
    where: { phone: data.customerPhone, role: 'CUSTOMER', tenantId }
  });

  if (!customer) {
    customer = await prisma.user.create({
      data: {
        name: data.customerName || "Cliente Avulso",
        phone: data.customerPhone,
        email: `cliente_${Date.now()}@email.com`,
        role: 'CUSTOMER',
        tenantId
      }
    });
  }

  // Pegar dados do barbeiro e do tenant (assinatura)
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) throw new Error("Serviço não encontrado");

  const barber = await prisma.user.findUnique({ where: { id: data.barberId } });
  if (!barber) throw new Error("Barbeiro não encontrado");

  // 💡 Lógica Central Totalmente Dinâmica por Barbeiro:
  // Se for Assinatura, usamos o valuePerHourInCents específico do barbeiro.
  const isSubscription = true; // No app real, verificamos o perfil do cliente

  let commissionAmount = 0;
  if (isSubscription) {
    const valHour = barber.valuePerHourInCents || 0;
    commissionAmount = Math.round((valHour * service.durationMinutes) / 60);
  } else {
    const commissionPercent = barber.commissionPercentage || 50;
    commissionAmount = Math.round((service.priceInCents * commissionPercent) / 100);
  }

  const endTime = new Date(data.scheduledAt.getTime() + service.durationMinutes * 60000);

  // Criar agendamento com snapshot completo do acordo do barbeiro
  await prisma.appointment.create({
    data: {
      tenantId,
      customerId: customer.id,
      barberId: data.barberId,
      serviceId: data.serviceId,
      scheduledAt: data.scheduledAt,
      endTime,
      status: "CONFIRMED",
      paymentStatus: isSubscription ? "PAID" : "PENDING",
      totalPrice: service.priceInCents,
      isSubscriptionBased: isSubscription,
      commissionAmountInCents: commissionAmount,
      commissionPercentageAtBooking: isSubscription ? 0 : (barber.commissionPercentage || 0),
      valuePerHourAtBooking: isSubscription ? (barber.valuePerHourInCents || 0) : 0
    }
  });

  // 🚀 Disparar E-mail de Confirmação (Simulação ou Real se API Key estiver no .env)
  if (resend && process.env.RESEND_API_KEY && customer.email) {
    try {
      await resend.emails.send({
        from: 'Agendei Barber <onboarding@resend.dev>',
        to: customer.email,
        subject: '✂️ Seu Horário na Barbearia foi Confirmado!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
             <h2>Olá, ${customer.name}!</h2>
             <p>Passando para confirmar o seu agendamento:</p>
             <p><strong>Serviço:</strong> ${service.name}</p>
             <p><strong>Horário:</strong> ${data.scheduledAt.toLocaleString('pt-BR')}</p>
             <hr/>
             <p>Te esperamos lá!</p>
          </div>
        `
      });
    } catch (error) {
       console.error("Falha ao enviar e-mail", error);
    }
  }

  revalidatePath('/dashboard/agenda');
  revalidatePath('/dashboard');
}

export async function updateAppointmentStatusAction(appointmentId: string, status: string) {
  // We can also verify tenant context implicitly here, but for now we trust the appointment ID.
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status }
  });
  revalidatePath('/dashboard/atendimentos');
  revalidatePath('/dashboard');
}

export async function updateAppointmentPaymentStatusAction(appointmentId: string, paymentStatus: string) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { paymentStatus }
  });
  revalidatePath('/dashboard/atendimentos');
  revalidatePath('/dashboard/caixa');
}

export async function deleteAppointmentAction(appointmentId: string) {
  await prisma.appointment.delete({
    where: { id: appointmentId }
  });
  revalidatePath('/dashboard/atendimentos');
  revalidatePath('/dashboard');
}

export async function createBlockedTimeAction(formData: FormData) {
  const tenantId = await getTenantContext();
  const barberId = formData.get('barberId') as string;
  const dateStr = formData.get('date') as string;
  const startHourStr = formData.get('startHour') as string;
  const endHourStr = formData.get('endHour') as string;
  const reason = formData.get('reason') as string;

  if (!barberId || !dateStr || !startHourStr || !endHourStr) return;

  const [startH, startM] = startHourStr.split(':');
  const [endH, endM] = endHourStr.split(':');

  const startDate = new Date(dateStr);
  startDate.setHours(parseInt(startH), parseInt(startM), 0, 0);

  const endDate = new Date(dateStr);
  endDate.setHours(parseInt(endH), parseInt(endM), 0, 0);

  await prisma.blockedTime.create({
    data: {
      tenantId,
      barberId,
      startTime: startDate,
      endTime: endDate,
      reason
    }
  });

  revalidatePath('/dashboard/horarios');
}

export async function deleteBlockedTimeAction(blockedTimeId: string) {
  await prisma.blockedTime.delete({
    where: { id: blockedTimeId }
  });
  revalidatePath('/dashboard/horarios');
}

export async function checkCustomerByPhoneAction(phone: string, tenantId: string) {
  const customer = await prisma.user.findFirst({
    where: { phone, role: 'CUSTOMER', tenantId },
    select: { name: true, phone: true }
  });
  return customer;
}

export async function registerCustomerAction(name: string, phone: string, tenantId: string) {
  if (!name || !phone || !tenantId) return { error: 'Dados incompletos' };

  // Se já existe, apenas retorna (não duplica)
  const existing = await prisma.user.findFirst({
    where: { phone, role: 'CUSTOMER', tenantId }
  });
  if (existing) return { success: true, name: existing.name };

  await prisma.user.create({
    data: {
      name,
      phone,
      email: `cliente_${Date.now()}_${phone.replace(/\D/g, '')}@agendei.app`,
      role: 'CUSTOMER',
      tenantId,
    }
  });

  revalidatePath('/dashboard/clientes');
  return { success: true, name };
}

export async function getAvailableTimesAction(barberId: string, dateIsoString: string, durationMinutes: number) {
  const date = new Date(dateIsoString);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Busca todos os agendamentos do dia para este barbeiro
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      status: { not: "CANCELLED" },
      scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
  });

  // Busca todos os bloqueios de tempo que tocam esse dia
  const blockedTimes = await prisma.blockedTime.findMany({
    where: {
      barberId,
      OR: [
        { startTime: { gte: startOfDay, lte: endOfDay } },
        { endTime: { gte: startOfDay, lte: endOfDay } },
        { startTime: { lte: startOfDay }, endTime: { gte: endOfDay } }
      ]
    }
  });

  const availableSlots: string[] = [];
  
  // Vamos varrer o dia inteiro das 09:00 às 20:00 pulando de 30 em 30 min (exemplo de grade flexível)
  const openTime = new Date(date); openTime.setHours(9, 0, 0, 0);
  const closeTime = new Date(date); closeTime.setHours(20, 0, 0, 0);
  
  let currentSlot = new Date(openTime);

  while (currentSlot.getTime() + durationMinutes * 60000 <= closeTime.getTime()) {
    const slotStart = currentSlot.getTime();
    const slotEnd = slotStart + durationMinutes * 60000;

    // Checa sobreposição com Appointments
    const hasAppConflict = appointments.some(app => {
      const appStart = app.scheduledAt.getTime();
      const appEnd = app.endTime.getTime();
      return (slotStart < appEnd && slotEnd > appStart);
    });

    // Checa sobreposição com BlockedTimes
    const hasBlockConflict = blockedTimes.some((block: any) => {
      const blockStart = block.startTime.getTime();
      const blockEnd = block.endTime.getTime();
      return (slotStart < blockEnd && slotEnd > blockStart);
    });

    if (!hasAppConflict && !hasBlockConflict) {
      availableSlots.push(
        currentSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    }

    // Avança 30 minutos na grade (intervalo de scan). Podíamos avançar 15 min para maior flexibilidade
    currentSlot = new Date(currentSlot.getTime() + 30 * 60000);
  }

  // Remove duplicatas e formata
  return Array.from(new Set(availableSlots));
}

export async function createProductAction(formData: FormData) {
  const tenantId = await getTenantContext();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const stock = formData.get('stock') as string;
  const minStock = formData.get('minStock') as string;

  if (!name) return;

  const priceClean = parseInt(price?.replace(/\D/g, '') || '0');
  const numStock = parseInt(stock) || 0;
  const numMinStock = parseInt(minStock) || 5;

  await prisma.product.create({
    data: {
      tenantId,
      name,
      description,
      priceInCents: priceClean,
      stock: numStock,
      minStock: numMinStock,
      isActive: true
    }
  });

  revalidatePath('/dashboard/produtos');
}

export async function sellProductAction(items: { productId: string, quantity: number }[]) {
  const tenantId = await getTenantContext();
  let totalPrice = 0;

  // 1. Validar estoque e calcular total
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.quantity) {
      throw new Error(`Estoque insuficiente: ${product?.name || 'Item desconhecido'}`);
    }
    totalPrice += product.priceInCents * item.quantity;
  }

  // 2. Criar a Venda e atualizar estoques (Transaction)
  await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: {
        tenantId,
        totalPrice,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: 0 // Simplificado: podíamos buscar o preço real aqui dentro
          }))
        }
      }
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }
  });

  revalidatePath('/dashboard/produtos');
  revalidatePath('/dashboard/caixa');
  revalidatePath('/dashboard/vendas');
  revalidatePath('/dashboard');
}

export async function updateTenantSettingsAction(formData: FormData) {
  const tenantId = await getTenantContext();
  const name = formData.get('name') as string;
  
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { name }
  });

  revalidatePath('/dashboard/configuracoes');
  revalidatePath('/dashboard');
}

export async function createStripeCheckoutSessionAction() {
  // Num app real, o tenantId viria da sessão do usuário logado (ex: Auth.js)
  const tenantId = await getTenantContext();
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  
  if (!tenant) throw new Error("Tenant não encontrado");

  // Import dinâmico para evitar problemas no edge se necessário, ou direto
  const { stripe } = await import('@/lib/stripe');
  if (!stripe) throw new Error("Stripe não configurado. Defina STRIPE_SECRET_KEY no .env");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Plano Barbearia Pro - Agendei Barber',
            description: 'Acesso total ao sistema de agendamentos e relatórios.',
          },
          unit_amount: 14990, // R$ 149,90 em centavos
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinaturas?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinaturas?canceled=true`,
    metadata: {
      tenantId: tenant.id,
    },
  });

  if (!session.url) throw new Error("Falha ao criar sessão do Stripe");

  // Redireciona o usuário para o Checkout do Stripe
  const { redirect } = await import('next/navigation');
  redirect(session.url);
}
