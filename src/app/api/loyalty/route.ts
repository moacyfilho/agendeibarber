import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/loyalty?phone=XXXX&tenantId=YYYY
export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  const tenantId = req.nextUrl.searchParams.get("tenantId");

  if (!phone || !tenantId) {
    return NextResponse.json({ error: "phone e tenantId necessários" }, { status: 400 });
  }

  // Buscar o customer pelo phone
  const customer = await prisma.user.findFirst({
    where: { phone, tenantId, role: "CUSTOMER" }
  });

  if (!customer) {
    return NextResponse.json({ loyalty: null });
  }

  const card = await prisma.loyaltyCard.findUnique({
    where: { tenantId_customerId: { tenantId, customerId: customer.id } }
  });

  if (!card) {
    return NextResponse.json({ loyalty: { totalVisits: 0, rewardThreshold: 10, rewardsEarned: 0, nextRewardIn: 10 } });
  }

  const visitsUntilReward = card.rewardThreshold - (card.totalVisits % card.rewardThreshold);
  const hasRewardAvailable = card.totalVisits > 0 && (card.totalVisits % card.rewardThreshold === 0) && card.rewardsEarned < Math.floor(card.totalVisits / card.rewardThreshold);

  return NextResponse.json({
    loyalty: {
      totalVisits: card.totalVisits,
      rewardThreshold: card.rewardThreshold,
      rewardsEarned: card.rewardsEarned,
      nextRewardIn: visitsUntilReward,
      hasRewardAvailable
    }
  });
}
