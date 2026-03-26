"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Edit3, Building2, Globe, AlertCircle, Check } from "lucide-react";
import { updateTenantAction } from "@/app/actions";

export function EditTenantModal({ t }: { t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleClose() {
    setIsOpen(false);
    setError('');
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    const res = await updateTenantAction(t.id, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(handleClose, 900);
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Editar barbearia"
        className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>

      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={handleClose}
        >
          <div
            className="bg-[#0a0a0c] border border-zinc-800/80 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] w-full max-w-sm relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/15 rounded-xl">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Editar Barbearia</h3>
                  <p className="text-[10px] text-zinc-600 mt-0.5 font-medium truncate max-w-[180px]">{t.name}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-3 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2.5 p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  Salvo com sucesso!
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block">Nome da Barbearia</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input
                    type="text"
                    name="name"
                    defaultValue={t.name}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm font-medium focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block">Slug (Caminho da URL)</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input
                    type="text"
                    name="slug"
                    defaultValue={t.slug}
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm font-medium font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
                <p className="text-[10px] text-zinc-700 mt-1 ml-0.5">Alterar o slug quebra links existentes compartilhados</p>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-black text-white text-sm mt-1 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.12)] disabled:opacity-50 active:scale-[0.98]"
              >
                {loading
                  ? <><Loader2 className="animate-spin w-4 h-4" /> Salvando...</>
                  : success
                    ? <><Check className="w-4 h-4" /> Salvo!</>
                    : 'Salvar Alterações'
                }
              </button>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
