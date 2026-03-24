"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createTenantAction } from "@/app/actions";

export function NewTenantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createTenantAction(formData);
    
    if (res?.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
    }
    setLoading(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold h-14 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" /> Cadastrar Nova Barbearia
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative animate-in zoom-in-95">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-white mb-6">Nova Barbearia</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Nome da Barbearia</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="Ex: Navalha de Ouro" 
                  className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Slug (URL)</label>
                <input 
                  type="text" 
                  name="slug" 
                  required
                  placeholder="Ex: navalha-ouro" 
                  className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold text-zinc-950 mt-4 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Criar Ambiente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
