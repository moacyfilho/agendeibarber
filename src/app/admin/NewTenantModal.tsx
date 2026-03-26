"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Loader2, Eye, EyeOff, Building2, User, Mail, Lock, Globe, AlertCircle, Package, Star, Crown } from "lucide-react";
import { createTenantAction } from "@/app/actions";

const PLANS = [
  { value: 'STARTER',      label: 'Starter',      price: 'R$ 49,90/mês', Icon: Package, color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  { value: 'PROFISSIONAL', label: 'Profissional',  price: 'R$ 99,90/mês', Icon: Star,    color: 'border-orange-500/30 bg-orange-500/10 text-orange-400' },
  { value: 'PREMIUM',      label: 'Premium',       price: 'R$ 149,90/mês',Icon: Crown,   color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
] as const;

export function NewTenantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('STARTER');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function generateSlug(name: string) {
    return name.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  function handleClose() {
    setIsOpen(false);
    setNameValue('');
    setSelectedPlan('STARTER');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    formData.set('plan', selectedPlan);
    const res = await createTenantAction(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      handleClose();
    }
    setLoading(false);
  }

  const slug = generateSlug(nameValue);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 h-11 px-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm rounded-xl shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Nova Barbearia
      </button>

      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/92 backdrop-blur-xl"
          onClick={handleClose}
        >
          <div
            className="bg-[#0a0a0c] border border-zinc-800/80 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.08)] w-full max-w-md relative max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a0c] border-b border-zinc-900/80 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/15 rounded-xl">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Nova Barbearia</h3>
                  <p className="text-[10px] text-zinc-600 font-medium mt-0.5">Crie o ambiente e configure o acesso</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 p-3 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Seção Barbearia */}
              <div>
                <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
                  <Building2 className="w-2.5 h-2.5" /> Dados da Barbearia
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block">Nome da Barbearia</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={nameValue}
                      onChange={e => setNameValue(e.target.value)}
                      placeholder="Ex: Navalha de Ouro"
                      className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 mb-1.5 flex items-center gap-1.5 block">
                      Slug (URL)
                      <span className="text-zinc-700 font-normal text-[10px]">— gerado automaticamente</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                      <input
                        type="text"
                        name="slug"
                        required
                        value={slug}
                        readOnly
                        className="w-full bg-zinc-950/60 border border-zinc-800/50 h-11 rounded-xl pl-10 pr-4 text-zinc-500 text-sm cursor-default font-mono"
                      />
                    </div>
                    {slug && (
                      <p className="text-[10px] text-zinc-700 mt-1 ml-0.5">
                        URL pública: <span className="text-emerald-500/50 font-mono">.../<strong>{slug}</strong></span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção Plano */}
              <div>
                <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
                  <Package className="w-2.5 h-2.5" /> Plano de Acesso
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map(p => {
                    const active = selectedPlan === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setSelectedPlan(p.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                          active
                            ? `${p.color} border-current`
                            : 'border-zinc-800 bg-zinc-900/30 text-zinc-600 hover:border-zinc-700'
                        }`}
                      >
                        <p.Icon className="w-4 h-4" />
                        <span className="text-[10px] font-black">{p.label}</span>
                        <span className="text-[8px] font-bold opacity-70">{p.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seção Dono */}
              <div>
                <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
                  <User className="w-2.5 h-2.5" /> Acesso do Proprietário
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block">Nome do Responsável</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                      <input
                        type="text"
                        name="ownerName"
                        required
                        placeholder="Ex: João Silva"
                        className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block">E-mail de Login</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                      <input
                        type="email"
                        name="ownerEmail"
                        required
                        placeholder="dono@barbearia.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 mb-1.5 block">Senha de Acesso</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="ownerPassword"
                        required
                        minLength={6}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-zinc-900/50 border border-zinc-800 h-11 rounded-xl pl-10 pr-11 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-700"
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
                </div>
              </div>

              <input type="hidden" name="plan" value={selectedPlan} />

              <button
                type="submit"
                disabled={loading || !nameValue.trim()}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl font-black text-white text-sm mt-1 transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.15)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading
                  ? <><Loader2 className="animate-spin w-4 h-4" /> Criando ambiente...</>
                  : <><Building2 className="w-4 h-4" /> Criar Barbearia</>
                }
              </button>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
