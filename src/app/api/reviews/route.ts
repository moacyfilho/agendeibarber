import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, barberId, customerId, tenantId, rating, comment } = body;

    if (!appointmentId || !barberId || !customerId || !tenantId || !rating) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Verificar se já existe review para este appointment
    const existing = await prisma.review.findUnique({ where: { appointmentId } });
    if (existing) {
      return NextResponse.json({ error: "Já avaliado" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        tenantId,
        appointmentId,
        barberId,
        customerId,
        rating: Number(rating),
        comment: comment || null,
      }
    });

    // Atualizar cartão fidelidade (incrementar visita)
    await prisma.loyaltyCard.upsert({
      where: { tenantId_customerId: { tenantId, customerId } },
      create: {
        tenantId,
        customerId,
        totalVisits: 1,
        lastVisitAt: new Date(),
      },
      update: {
        totalVisits: { increment: 1 },
        lastVisitAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Erro ao criar review:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
