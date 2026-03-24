"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Scissors, UserCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// MOCK DATA Mapeando o Backend
const MOCK_SERVICES = [
  { id: "s1", name: "Corte Clássico Tesoura", duration: "45 min", price: "R$ 45,00" },
  { id: "s2", name: "Barboterapia + Toalha Quente", duration: "30 min", price: "R$ 35,00" },
  { id: "s3", name: "Corte + Barba Premium", duration: "75 min", price: "R$ 75,00" },
];

const MOCK_BARBERS = [
  { id: "b1", name: "Lucas 'Navalha'", special: "Degradê" },
  { id: "b2", name: "Felipe 'Fade'", special: "Cortes Longos" },
  { id: "b3", name: "Qualquer Profissional", special: "Horário mais rápido" },
];

const MOCK_TIMES = ["09:00", "09:45", "10:30", "11:15", "14:00", "14:45", "15:30", "16:15", "17:00"];

export function BookingCalendar({ tenantSlug }: { tenantSlug?: string; barberId?: string; serviceId?: string; }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Geração de dias limitados (Próximos 7 dias úteis)
  const availableDays = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  const handleConfirm = () => {
    alert(`AGENDADO COM SUCESSO!\n\nServiço: ${selectedService.name}\nBarbeiro: ${selectedBarber.name}\nData: ${format(selectedDate, "dd/MM")} às ${selectedTime}`);
    setStep(1); setSelectedService(null); setSelectedBarber(null); setSelectedTime(null);
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedService ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {selectedService ? <CheckCircle2 className="w-5 h-5"/> : "1"}
              </div>
              <div>
                <p className="text-white font-bold">Serviço</p>
                <p className="text-sm text-zinc-400">{selectedService ? selectedService.name : "Pendente..."}</p>
                {selectedService && <p className="text-orange-500 font-bold text-sm mt-1">{selectedService.price}</p>}
              </div>
            </div>

            {/* Step 2 Check */}
            <div className={`relative z-10 flex gap-4 ${step >= 2 ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedBarber ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {selectedBarber ? <CheckCircle2 className="w-5 h-5"/> : "2"}
              </div>
              <div>
                <p className="text-white font-bold">Profissional</p>
                <p className="text-sm text-zinc-400">{selectedBarber ? selectedBarber.name : "Pendente..."}</p>
              </div>
            </div>

            {/* Step 3 Check */}
            <div className={`relative z-10 flex gap-4 ${step >= 3 ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedTime ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-zinc-900 text-zinc-500 border border-zinc-700"}`}>
                {selectedTime ? <CheckCircle2 className="w-5 h-5"/> : "3"}
              </div>
              <div>
                <p className="text-white font-bold">Data e Hora</p>
                <p className="text-sm text-zinc-400">{selectedTime ? `${format(selectedDate, "dd/MM/yyyy")} às ${selectedTime}` : "Pendente..."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Rodapé (se tudo selecionado) */}
        {selectedTime && (
           <div className="mt-10 p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-fade-in">
             <p className="text-zinc-400 text-sm mb-1">Total a pagar no local</p>
             <p className="font-black text-3xl text-orange-500">{selectedService.price}</p>
           </div>
        )}
      </div>

      {/* COLUNA DIREITA: FLUXO DE SELEÇÃO DINÂMICA */}
      <div className="w-full md:w-2/3 p-8 lg:p-12 relative overflow-hidden">
        
        {/* PASSO 1: ESCOLHER SERVIÇO */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><Scissors className="text-orange-500" /> O que vamos fazer hoje?</h2>
            <p className="text-zinc-400 mb-8">Selecione o serviço desejado para calcularmos o tempo necessário.</p>
            
            <div className="grid gap-4">
              {MOCK_SERVICES.map(svc => (
                <button 
                  key={svc.id} 
                  onClick={() => { setSelectedService(svc); setStep(2); }}
                  className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-[#0f0f0f] hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left group"
                >
                  <div>
                    <p className="text-lg font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">{svc.name}</p>
                    <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1"><Clock className="w-4 h-4"/> Duração média: {svc.duration}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl text-white">{svc.price}</span>
                    <ChevronRight className="text-zinc-700 group-hover:text-orange-500 transition-colors w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2: ESCOLHER BARBEIRO */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(1)} className="text-orange-500 font-bold text-sm mb-6 hover:underline flex items-center gap-1">&larr; Voltar para Serviços</button>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3"><UserCheck className="text-orange-500" /> Escolha o Profissional</h2>
            <p className="text-zinc-400 mb-8">Com quem você quer cortar o cabelo hoje?</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_BARBERS.map(b => (
                <button 
                  key={b.id} 
                  onClick={() => { setSelectedBarber(b); setStep(3); }}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-800 bg-[#0f0f0f] hover:border-orange-500 hover:bg-orange-500/5 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-700 mb-4 flex items-center justify-center text-3xl font-black text-orange-500 group-hover:scale-110 transition-transform shadow-inner">
                    {b.name.charAt(0)}
                  </div>
                  <p className="text-lg font-bold text-zinc-100 group-hover:text-orange-400 transition-colors">{b.name}</p>
                  <p className="text-zinc-500 text-sm mt-1 font-medium">{b.special}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 3: DATA E HORA */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button onClick={() => setStep(2)} className="text-orange-500 font-bold text-sm mb-6 hover:underline flex items-center gap-1">&larr; Voltar para Profissionais</button>
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
            <h4 className="text-zinc-100 font-bold mb-4">Horários Livres:</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8 border-b border-zinc-900 pb-10">
              {MOCK_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl border font-bold text-lg transition-all ${selectedTime === time ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-105" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-orange-500/50 hover:text-orange-400"}`}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <button onClick={handleConfirm} className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-2xl text-white font-black text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4">
                CONFIRMAR AGENDAMENTO
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
