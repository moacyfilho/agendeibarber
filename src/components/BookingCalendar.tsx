"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Scissors, UserCheck, CheckCircle2, ChevronRight, Loader2, Phone } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createAppointmentAction, getAvailableTimesAction, checkCustomerByPhoneAction } from "@/app/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AddToCalendarButton } from "./AddToCalendarButton";
import { LoyaltyBanner } from "./LoyaltyBanner";

export function BookingCalendar({ 
  services, 
  barbers, 
  prefilledCustomer 
}: { 
  services: any[]; 
  barbers: any[]; 
  prefilledCustomer?: { name: string, phone: string } | null 
}) {
  const [step, setStep] = useState(1); // 1: Identificação, 2: Serviço, 3: Barber, 4: Data/Hora
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerStep, setCustomerStep] = useState<"PHONE" | "VERIFYING" | "NAME" | "READY">("PHONE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Geração de dias limitados (Próximos 7 dias úteis)
  const availableDays = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  // Auto-fill se o cliente vier do Step 0 (Popup)
  useEffect(() => {
    if (prefilledCustomer) {
      setCustomerName(prefilledCustomer.name || "");
      setCustomerPhone(prefilledCustomer.phone || "");
      setCustomerStep("READY");
      setStep(2); // Pula o passo 1
    }
  }, [prefilledCustomer]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
  };

  // Efeito para buscar horários reais do banco no Passo 4
  useEffect(() => {
    if (step === 4 && selectedBarber && selectedService && selectedDate) {
      setIsLoadingTimes(true);
      setSelectedTime(null);
      getAvailableTimesAction(selectedBarber.id, selectedDate.toISOString(), selectedService.durationMinutes)
        .then(times => {
          setAvailableTimes(times);
          setIsLoadingTimes(false);
        })
        .catch(err => {
          console.error(err);
          setAvailableTimes([]);
          setIsLoadingTimes(false);
        });
    }
  }, [selectedBarber, selectedService, selectedDate, step]);

  const handlePhoneSubmit = async () => {
    if (!customerPhone) return;
    setCustomerStep("VERIFYING");
    try {
      // Como estamos no step 1, selectedBarber não existe ainda.
      // Precisamos pegar o tenantId dos serviços ou barbers recebidos.
      const tenantId = barbers[0]?.tenantId || services[0]?.tenantId;
      if (!tenantId) throw new Error("Tenant não encontrado");
      
      const existing = await checkCustomerByPhoneAction(customerPhone, tenantId);
      if (existing) {
        setCustomerName(existing.name);
        setCustomerStep("READY");
        // Auto avança após 1 seg se quiser, ou deixa o user clicar "Continuar"
      } else {
        setCustomerName("");
        setCustomerStep("NAME");
      }
    } catch (err) {
      console.error(err);
      setCustomerStep("NAME");
    }
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedBarber || !selectedTime || !customerPhone || !customerName) return;
    
    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(':');
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await createAppointmentAction({
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        scheduledAt,
        customerName,
        customerPhone,
      });

      setBookingSuccess(true);
      setStep(5); // Passo de sucesso
    } catch (err) {
      alert("Erro ao agendar! Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
      
      {/* COLUNA ESQUERDA: BARRA DE PROGRESSO & RESUMO */}
      <div className="w-full md:w-1/3 bg-zinc-950 p-8 border-r border-zinc-900 border-b md:border-b-0 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Seu Agendamento</h3>
          
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-zinc-800 z-0"></div>

            {/* Step 1 Check */}
            <div className={`relative z-10 flex gap-4 ${step >= 1 ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${(customerName && customerPhone) ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {(customerName && customerPhone) ? <CheckCircle2 className="w-5 h-5"/> : "1"}
              </div>
              <div>
                <p className="text-white font-bold">Identificação</p>
                <p className="text-sm text-zinc-400">{(customerName) ? customerName : "Pendente..."}</p>
              </div>
            </div>

            {/* Step 2 Check */}
            <div className={`relative z-10 flex gap-4 ${step >= 2 ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedService ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {selectedService ? <CheckCircle2 className="w-5 h-5"/> : "2"}
              </div>
              <div>
                <p className="text-white font-bold">Serviço</p>
                <p className="text-sm text-zinc-400">{selectedService ? selectedService.name : "Pendente..."}</p>
                {selectedService && <p className="text-orange-500 font-bold text-sm mt-1">{formatPrice(selectedService.priceInCents)}</p>}
              </div>
            </div>

            {/* Step 3 Check */}
            <div className={`relative z-10 flex gap-4 ${step >= 3 ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedBarber ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {selectedBarber ? <CheckCircle2 className="w-5 h-5"/> : "3"}
              </div>
              <div>
                <p className="text-white font-bold">Profissional</p>
                <p className="text-sm text-zinc-400">{selectedBarber ? selectedBarber.name : "Pendente..."}</p>
              </div>
            </div>

            {/* Step 4 Check */}
            <div className={`relative z-10 flex gap-4 ${step >= 4 ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedTime ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {selectedTime ? <CheckCircle2 className="w-5 h-5"/> : "4"}
              </div>
              <div>
                <p className="text-white font-bold">Data e Hora</p>
                <p className="text-sm text-zinc-400">{selectedTime ? `${format(selectedDate, "dd/MM/yyyy")} às ${selectedTime}` : "Pendente..."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Rodapé (se tudo selecionado) */}
        {selectedTime && selectedService && (
           <div className="mt-10 p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-fade-in">
             <p className="text-zinc-400 text-sm mb-1">Total a pagar no local</p>
             <p className="font-black text-3xl text-orange-500">{formatPrice(selectedService.priceInCents)}</p>
           </div>
        )}
      </div>

      {/* COLUNA DIREITA: FLUXO DE SELEÇÃO DINÂMICA */}
      <div className="w-full md:w-2/3 p-8 lg:p-12 relative overflow-hidden">
        
        {/* PASSO 1: IDENTIFICAÇÃO (MUDOU PARA CÁ) */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Phone className="text-orange-500" /> Identificação</h2>
            <p className="text-zinc-400 mb-8">Antes de começar, informe seu número para agilizarmos.</p>
            
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 mb-6 flex flex-col gap-4">
              
              {customerStep === "PHONE" && (
                <div className="animate-in fade-in">
                  <Label className="text-zinc-400">Qual o seu Telefone / Whatsapp?</Label>
                  <Input 
                    placeholder="(11) 98888-7777" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 mt-1 h-12 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500"
                  />
                  <button 
                    onClick={handlePhoneSubmit}
                    disabled={!customerPhone}
                    className="mt-4 w-full h-12 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    Verificar Cadastro
                  </button>
                </div>
              )}

              {customerStep === "VERIFYING" && (
                <div className="py-6 flex flex-col items-center justify-center text-zinc-400">
                   <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                   <p>Verificando cadastro...</p>
                </div>
              )}

              {(customerStep === "NAME" || customerStep === "READY") && (
                <div className="animate-in fade-in space-y-4">
                  {customerStep === "READY" && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-4">
                       <p className="text-green-500 font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Bem-vindo de volta!</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-zinc-400">{customerStep === "NAME" ? "Como podemos te chamar?" : "Seu Nome"}</Label>
                    <Input 
                      placeholder="Ex: Carlos Oliveira" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={customerStep === "READY"}
                      className="bg-zinc-950 border-zinc-800 mt-1 h-12 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-400">Telefone</Label>
                    <div className="relative">
                      <Input 
                        value={customerPhone}
                        disabled
                        className="bg-zinc-950 border-zinc-800 mt-1 h-12 text-white disabled:opacity-50"
                      />
                      <button onClick={() => setCustomerStep("PHONE")} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-xs font-bold hover:underline">Alterar</button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!customerName}
                    className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 rounded-2xl text-white font-black text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
                  >
                    ESCOLHER SERVIÇO &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASSO 2: ESCOLHER SERVIÇO */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(1)} className="text-orange-500 font-bold text-sm mb-6 hover:underline flex items-center gap-1">&larr; Voltar para Identificação</button>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Scissors className="text-orange-500" /> O que vamos fazer hoje?</h2>
            <p className="text-zinc-400 mb-8">Selecione o serviço desejado para calcularmos o tempo necessário.</p>
            
            <div className="grid gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {services.map(svc => (
                <button 
                  key={svc.id} 
                  onClick={() => { setSelectedService(svc); setStep(3); }}
                  className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-[#0f0f0f] hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left group"
                >
                  <div>
                    <p className="text-lg font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">{svc.name}</p>
                    <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1"><Clock className="w-4 h-4"/> Duração média: {svc.durationMinutes} min</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl text-white">{formatPrice(svc.priceInCents)}</span>
                    <ChevronRight className="text-zinc-700 group-hover:text-orange-500 transition-colors w-6 h-6" />
                  </div>
                </button>
              ))}
              {services.length === 0 && (
                <p className="text-zinc-500 text-center py-4">Nenhum serviço cadastrado.</p>
              )}
            </div>
          </div>
        )}

        {/* PASSO 3: ESCOLHER BARBEIRO */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(2)} className="text-orange-500 font-bold text-sm mb-6 hover:underline flex items-center gap-1">&larr; Voltar para Serviços</button>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><UserCheck className="text-orange-500" /> Escolha o Profissional</h2>
            <p className="text-zinc-400 mb-8">Com quem você quer cortar o cabelo hoje?</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {barbers.map(b => (
                <button 
                  key={b.id} 
                  onClick={() => { setSelectedBarber(b); setStep(4); }}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-800 bg-[#0f0f0f] hover:border-orange-500 hover:bg-orange-500/5 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-700 mb-4 flex items-center justify-center text-3xl font-black text-orange-500 group-hover:scale-110 transition-transform shadow-inner">
                    {b.name.charAt(0)}
                  </div>
                  <p className="text-lg font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">{b.name}</p>
                  <p className="text-zinc-500 text-sm mt-1 font-medium overflow-hidden text-ellipsis whitespace-nowrap w-40 text-center">{b.phone}</p>
                </button>
              ))}
              {barbers.length === 0 && (
                <p className="text-zinc-500 text-center py-4 sm:col-span-2">Nenhum barbeiro cadastrado.</p>
              )}
            </div>
          </div>
        )}

        {/* PASSO 4: DATA E HORA */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(3)} className="text-orange-500 font-bold text-sm mb-6 hover:underline flex items-center gap-1">&larr; Voltar para Profissionais</button>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><CalendarIcon className="text-orange-500" /> Defina Data e Hora</h2>
            <p className="text-zinc-400 mb-8">Listando os horários disponíveis de <strong>{selectedBarber?.name}</strong>.</p>
            
            {/* Carousel Datas */}
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar mb-6">
              {availableDays.map((date, i) => {
                const isSelected = selectedDate.getDate() === date.getDate();
                return (
                  <button 
                    key={i} 
                    onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                    className={`flex flex-col items-center justify-center min-w-[80px] h-[90px] rounded-2xl border transition-all flex-shrink-0 ${isSelected ? "border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)] text-orange-400" : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900"}`}
                  >
                    <span className="text-xs uppercase font-black tracking-widest">{format(date, "EE", { locale: ptBR })}</span>
                    <span className={`text-3xl font-black ${isSelected ? "text-orange-500" : "text-white"} mt-1`}>{format(date, "dd")}</span>
                  </button>
                )
              })}
            </div>

            {/* Grid Horários */}
            <h4 className="text-zinc-100 font-bold mb-4 flex items-center gap-2">
               Horários Livres:
               {isLoadingTimes && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
            </h4>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8 pb-10">
              {isLoadingTimes ? (
                 <div className="col-span-4 py-8 text-center text-zinc-500">Buscando disponibilidade na agenda do barbeiro...</div>
              ) : availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl border font-bold text-lg transition-all ${selectedTime === time ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-105" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-orange-500/50 hover:text-orange-400"}`}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <div className="col-span-4 py-8 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                   Nenhum horário livre ou compatível encontrado nesta data.
                </div>
              )}
            </div>

            {selectedTime && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-zinc-900 pt-8 mt-2">
                <button 
                  onClick={handleConfirm} 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-black text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin w-6 h-6" /> PROCESSANDO...</> : "CONFIRMAR AGENDAMENTO"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* PASSO 5: SUCESSO! */}
        {step === 5 && bookingSuccess && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-6 text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Agendado! ✂️</h2>
            <p className="text-zinc-400 text-lg mb-6">Seu horário está confirmado.</p>

            <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Serviço</span>
                <span className="text-white font-bold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Profissional</span>
                <span className="text-white font-bold">{selectedBarber?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Data</span>
                <span className="text-white font-bold">{format(selectedDate, "dd/MM/yyyy")} às {selectedTime}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-3">
                <span className="text-zinc-500 font-bold">Valor</span>
                <span className="text-orange-500 font-black text-xl">{selectedService ? formatPrice(selectedService.priceInCents) : ''}</span>
              </div>
            </div>

            {/* SINCRONIZAR COM AGENDA */}
            {selectedTime && selectedService && selectedBarber && (
              <div className="w-full mb-4">
                <p className="text-zinc-500 text-sm font-bold mb-2 uppercase tracking-widest">Salvar na sua agenda</p>
                <AddToCalendarButton 
                  serviceName={selectedService.name}
                  barberName={selectedBarber.name}
                  date={selectedDate.toISOString()}
                  time={selectedTime}
                  durationMinutes={selectedService.durationMinutes}
                />
              </div>
            )}

            {/* CARTÃO FIDELIDADE */}
            {customerPhone && (
              <div className="w-full mt-2">
                <LoyaltyBanner phone={customerPhone} tenantId={barbers[0]?.tenantId || services[0]?.tenantId} />
              </div>
            )}

            <button 
              onClick={() => {
                setStep(2);
                setSelectedService(null);
                setSelectedBarber(null);
                setSelectedTime(null);
                setBookingSuccess(false);
              }}
              className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all mt-4"
            >
              Fazer Novo Agendamento
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
