"use client";

import { useState } from "react";
import { Plus, X, Loader2, Eye, EyeOff } from "lucide-react";
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
        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold h-14 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus className="w-6 h-6" /> Cadastrar Nova Barbearia
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-white mb-1">Nova Barbearia</h3>
            <p className="text-zinc-500 text-sm mb-6">Preencha os dados para criar o ambiente e o acesso do dono.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* SEÇÃO: BARBEARIA */}
              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-1">
                Dados da Barbearia
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Nome da Barbearia</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  placeholder="Ex: Navalha de Ouro"
                  className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">
                  Slug (URL)
                  <span className="text-zinc-600 font-normal ml-2 text-xs">gerado automaticamente</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={generateSlug(nameValue)}
                  readOnly
                  placeholder="navalha-de-ouro"
                  className="w-full bg-zinc-900/50 border border-zinc-800 h-12 rounded-xl px-4 text-zinc-400 focus:outline-none cursor-default text-sm"
                />
                <p className="text-zinc-600 text-xs mt-1">
                  Acesso: agendeibarber.vercel.app/<span className="text-zinc-400">{generateSlug(nameValue) || 'slug'}</span>
                </p>
              </div>

              {/* SEÇÃO: ACESSO */}
              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-zinc-800 pb-2 mt-2 mb-1">
                Acesso do Dono
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Nome do Responsável</label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  placeholder="Ex: João Silva"
                  className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">E-mail de Login</label>
                <input
                  type="email"
                  name="ownerEmail"
                  required
                  placeholder="dono@barbearia.com"
                  className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-400 mb-2 block">Senha de Acesso</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="ownerPassword"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-zinc-900 border border-zinc-800 h-12 rounded-xl px-4 pr-11 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold text-zinc-950 mt-2 transition-all flex items-center justify-center disabled:opacity-50 gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Criar Ambiente e Acesso"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
