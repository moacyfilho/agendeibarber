"use client";

import { useState } from "react";
import { X, Loader2, Edit3 } from "lucide-react";
import { updateTenantAction } from "@/app/actions";

export function EditTenantModal({ t }: { t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateTenantAction(t.id, formData);
    
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
        className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
        title="Editar Barbearia"
      >
        <Edit3 className="w-5 h-5" />
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
            <h3 className="text-2xl font-black text-white mb-6 text-center">Editar Ambiente</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block text-center">Nome da Barbearia</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={t.name}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 h-14 rounded-2xl px-6 text-white text-lg font-bold focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block text-center">Slug (Caminho da URL)</label>
                <input 
                  type="text" 
                  name="slug" 
                  defaultValue={t.slug}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 h-14 rounded-2xl px-6 text-white text-lg font-bold focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-2xl font-black text-zinc-950 mt-4 transition-all flex items-center justify-center disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
