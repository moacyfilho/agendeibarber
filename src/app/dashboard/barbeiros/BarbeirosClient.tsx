'use client';
import { useState } from 'react';
import {
  Scissors, Plus, Pencil, Trash2, Loader2, X,
  Phone, Mail, Percent, Calendar, Key, Clock, Eye, EyeOff, CheckCircle, Search
} from 'lucide-react';
import {
  createBarbeiroAction, updateBarbeiroAction,
  setBarbeiroPasswordAction, deleteBarbeiroAction,
  createBlockedTimeAction, deleteBlockedTimeAction,
} from './actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Barber = {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  commissionPercentage: number | null;
  valuePerHourInCents: number | null;
  specialties: string | null;
  _count: { appointmentsAsBarber: number };
  blockedTimes: { id: string; startTime: Date | string; endTime: Date | string; reason: string | null }[];
};

/* ── Modal: Criar/Editar Barbeiro ── */
function BarbeiroModal({ barber, onClose }: { barber?: Barber; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = barber ? await updateBarbeiroAction(barber.id, fd) : await createBarbeiroAction(fd);
    setLoading(false);
    if (res && 'error' in res) { setError(res.error); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white">{barber ? 'Editar Barbeiro' : 'Novo Barbeiro'}</h2>
            <p className="text-zinc-600 text-xs mt-0.5">Preencha os dados do barbeiro</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Nome Completo *</label>
            <input name="name" defaultValue={barber?.name} required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Telefone *</label>
              <input name="phone" defaultValue={barber?.phone ?? ''} required placeholder="(11) 99999-9999" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Email (opcional)</label>
              <input name="email" type="email" defaultValue={barber?.email?.includes('@agendei.app') ? '' : barber?.email} placeholder="email@exemplo.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Comissão (%) *</label>
              <input name="commission" type="number" min="0" max="100" defaultValue={barber?.commissionPercentage ?? 50} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
              <p className="text-[10px] text-zinc-600 mt-1">Porcentagem sobre serviços normais</p>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Valor por Hora (R$) *</label>
              <input name="valuePerHour" defaultValue={barber ? ((barber.valuePerHourInCents ?? 0) / 100).toFixed(2).replace('.', ',') : '0'} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
              <p className="text-[10px] text-zinc-600 mt-1">Valor fixo por hora para atendimentos de assinantes</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Especialidades</label>
            <input name="specialties" defaultValue={barber?.specialties ?? ''} placeholder="Ex: Degradê, Barba, Platinado" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl border border-zinc-800 transition-all">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : barber ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modal: Definir Senha ── */
function SenhaModal({ barber, onClose }: { barber: Barber; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await setBarbeiroPasswordAction(barber.id, pw);
    setLoading(false);
    if (res && 'error' in res) { setError(res.error); return; }
    setDone(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white">Definir Senha</h2>
            <p className="text-zinc-600 text-xs mt-0.5">{barber.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
              <p className="text-white font-bold">Senha definida com sucesso!</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Nova Senha</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">Essa senha permite que o barbeiro acesse o sistema.</p>
              </div>
              {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
              <button type="submit" disabled={loading} className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Senha'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

/* ── Modal: Bloquear Horário ── */
function HorarioModal({ barber, onClose }: { barber: Barber; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [delLoadingId, setDelLoadingId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState(barber.blockedTimes);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await createBlockedTimeAction(barber.id, fd);
    setLoading(false);
    if (res && 'error' in res) { setError(res.error); return; }
    (e.target as HTMLFormElement).reset();
    window.location.reload();
  }

  async function handleDelete(id: string) {
    setDelLoadingId(id);
    await deleteBlockedTimeAction(id);
    setBlocks(bs => bs.filter(b => b.id !== id));
    setDelLoadingId(null);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0e0e0e] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-800 sticky top-0 bg-[#0e0e0e] z-10">
          <div>
            <h2 className="text-base font-bold text-white">Bloquear Horário</h2>
            <p className="text-zinc-600 text-xs mt-0.5">{barber.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Data</label>
              <input name="date" type="date" required defaultValue={today} min={today} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Início</label>
                <input name="startHour" type="time" required defaultValue="08:00" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Término</label>
                <input name="endHour" type="time" required defaultValue="18:00" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1.5 block">Motivo</label>
              <input name="reason" placeholder="Ex: Folga, Férias, Compromisso" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
            </div>
            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar Bloqueio'}
            </button>
          </form>

          {blocks.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Horários Bloqueados</p>
              <div className="space-y-2">
                {blocks.map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold">
                        {format(new Date(b.startTime), "dd/MM/yyyy HH:mm", { locale: ptBR })} → {format(new Date(b.endTime), "HH:mm", { locale: ptBR })}
                      </p>
                      {b.reason && <p className="text-zinc-500 text-[10px] font-medium truncate">{b.reason}</p>}
                    </div>
                    <button onClick={() => handleDelete(b.id)} disabled={delLoadingId === b.id} className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 flex-shrink-0">
                      {delLoadingId === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export function BarbeirosClient({ initialBarbers }: { initialBarbers: Barber[] }) {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | 'senha' | 'horario' | null>(null);
  const [selected, setSelected] = useState<Barber | undefined>();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function open(type: typeof modal, b?: Barber) { setSelected(b); setModal(type); }
  function close() { setModal(null); setSelected(undefined); window.location.reload(); }

  async function handleDelete(b: Barber) {
    if (!confirm(`Excluir o barbeiro "${b.name}"? Esta ação não pode ser desfeita.`)) return;
    setLoadingId(b.id);
    await deleteBarbeiroAction(b.id);
    setBarbers(bs => bs.filter(x => x.id !== b.id));
    setLoadingId(null);
  }

  const filtered = barbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.phone || '').includes(search) ||
    b.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {modal === 'create' && <BarbeiroModal onClose={close} />}
      {modal === 'edit' && selected && <BarbeiroModal barber={selected} onClose={close} />}
      {modal === 'senha' && selected && <SenhaModal barber={selected} onClose={close} />}
      {modal === 'horario' && selected && <HorarioModal barber={selected} onClose={close} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="page-header-icon"><Scissors className="w-5 h-5" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Barbeiros</h1>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Gerencie o cadastro de barbeiros</p>
          </div>
        </div>
        <button
          onClick={() => open('create')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_2px_16px_rgba(249,115,22,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4" /> Novo Barbeiro
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, telefone ou email..."
          className="w-full bg-zinc-950/60 border border-zinc-800/60 rounded-xl pl-11 pr-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-orange-500/40 transition-colors"
        />
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-950/40 border border-zinc-900/60 rounded-2xl">
          <Scissors className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-white font-bold mb-1">Nenhum barbeiro encontrado</p>
          <p className="text-zinc-600 text-sm font-medium mb-5">Cadastre o primeiro profissional da equipe.</p>
          <button onClick={() => open('create')} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all">
            <Plus className="w-4 h-4" /> Novo Barbeiro
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3 hover:border-zinc-700/60 transition-all">
            {/* Actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-400 text-base flex-shrink-0">
                {b.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => open('edit', b)} title="Editar" className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => open('senha', b)} title="Definir Senha" className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all">
                  <Key className="w-3 h-3" />
                </button>
                <button onClick={() => open('horario', b)} title="Bloquear Horário" className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all">
                  <Clock className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(b)} disabled={loadingId === b.id} title="Excluir" className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all disabled:opacity-50">
                  {loadingId === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-bold text-white text-sm">{b.name}</p>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              </div>
              {b.specialties && <p className="text-zinc-600 text-[11px] font-medium">{b.specialties}</p>}
            </div>

            <div className="space-y-1.5">
              {b.phone && (
                <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-medium">
                  <Phone className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                  {b.phone}
                </div>
              )}
              {!b.email.includes('@agendei.app') && (
                <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-medium">
                  <Mail className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                  {b.email}
                </div>
              )}
              <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-medium">
                <Percent className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                {b.commissionPercentage ?? 50}% de comissão
              </div>
              <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-medium">
                <Calendar className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                {b._count.appointmentsAsBarber} atendimentos
              </div>
            </div>

            {b.blockedTimes.length > 0 && (
              <div className="pt-2 border-t border-zinc-900/60">
                <p className="text-[10px] font-black text-orange-400/70 uppercase tracking-wider">
                  {b.blockedTimes.length} bloqueio{b.blockedTimes.length !== 1 ? 's' : ''} ativo{b.blockedTimes.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
