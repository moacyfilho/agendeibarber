"use client"

import { useState } from "react"
import { 
  Building2, 
  MapPin, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  Image as ImageIcon,
  Sparkles,
  Rocket
} from "lucide-react"
import { updateTenantSettingsAction } from "@/app/actions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function OnboardingWizard({ tenantName }: { tenantName: string }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState(tenantName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFinish = async () => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", name)
    await updateTenantSettingsAction(formData)
    setStep(3)
    setIsSubmitting(false)
    
    // Pequeno delay para efeito visual antes de recarregar ou fechar
    setTimeout(() => {
        window.location.reload()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)] flex flex-col md:flex-row">
        
        {/* BARRA LATERAL DE PROGRESSO */}
        <div className="w-full md:w-1/3 bg-zinc-950 p-10 border-r border-zinc-900 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 mb-10">
                 <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white italic">A</div>
                 <span className="font-black text-white tracking-tighter uppercase text-sm">Agendei Barber</span>
              </div>

              <div className="space-y-8 relative">
                 <div className="absolute left-4 top-2 bottom-2 w-px bg-zinc-900"></div>
                 
                 <div className={`relative z-10 flex gap-4 items-center transition-all ${step === 1 ? "opacity-100 scale-105" : "opacity-30"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 1 ? "bg-orange-500 text-white shadow-glow" : "bg-zinc-900 text-zinc-600 border border-zinc-800"}`}>1</div>
                    <span className="text-white font-bold text-sm">Identidade</span>
                 </div>

                 <div className={`relative z-10 flex gap-4 items-center transition-all ${step === 2 ? "opacity-100 scale-105" : "opacity-30"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 2 ? "bg-orange-500 text-white shadow-glow" : "bg-zinc-900 text-zinc-600 border border-zinc-800"}`}>2</div>
                    <span className="text-white font-bold text-sm">Aparência</span>
                 </div>

                 <div className={`relative z-10 flex gap-4 items-center transition-all ${step === 3 ? "opacity-100 scale-105" : "opacity-30"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= 3 ? "bg-green-500 text-white shadow-glow-green" : "bg-zinc-900 text-zinc-600 border border-zinc-800"}`}>3</div>
                    <span className="text-white font-bold text-sm">Pronto!</span>
                 </div>
              </div>
           </div>

           <div className="text-[10px] text-zinc-700 font-black uppercase tracking-widest mt-10">
              SaaS Multi-Tenant Ativo
           </div>
        </div>

        {/* CONTEÚDO DINÂMICO */}
        <div className="flex-1 p-10 md:p-14 min-h-[500px] flex flex-col">
           
           {step === 1 && (
             <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col h-full">
                <Sparkles className="text-orange-500 w-12 h-12 mb-6" />
                <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Seja bem-vindo ao futuro!</h2>
                <p className="text-zinc-500 mb-10 text-lg leading-relaxed">Primeiro, como se chama a sua barbearia? Este nome aparecerá para seus clientes.</p>
                
                <div className="space-y-4 flex-1">
                   <div className="space-y-2">
                      <Label className="text-zinc-400 font-bold ml-1">Nome Comercial</Label>
                      <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Barber Shop Matriz" 
                        className="h-16 bg-zinc-900 border-zinc-800 text-white text-xl font-bold placeholder:text-zinc-700 focus:ring-orange-500 rounded-2xl px-6"
                      />
                   </div>
                </div>

                <Button 
                   onClick={() => setStep(2)}
                   disabled={!name}
                   className="w-full h-16 bg-white hover:bg-zinc-200 text-black font-black text-lg rounded-2xl shadow-2xl active:scale-95 transition-all mt-8"
                >
                   PRÓXIMO PASSO <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
             </div>
           )}

           {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col h-full">
                <ImageIcon className="text-orange-500 w-12 h-12 mb-6" />
                <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Sua Marca</h2>
                <p className="text-zinc-500 mb-10 text-lg leading-relaxed">Adicione sua logo para que o sistema fique com a cara do seu negócio.</p>
                
                <div className="flex-1 space-y-6">
                   <div className="w-full aspect-video border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center bg-zinc-950/50 group hover:border-orange-500/50 transition-colors cursor-pointer">
                      <div className="p-4 bg-zinc-900 rounded-2xl mb-4 text-zinc-600 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all">
                         <ImageIcon />
                      </div>
                      <p className="text-sm font-bold text-zinc-500 group-hover:text-zinc-300">Clique para subir sua logo</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-zinc-700 mt-2">PNG ou SVG (Recomendado)</p>
                   </div>
                </div>

                <div className="flex gap-4 mt-8">
                   <Button variant="ghost" onClick={() => setStep(1)} className="h-16 px-8 text-zinc-500 font-bold hover:bg-zinc-900">Voltar</Button>
                   <Button 
                      onClick={handleFinish}
                      disabled={isSubmitting}
                      className="flex-1 h-16 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-950/20 active:scale-95 transition-all"
                   >
                      {isSubmitting ? "CONFIGURANDO..." : "CONCLUIR SETUP"}
                   </Button>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="animate-in zoom-in fade-in duration-700 flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-glow-green animate-bounce">
                   <CheckCircle2 className="text-white w-12 h-12" />
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Tudo Pronto!</h2>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-sm">
                   Sua instância está configurada. Estamos preparando o seu dashboard agora mesmo.
                </p>
                <div className="mt-10 flex flex-col items-center gap-2">
                   <Rocket className="w-5 h-5 text-green-500 animate-pulse" />
                   <p className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-800">Iniciando Dashboard Master</p>
                </div>
             </div>
           )}

        </div>
      </div>

      <style jsx global>{`
        .shadow-glow { box-shadow: 0 0 20px rgba(249,115,22,0.4); }
        .shadow-glow-green { box-shadow: 0 0 20px rgba(34,197,94,0.4); }
      `}</style>
    </div>
  )
}
