"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Edit3, Building2, Globe } from "lucide-react";
import { updateTenantAction } from "@/app/actions";

export function EditTenantModal({ t }: { t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
        className="w-9 h-9 rounded-lg bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all"
        title="Editar Barbearia"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsOpen(false)}>
          <div
            className="bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-zinc-600 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-emerald-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Editar Ambiente</h3>
                <p className="text-zinc-600 text-xs mt-0.5">Altere nome e URL da barbearia</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">Nome da Barbearia</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={t.name}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">Slug (Caminho da URL)</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input 
                    type="text" 
                    name="slug" 
                    defaultValue={t.slug}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold text-white text-sm mt-2 transition-all flex items-center justify-center disabled:opacity-50 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Salvar Alterações"}
              </button>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
