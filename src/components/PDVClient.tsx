"use client"

import { useState } from "react"
import { ShoppingCart, Package, Plus, Minus, CheckCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sellProductAction } from "@/app/actions"
import { toast } from "sonner"

interface PDVClientProps {
  products: any[]
}

export function PDVClient({ products }: PDVClientProps) {
  const [cart, setCart] = useState<{ id: string, name: string, price: number, quantity: number, stock: number }[]>([])
  const [search, setSearch] = useState("")

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { id: product.id, name: product.name, price: product.priceInCents, quantity: 1, stock: product.stock }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item).filter(item => item.quantity > 0))
  }

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) / 100

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
      await sellProductAction(items);
      setCart([])
      alert("Venda realizada com sucesso!")
    } catch (e) {
      alert("Erro ao realizar venda. Verifique o estoque.")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[70vh]">
      {/* GRID DE PRODUTOS */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
           <input 
             value={search}
             onChange={e => setSearch(e.target.value)}
             placeholder="Pesquisar produto pelo nome..." 
             className="w-full bg-[#0a0a0a] border border-zinc-900 h-16 pl-12 pr-4 rounded-[1.5rem] text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
           />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {filteredProducts.map(p => {
             const inCart = cart.find(item => item.id === p.id)?.quantity || 0;
             const isAvailable = p.stock > inCart;

             return (
               <button 
                 key={p.id}
                 disabled={!isAvailable}
                 onClick={() => addToCart(p)}
                 className={`p-6 rounded-[2rem] border transition-all text-left flex flex-col justify-between h-48 group ${!isAvailable ? 'bg-zinc-950 border-zinc-900 opacity-50 cursor-not-allowed' : 'bg-[#0a0a0a] border-zinc-900 hover:border-orange-500/50 hover:bg-zinc-900/30'}`}
               >
                  <div>
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 text-orange-500 border border-zinc-800 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                       <Package className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-white text-lg leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-zinc-500 text-sm mt-1">{p.stock} em estoque</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="font-black text-orange-500 text-xl tracking-tighter">R$ {(p.priceInCents / 100).toFixed(2).replace('.', ',')}</p>
                    {inCart > 0 && <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-lg ring-4 ring-orange-500/20">{inCart}</span>}
                  </div>
               </button>
             )
           })}
        </div>
      </div>

      {/* RESUMO DA VENDA */}
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col h-full shadow-2xl sticky top-8">
         <div className="flex items-center gap-3 mb-8 border-b border-zinc-900 pb-6">
            <ShoppingCart className="text-orange-500" />
            <h3 className="text-2xl font-black text-white">Carrinho PDV</h3>
         </div>

         <div className="flex-1 overflow-y-auto space-y-6 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                 <div className="flex-1">
                    <p className="text-white font-bold leading-none mb-1">{item.name}</p>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">R$ {(item.price / 100).toFixed(2)} / unidade</p>
                 </div>
                 <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-1.5 rounded-2xl">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 text-white hover:bg-red-500/20 hover:text-red-400 transition-all"><Minus className="w-4 h-4" /></button>
                    <span className="font-black text-white px-2">{item.quantity}</span>
                    <button onClick={() => addToCart({ id: item.id, name: item.name, priceInCents: item.price, stock: item.stock })} className="w-8 h-8 flex items-center justify-center rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg active:scale-90"><Plus className="w-4 h-4" /></button>
                 </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-600 text-center gap-4">
                 <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center grayscale opacity-20">
                    <ShoppingCart className="w-8 h-8" />
                 </div>
                 <p className="font-bold">Balcão vazio.</p>
                 <p className="text-sm">Selecione produtos ao lado para iniciar o checkout rápido.</p>
              </div>
            )}
         </div>

         <div className="mt-auto space-y-6">
            <div className="flex justify-between items-end border-t border-zinc-900 pt-8">
               <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Total a Pagar</p>
               <p className="text-5xl font-black text-white tracking-tighter">R$ {total.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed text-white font-black h-20 rounded-[1.5rem] text-xl shadow-xl shadow-green-950/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
               Finalizar Venda <CheckCircle className="w-6 h-6" />
            </button>
         </div>
      </div>
    </div>
  )
}
