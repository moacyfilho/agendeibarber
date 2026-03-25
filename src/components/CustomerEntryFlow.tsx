"use client";

import { useState, useEffect } from "react";
import { Phone, Scissors, Loader2, CheckCircle2, User, ArrowRight } from "lucide-react";
import { checkCustomerByPhoneAction, registerCustomerAction } from "@/app/actions";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerEntryFlow({ barbers, services, tenantId, tenantName }: { barbers: any[], services: any[], tenantId: string, tenantName: string }) {
  const [showModal, setShowModal] = useState(true);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerStep, setCustomerStep] = useState<"PHONE" | "VERIFYING" | "NAME" | "READY">("PHONE");
  const [identifiedCustomer, setIdentifiedCustomer] = useState<{ name: string, phone: string } | null>(null);

  const handlePhoneSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!customerPhone || customerPhone.length < 8) return;
    
    setCustomerStep("VERIFYING");
    try {
      const existing = await checkCustomerByPhoneAction(customerPhone, tenantId);
      if (existing) {
        setCustomerName(existing.name);
        setCustomerStep("READY");
      } else {
        setCustomerName("");
        setCustomerStep("NAME");
      }
    } catch (err) {
      setCustomerStep("NAME");
    }
  };

  const handleFinishIdentification = async () => {
    if (!customerName || !customerPhone) return;
    // Salva no banco se for cliente novo (se já existir, a action ignora silenciosamente)
    await registerCustomerAction(customerName, customerPhone, tenantId);
    setIdentifiedCustomer({ name: customerName, phone: customerPhone });
    setShowModal(false);
  };

  return (
    <>
      {/* MODAL DE ENTRADA (POPUP) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in transition-all">
          <div className="bg-zinc-950 border border-zinc-800 p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-xl relative animate-in zoom-in-95 duration-500">
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                <Phone className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">Identificação</h2>
              <p className="text-zinc-500 text-lg font-medium">Sua primeira vez aqui ou já é de casa?</p>
            </div>

            <div className="space-y-6">
              {customerStep === "PHONE" && (
                <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-3">
                    <Label className="text-zinc-400 font-bold ml-1 uppercase tracking-widest text-xs">Seu Telefone / Whatsapp</Label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                       <Input 
                        placeholder="(11) 98888-7777" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 h-16 pl-14 rounded-2xl text-white text-xl font-bold focus:ring-2 focus:ring-orange-500/50 transition-all"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={customerPhone.length < 8}
                    className="w-full h-16 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    IDENTIFICAR AGORA <ArrowRight className="w-6 h-6" />
                  </button>
                </form>
              )}

              {customerStep === "VERIFYING" && (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-400 animate-in fade-in">
                   <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                   <p className="text-lg font-bold">Consultando base de dados...</p>
                </div>
              )}

              {(customerStep === "NAME" || customerStep === "READY") && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  {customerStep === "READY" ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                       <p className="text-emerald-500 font-black text-xl flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-8 h-8"/> Bem-vindo de volta!
                       </p>
                       <p className="text-zinc-400 font-medium mt-1">Identificamos sua conta: <span className="text-white font-bold">{customerName}</span></p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label className="text-zinc-400 font-bold ml-1 uppercase tracking-widest text-xs">Não te encontramos. Qual seu nome completo?</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                        <Input 
                          placeholder="Ex: Carlos Oliveira" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 h-16 pl-14 rounded-2xl text-white text-xl font-bold focus:ring-2 focus:ring-orange-500/50 transition-all"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleFinishIdentification}
                    disabled={!customerName}
                    className="w-full h-16 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-3"
                  >
                    CONTINUAR PARA AGENDA <ArrowRight className="w-6 h-6" />
                  </button>
                  
                  <button 
                    onClick={() => setCustomerStep("PHONE")}
                    className="w-full text-zinc-600 font-bold hover:text-zinc-400 transition-colors text-sm uppercase tracking-widest"
                  >
                    Digitar outro número
                  </button>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-900 text-center">
               <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Segurança garantida por Agendei Barber</p>
            </div>
          </div>
        </div>
      )}

      {/* CALENDARIO (SÓ APARECE / FICA ATIVO APÓS IDENTIFICAR) */}
      <div className={showModal ? "blur-md pointer-events-none grayscale" : "animate-in zoom-in-95 duration-700"}>
        <BookingCalendar 
          services={services} 
          barbers={barbers} 
          prefilledCustomer={identifiedCustomer} 
        />
      </div>
    </>
  );
}
