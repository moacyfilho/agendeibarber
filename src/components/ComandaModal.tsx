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
  Calendar,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Package,
  Scissors,
  XCircle,
  CreditCard,
  RefreshCcw
} from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { sellProductAction, updateAppointmentStatusAction, updateAppointmentPaymentStatusAction, deleteAppointmentAction } from "@/app/actions"

type ComandaItem = {
  id: string
  type: 'product' | 'service'
  name: string
  price: number
  quantity: number
}

interface ComandaModalProps {
  appointment: any
  products: any[]
  services?: any[]
  trigger: React.ReactNode
}

export function ComandaModal({ appointment, products, services = [], trigger }: ComandaModalProps) {
  const [items, setItems] = useState<ComandaItem[]>([])
  const [tab, setTab] = useState<'produtos' | 'servicos'>('produtos')
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const addItem = (item: { id: string; name: string; priceInCents: number }, type: 'product' | 'service') => {
    setItems(prev => {
      const key = `${type}-${item.id}`
      const existing = prev.find(i => i.id === key)
      if (existing) {
        return prev.map(i => i.id === key ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { id: key, type, name: item.name, price: item.priceInCents, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
         .filter(i => i.quantity > 0)
    )
  }

  const subtotalExtras = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const totalGeral = appointment.totalPrice + subtotalExtras

  const handleFinalizar = async () => {
    setIsSubmitting(true)
    try {
      // Vende apenas os produtos (desconta estoque)
      const productItems = items.filter(i => i.type === 'product')
      if (productItems.length > 0) {
        await sellProductAction(
          productItems.map(i => ({ productId: i.id.replace('product-', ''), quantity: i.quantity }))
        )
      }
      await updateAppointmentStatusAction(appointment.id, 'COMPLETED')
      await updateAppointmentPaymentStatusAction(appointment.id, 'PAID')
      setIsOpen(false)
      setItems([])
      alert("Comanda finalizada com sucesso!")
    } catch {
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
      <DialogContent className="sm:max-w-[720px] bg-[#050505] border border-zinc-900 text-white rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-zinc-950/50 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Calendar className="text-orange-500 w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tighter">Comanda do Atendimento</DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[80vh] overflow-auto">
          {/* ── LADO ESQUERDO: INFO ── */}
          <div className="p-6 space-y-5 border-r border-zinc-900">
            {/* Cliente */}
            <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0">
                {appointment.customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{appointment.customer.name}</p>
                <p className="text-zinc-500 text-xs">{appointment.customer.phone}</p>
              </div>
            </div>

            {/* Barbeiro + Hora */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Barbeiro</p>
                <p className="text-sm font-bold">{appointment.barber.name}</p>
              </div>
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Horário</p>
                <p className="text-sm font-bold text-orange-400">
                  {appointment.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Serviço principal */}
            <div className="flex justify-between items-center p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-xl">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Serviço Principal</p>
                <p className="font-bold text-zinc-200 text-sm">{appointment.service.name}</p>
                <p className="text-[10px] text-zinc-500">⏱️ {appointment.service.durationMinutes} min</p>
              </div>
              <p className="font-black text-white">{BRL.format(appointment.totalPrice / 100)}</p>
            </div>

            {/* Itens adicionados */}
            {items.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-900">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Itens Adicionados</p>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {item.type === 'product'
                        ? <Package className="w-3 h-3 text-zinc-600" />
                        : <Scissors className="w-3 h-3 text-orange-500/70" />
                      }
                      <span className="text-xs font-bold text-zinc-300 truncate max-w-[130px]">{item.quantity}× {item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeItem(item.id)} className="p-1 text-zinc-700 hover:text-red-500 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-orange-400">{BRL.format((item.price * item.quantity) / 100)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-zinc-900 space-y-2">
              <div className="flex justify-between text-zinc-500 text-xs font-bold">
                <span>Extras</span>
                <span>{BRL.format(subtotalExtras / 100)}</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm font-black text-zinc-400 uppercase tracking-tighter">Total Geral</p>
                <p className="text-2xl font-black text-orange-500 tracking-tighter">{BRL.format(totalGeral / 100)}</p>
              </div>
            </div>
          </div>

          {/* ── LADO DIREITO: ADICIONAR ── */}
          <div className="p-6 bg-zinc-950/50 flex flex-col">
            {/* Tabs */}
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-4 text-xs font-black">
              <button
                onClick={() => setTab('produtos')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  tab === 'produtos' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Package className="w-3 h-3" /> Produtos
              </button>
              <button
                onClick={() => setTab('servicos')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  tab === 'servicos' ? 'bg-orange-500/20 text-orange-300' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Scissors className="w-3 h-3" /> Serviços
              </button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1">
              {tab === 'produtos' && (
                products.length > 0 ? products.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addItem(p, 'product')}
                    className="w-full flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-zinc-600 group-hover:text-orange-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-zinc-300 truncate">{p.name}</span>
                      {p.stock <= 0 && <span className="text-[9px] text-red-500 font-black">SEM ESTOQUE</span>}
                    </div>
                    <span className="text-xs font-black text-zinc-500 flex-shrink-0 ml-2">{BRL.format(p.priceInCents / 100)}</span>
                  </button>
                )) : (
                  <p className="text-xs text-zinc-700 italic text-center py-8">Nenhum produto cadastrado</p>
                )
              )}

              {tab === 'servicos' && (
                services.length > 0 ? services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => addItem(s, 'service')}
                    className="w-full flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-zinc-600 group-hover:text-orange-400 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-zinc-300 block">{s.name}</span>
                        <span className="text-[9px] text-zinc-600">⏱️ {s.durationMinutes} min</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-zinc-500 flex-shrink-0 ml-2">{BRL.format(s.priceInCents / 100)}</span>
                  </button>
                )) : (
                  <p className="text-xs text-zinc-700 italic text-center py-8">Nenhum serviço disponível</p>
                )
              )}
            </div>

            {/* Ações */}
            <div className="pt-4 mt-4 border-t border-zinc-900 space-y-3">
              <div className="flex gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 flex-1 justify-center gap-2 cursor-default">
                  <CreditCard className="w-3 h-3" /> Cartão / Pix
                </Badge>
                <Badge className="bg-zinc-900 text-zinc-500 border-zinc-800 py-2 flex-1 justify-center cursor-default">
                  Dinheiro
                </Badge>
              </div>

              <Button
                onClick={handleFinalizar}
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-black h-12 rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                {isSubmitting ? <RefreshCcw className="animate-spin w-4 h-4" /> : <><CheckCircle2 className="mr-2 w-4 h-4" /> Finalizar Comanda</>}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 font-bold h-10 rounded-xl text-xs"
                  onClick={() => {
                    if (confirm("Cancelar este agendamento?")) {
                      updateAppointmentStatusAction(appointment.id, 'CANCELLED')
                      setIsOpen(false)
                    }
                  }}
                >
                  <XCircle className="mr-1.5 w-3.5 h-3.5" /> Cancelar
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-zinc-600 hover:text-red-600 hover:bg-red-600/10 font-bold h-10 rounded-xl text-xs"
                  onClick={() => {
                    if (confirm("Excluir permanentemente?")) {
                      deleteAppointmentAction(appointment.id)
                      setIsOpen(false)
                    }
                  }}
                >
                  <Trash2 className="mr-1.5 w-3.5 h-3.5" /> Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
