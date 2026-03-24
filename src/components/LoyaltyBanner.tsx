"use client";

import { useState, useEffect } from "react";
import { Gift, Star, Stamp, Trophy } from "lucide-react";

export function LoyaltyBanner({ phone, tenantId }: { phone: string, tenantId: string }) {
  const [loyalty, setLoyalty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone || !tenantId) return;
    fetch(`/api/loyalty?phone=${encodeURIComponent(phone)}&tenantId=${tenantId}`)
      .then(r => r.json())
      .then(data => { setLoyalty(data.loyalty); setLoading(false); })
      .catch(() => setLoading(false));
  }, [phone, tenantId]);

  if (loading || !loyalty || loyalty.totalVisits === 0) return null;

  const progress = ((loyalty.totalVisits % loyalty.rewardThreshold) / loyalty.rewardThreshold) * 100;
  const stamps = loyalty.totalVisits % loyalty.rewardThreshold;

  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-white font-black">Cartão Fidelidade</p>
            <p className="text-zinc-400 text-sm">{loyalty.totalVisits} visitas no total</p>
          </div>
        </div>
        {loyalty.hasRewardAvailable && (
          <div className="bg-emerald-500 text-zinc-950 font-black px-4 py-2 rounded-xl text-sm animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            🎁 CORTE GRÁTIS!
          </div>
        )}
      </div>

      {/* SELOS VISUAIS */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: loyalty.rewardThreshold }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-8 rounded-lg flex items-center justify-center transition-all ${
              i < stamps 
                ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" 
                : "bg-zinc-800 border border-zinc-700"
            }`}
          >
            {i < stamps ? (
              <Star className="w-4 h-4 text-white fill-white" />
            ) : (
              <Stamp className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </div>
        ))}
      </div>

      {/* BARRA DE PROGRESSO */}
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-zinc-500 text-xs mt-2 text-center font-bold">
        {loyalty.hasRewardAvailable 
          ? "🎉 Você completou! Apresente na barbearia para resgatar." 
          : `Faltam ${loyalty.nextRewardIn} visitas para o próximo corte grátis!`
        }
      </p>
    </div>
  );
}
