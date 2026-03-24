"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  ShoppingCart, 
  User, 
  Calendar, 
  Scissors, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Package,
  XCircle,
  CreditCard,
  RefreshCcw
} from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { sellProductAction, updateAppointmentStatusAction, updateAppointmentPaymentStatusAction, deleteAppointmentAction } from "@/app/actions"

interface ComandaModalProps {
  appointment: any
  products: any[]
  trigger: React.ReactNode
}

export function ComandaModal({ appointment, products, trigger }: ComandaModalProps) {
  const [items, setItems] = useState<{ productId: string, name: string, price: number, quantity: number }[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const addToComanda = (product: any) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { productId: product.id, name: product.name, price: product.priceInCents, quantity: 1 }]
    })
  }

  const removeFromComanda = (productId: string) => {
    setItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item).filter(item => item.quantity > 0))
  }

  const subtotalProducts = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  const totalGeral = appointment.totalPrice + subtotalProducts

  const handleFinalizar = async () => {
    setIsSubmitting(true)
    try {
      // 1. Se houver produtos, realizar a venda
      if (items.length > 0) {
        const saleItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
        await sellProductAction(saleItems)
      }

      // 2. Marcar agendamento como COMPLETED e PAID
      await updateAppointmentStatusAction(appointment.id, 'COMPLETED')
      await updateAppointmentPaymentStatusAction(appointment.id, 'PAID')
      
      setIsOpen(false)
      setItems([])
      alert("Comanda finalizada com sucesso!")
    } catch (e) {
      alert("Erro ao finalizar comanda.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#050505] border border-zinc-900 text-white rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-zinc-950/50 border-b border-zinc-900">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-orange-500/10 rounded-2xl">
                <Calendar className="text-orange-500 w-6 h-6" />
             </div>
             <DialogTitle className="text-2xl font-black tracking-tighter">Detalhes do Agendamento</DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2">
           {/* LADO ESQUERDO: INFOS DO CLIENTE & SERVIÇO */}
           <div className="p-8 space-y-8 border-r border-zinc-900">
              <section className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Cliente</p>
                 <div className="flex items-center gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-xl">
                       {appointment.customer.name.charAt(0)}
                    </div>
                    <div>
                       <p className="font-bold text-white">{appointment.customer.name}</p>
                       <p className="text-zinc-500 text-xs">{appointment.customer.phone}</p>
                    </div>
                 </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                 <section className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Barbeiro</p>
                    <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                       <p className="text-sm font-bold">{appointment.barber.name}</p>
                    </div>
                 </section>
                 <section className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Horário</p>
                    <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                       <p className="text-sm font-bold text-orange-500">{appointment.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                 </section>
              </div>

              <section className="space-y-4">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Serviço Principal</p>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl">
                    <div>
                       <p className="font-bold text-zinc-200">{appointment.service.name}</p>
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">⏱️ {appointment.service.durationMinutes} min</p>
                    </div>
                    <p className="font-black text-white">{BRL.format(appointment.totalPrice / 100)}</p>
                 </div>
              </section>

              <div className="pt-4 space-y-3">
                 <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>{BRL.format((appointment.totalPrice + subtotalProducts) / 100)}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <p className="text-lg font-black text-white uppercase tracking-tighter">Valor Total:</p>
                    <p className="text-3xl font-black text-orange-500 tracking-tighter">{BRL.format(totalGeral / 100)}</p>
                 </div>
              </div>
           </div>

           {/* LADO DIREITO: ADICIONAR PRODUTOS (COMANDA DINÂMICA) */}
           <div className="p-8 bg-zinc-950/50 flex flex-col h-full">
              <section className="flex-1 space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                    <Plus className="w-3 h-3" /> Adicionar à Comanda
                 </p>
                 
                 {/* LISTA RÁPIDA DE PRODUTOS */}
                 <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => addToComanda(p)}
                        className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50 transition-all text-left group"
                      >
                         <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-zinc-600 group-hover:text-orange-500" />
                            <span className="text-xs font-bold text-zinc-300">{p.name}</span>
                         </div>
                         <span className="text-xs font-black text-zinc-500">{BRL.format(p.priceInCents / 100)}</span>
                      </button>
                    ))}
                 </div>

                 {/* ITENS ADICIONADOS */}
                 <div className="pt-6 border-t border-zinc-900 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Itens Adicionados</p>
                    <div className="space-y-3">
                       {items.map(item => (
                         <div key={item.productId} className="flex justify-between items-center group">
                            <span className="text-xs font-bold text-white line-clamp-1 flex-1">{item.quantity}x {item.name}</span>
                            <div className="flex items-center gap-2">
                               <button onClick={() => removeFromComanda(item.productId)} className="p-1 hover:text-red-500 text-zinc-700 transition-colors"><Minus className="w-4 h-4" /></button>
                               <span className="text-xs font-black text-orange-500">{BRL.format((item.price * item.quantity) / 100)}</span>
                            </div>
                         </div>
                       ))}
                       {items.length === 0 && <p className="text-[10px] text-zinc-700 italic">Nenhum produto extra...</p>}
                    </div>
                 </div>
              </section>

              {/* AÇÕES DE RODAPÉ */}
              <div className="pt-8 grid grid-cols-2 gap-3 mt-auto">
                 <div className="col-span-2 flex gap-2 mb-4">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 flex-1 justify-center gap-2">
                       <CreditCard className="w-3 h-3" /> Cartão / Pix
                    </Badge>
                    <Badge className="bg-zinc-900 text-zinc-500 border-zinc-800 py-2 flex-1 justify-center">
                       Dinheiro
                    </Badge>
                 </div>
                 
                 <Button 
                   onClick={handleFinalizar}
                   disabled={isSubmitting}
                   className="col-span-2 bg-green-500 hover:bg-green-600 text-white font-black h-16 rounded-2xl shadow-xl shadow-green-950/20 active:scale-95 transition-all text-md"
                 >
                    {isSubmitting ? <RefreshCcw className="animate-spin" /> : <><CheckCircle2 className="mr-2" /> Finalizar Comanda</>}
                 </Button>

                 <Button 
                   variant="ghost" 
                   className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 font-bold col-span-1 h-12 rounded-xl"
                   onClick={() => {
                     if(confirm("Deseja cancelar este agendamento?")) {
                       updateAppointmentStatusAction(appointment.id, 'CANCELLED')
                       setIsOpen(false)
                     }
                   }}
                 >
                    <XCircle className="mr-2 w-4 h-4" /> Cancelar
                 </Button>

                 <Button 
                   variant="ghost" 
                   className="text-zinc-600 hover:text-red-600 hover:bg-red-600/10 font-bold col-span-1 h-12 rounded-xl"
                   onClick={() => {
                     if(confirm("Deletar agendamento permanentemente?")) {
                       deleteAppointmentAction(appointment.id)
                       setIsOpen(false)
                     }
                   }}
                 >
                    <Trash2 className="mr-2 w-4 h-4" /> Excluir
                 </Button>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
