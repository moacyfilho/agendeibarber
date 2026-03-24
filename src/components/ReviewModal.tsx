"use client";

import { Star, Send, X, Loader2 } from "lucide-react";
import { useState } from "react";

export function ReviewModal({ appointmentId, barberId, customerId, tenantId, barberName, serviceName }: {
  appointmentId: string;
  barberId: string;
  customerId: string;
  tenantId: string;
  barberName: string;
  serviceName: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, barberId, customerId, tenantId, rating, comment })
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      alert("Erro ao enviar avaliação.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 text-center">
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="py-10 animate-in fade-in">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <Star className="w-12 h-12 text-emerald-500 fill-emerald-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3">Obrigado! 🙏</h3>
            <p className="text-zinc-400 text-lg">Sua avaliação ajuda a melhorar nosso atendimento.</p>
            <button onClick={() => setIsOpen(false)} className="mt-8 px-8 h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-colors">Fechar</button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-3xl font-black text-white mb-2">Como foi seu corte?</h3>
              <p className="text-zinc-500 text-lg">Avalie <span className="text-orange-400 font-bold">{barberName}</span> pelo serviço de <span className="text-zinc-300 font-bold">{serviceName}</span></p>
            </div>

            {/* ESTRELAS INTERATIVAS */}
            <div className="flex justify-center gap-3 mb-8">
              {[1,2,3,4,5].map(star => (
                <button 
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-125"
                >
                  <Star 
                    className={`w-14 h-14 transition-colors ${
                      star <= (hoveredStar || rating) 
                        ? "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                        : "text-zinc-700"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <p className="text-zinc-400 mb-6 font-bold text-sm">
              {rating === 1 && "😕 Péssimo"}
              {rating === 2 && "😐 Ruim"}
              {rating === 3 && "🙂 OK"}
              {rating === 4 && "😄 Ótimo!"}
              {rating === 5 && "🤩 Perfeito!"}
            </p>

            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi a experiência (opcional)"
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white font-medium resize-none focus:outline-none focus:border-orange-500 transition-colors mb-6"
            />

            <button 
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-30 rounded-2xl text-white font-black text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><Send className="w-6 h-6" /> ENVIAR AVALIAÇÃO</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
