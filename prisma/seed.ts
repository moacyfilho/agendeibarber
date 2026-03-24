import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpando banco de dados para carga real...')
  await prisma.appointment.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.service.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tenant.deleteMany()

  // 1. Criar Tenants (Unidades Reais)
  const tenants = [
    { name: 'Agendei Barber - Matriz', slug: 'agendamento' },
    { name: 'Navalha de Ouro - Unidade Centro', slug: 'navalha-ouro' },
    { name: 'Old School Barber Co.', slug: 'old-school' },
    { name: 'Barbearia do João', slug: 'barbearia-joao' },
  ]

  const createdTenants = []
  for (const t of tenants) {
    const tenant = await prisma.tenant.create({ data: t })
    createdTenants.push(tenant)
  }

  const matId = createdTenants[0].id
  const navId = createdTenants[1].id

  // 2. Barbeiros Reais (com comissões configuradas)
  const barbersData = [
    { name: 'Eduardo Rocha', email: 'eduardo@agendeibarber.com', comm: 45, valH: 6000, tenantId: matId },
    { name: 'Jhon Silva', email: 'jhon@agendeibarber.com', comm: 50, valH: 8000, tenantId: matId },
    { name: 'Mestre Navalha', email: 'contato@navalhaouro.com', comm: 60, valH: 10000, tenantId: navId },
    { name: 'Carlos "The Barber"', email: 'carlos@navalhaouro.com', comm: 40, valH: 5000, tenantId: navId },
  ]

  const createdBarbers = []
  for (const b of barbersData) {
    const barber = await prisma.user.create({
      data: {
        name: b.name,
        email: b.email,
        role: 'BARBER',
        phone: '+55 (11) 9' + Math.floor(10000000 + Math.random() * 90000000),
        commissionPercentage: b.comm,
        valuePerHourInCents: b.valH,
        tenantId: b.tenantId
      }
    })
    createdBarbers.push(barber)
  }

  // 3. Serviços Reais (Preços de Mercado)
  const servicesData = [
    { name: 'Corte Degradê Premium', price: 6000, dur: 45, tenantId: matId },
    { name: 'Barba Terapia com Toalha Quente', price: 4500, dur: 30, tenantId: matId },
    { name: 'Combo Completo (Corte + Barba + Sobrancelha)', price: 9500, dur: 75, tenantId: matId },
    { name: 'Corte Navalhado', price: 7500, dur: 60, tenantId: navId },
    { name: 'Selagem Térmica Masculina', price: 12000, dur: 90, tenantId: navId },
  ]

  for (const s of servicesData) {
    await prisma.service.create({
      data: {
        name: s.name,
        priceInCents: s.price,
        durationMinutes: s.dur,
        tenantId: s.tenantId,
        isActive: true
      }
    })
  }

  // 4. Clientes Reais
  const customers = [
    { name: 'Ricardo Oliveira', email: 'ricardo@cliente.com' },
    { name: 'Felipe Santos', email: 'felipe@cliente.com' },
    { name: 'André Lima', email: 'andre@cliente.com' },
  ]

  const createdCustomers = []
  for (const c of customers) {
    const customer = await prisma.user.create({
      data: {
        ...c,
        role: 'CUSTOMER',
        tenantId: matId,
        phone: '+55 (11) 99999-8888'
      }
    })
    createdCustomers.push(customer)
  }

  // 5. Agendamentos em Tempo Real (Hoje)
  const today = new Date()
  today.setHours(10, 0, 0, 0)

  await prisma.appointment.create({
    data: {
      tenantId: matId,
      customerId: createdCustomers[0].id,
      barberId: createdBarbers[0].id,
      serviceId: (await prisma.service.findFirst({ where: { tenantId: matId } }))!.id,
      scheduledAt: today,
      endTime: new Date(today.getTime() + 45 * 60000),
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      totalPrice: 6000,
      isSubscriptionBased: false,
      commissionAmountInCents: 2700, // 45% de 6000
    }
  })

  today.setHours(11, 30, 0, 0)
  await prisma.appointment.create({
    data: {
      tenantId: matId,
      customerId: createdCustomers[1].id,
      barberId: createdBarbers[1].id,
      serviceId: (await prisma.service.findFirst({ where: { name: { contains: 'Barba' }, tenantId: matId } }))!.id,
      scheduledAt: today,
      endTime: new Date(today.getTime() + 30 * 60000),
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      totalPrice: 4500,
      isSubscriptionBased: true,
      commissionAmountInCents: 4000, // 8000/h * 0.5h
      valuePerHourAtBooking: 8000
    }
  })

  // 6. Assinaturas Ativas
  for (const tenant of createdTenants) {
    await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        status: 'ACTIVE',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        gracePeriodEnd: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      }
    })
  }

  console.log('🚀 BASE DE DADOS REAL POPULADA COM SUCESSO!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
