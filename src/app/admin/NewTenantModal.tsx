"use client";

import { useState } from "react";
import { Plus, X, Loader2, Eye, EyeOff, Building2, User, Mail, Lock } from "lucide-react";
import { createTenantAction } from "@/app/actions";

export function NewTenantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameValue, setNameValue] = useState('');

  function generateSlug(name: string) {
    return name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createTenantAction(formData);
    if (res?.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
      setNameValue('');
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold h-11 px-6 rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Nova Barbearia
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsOpen(false)}>
          <div
            className="bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
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
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Nova Barbearia</h3>
                <p className="text-zinc-600 text-xs mt-0.5">Crie o ambiente e o acesso do dono</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Seção: Barbearia */}
              <div className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.15em] border-b border-zinc-900 pb-2 mb-1 flex items-center gap-2">
                <Building2 className="w-2.5 h-2.5" /> Dados da Barbearia
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">Nome da Barbearia</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  placeholder="Ex: Navalha de Ouro"
                  className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">
                  Slug (URL)
                  <span className="text-zinc-700 font-normal ml-1.5">gerado automaticamente</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={generateSlug(nameValue)}
                  readOnly
                  className="w-full bg-zinc-950/50 border border-zinc-800/50 h-11 rounded-xl px-4 text-zinc-500 text-sm focus:outline-none cursor-default"
                />
                <p className="text-zinc-700 text-[10px] mt-1 ml-0.5">
                  Acesso: <span className="text-emerald-500/60">agendeibarber.vercel.app/<strong>{generateSlug(nameValue) || 'slug'}</strong></span>
                </p>
              </div>

              {/* Seção: Acesso */}
              <div className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.15em] border-b border-zinc-900 pb-2 mt-2 mb-1 flex items-center gap-2">
                <User className="w-2.5 h-2.5" /> Acesso do Dono
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">Nome do Responsável</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input
                    type="text"
                    name="ownerName"
                    required
                    placeholder="Ex: João Silva"
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">E-mail de Login</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input
                    type="email"
                    name="ownerEmail"
                    required
                    placeholder="dono@barbearia.com"
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block ml-0.5">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="ownerPassword"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-11 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold text-white text-sm mt-2 transition-all flex items-center justify-center disabled:opacity-50 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Criar Ambiente e Acesso"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
