"use client";

import { Power, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toggleTenantStatusAction, deleteTenantAction } from "@/app/actions";
import { useState } from "react";
import { EditTenantModal } from "./EditTenantModal";

export function TenantRow({ t }: { t: any }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleTenantStatusAction(t.id, t.isActive);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja EXCLUIR permanentemente a barbearia "${t.name}"? Todos os dados (clientes, agendamentos, etc) serão apagados.`)) return;
    
    setLoading(true);
    try {
      await deleteTenantAction(t.id);
    } catch (err) {
      alert("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col md:flex-row md:justify-between md:items-center p-6 border rounded-3xl transition-all group ${t.isActive ? 'border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:border-emerald-500/30' : 'border-red-900/30 bg-red-950/5 opacity-80'}`}>
      <div className="flex items-center gap-6">
        <div className={`w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center font-black text-2xl transition-colors ${t.isActive ? 'text-zinc-500 group-hover:text-emerald-500' : 'text-zinc-700'}`}>
          {t.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-3">
             <p className="font-extrabold text-white text-xl mb-1">{t.name}</p>
             {!t.isActive && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Bloqueado</span>}
          </div>
          <a 
            href={`/${t.slug}`} 
            target="_blank"
            className="text-sm font-medium text-zinc-400 flex items-center gap-2 hover:text-emerald-400 transition-colors"
          >
            app.agendeibarber.com.br/<span className="text-emerald-400 underline">{t.slug}</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </a>
        </div>
      </div>
      <div className="mt-5 md:mt-0 flex flex-wrap items-center gap-4">
        <span className="text-xs text-zinc-500 font-bold block">
           Desde: {format(new Date(t.createdAt), "MMM yyyy", { locale: ptBR })}
        </span>
        <span className="font-bold text-sm bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl border border-zinc-700">
          {t.plan || 'Base Plan'}
        </span>
        
        <span className={`font-black text-[10px] px-3 py-2 rounded-xl tracking-widest uppercase border ${t.isActive ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
          {t.isActive ? 'PAGAMENTO OK' : 'INADIMPLENTE'}
        </span>
        
        <EditTenantModal t={t} />

        <button 
          onClick={handleDelete}
          disabled={loading}
          title="Excluir Barbearia"
          className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
        </button>

        <button 
          onClick={handleToggle}
          disabled={loading}
          title={t.isActive ? "Bloquear Barbearia" : "Ativar Barbearia"}
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${t.isActive ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:bg-emerald-500 hover:border-emerald-500' : 'bg-emerald-500 border-emerald-500 text-zinc-950 hover:bg-emerald-400'}`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Power className="w-5 h-5 group-hover:scale-110 transition-transform" />}
        </button>
      </div>
    </div>
  );
}
