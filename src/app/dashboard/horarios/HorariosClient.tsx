'use client';
import { useState } from 'react';
import { Clock, Ban, Save, CalendarDays, Trash2, Check } from 'lucide-react';
import { updateBusinessHoursAction } from '@/app/actions';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

type DaySchedule = { open: string; close: string } | null;
type WeekSchedule = Record<string, DaySchedule>; // "0"=Dom .. "6"=Sab

const DAYS = [
  { key: '1', label: 'Segunda', short: 'Seg' },
  { key: '2', label: 'Terça', short: 'Ter' },
  { key: '3', label: 'Quarta', short: 'Qua' },
  { key: '4', label: 'Quinta', short: 'Qui' },
  { key: '5', label: 'Sexta', short: 'Sex' },
  { key: '6', label: 'Sábado', short: 'Sáb' },
  { key: '0', label: 'Domingo', short: 'Dom' },
];

type BlockedTime = {
  id: string;
  barber: { name: string };
  startTime: Date;
  endTime: Date;
  reason: string | null;
};

type Barber = { id: string; name: string };

interface Props {
  initialSchedule: WeekSchedule;
  blockedTimes: BlockedTime[];
  barbers: Barber[];
  deleteBlockedTime: (id: string) => Promise<void>;
}

export function HorariosClient({ initialSchedule, blockedTimes, barbers, deleteBlockedTime }: Props) {
  const [tab, setTab] = useState<'horarios' | 'bloqueios'>('horarios');
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function toggleDay(key: string) {
    setSchedule(prev => ({
      ...prev,
      [key]: prev[key] ? null : { open: '09:00', close: '20:00' },
    }));
  }

  function setTime(key: string, field: 'open' | 'close', value: string) {
    setSchedule(prev => ({
      ...prev,
      [key]: prev[key] ? { ...prev[key]!, [field]: value } : { open: '09:00', close: '20:00', [field]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateBusinessHoursAction(JSON.stringify(schedule));
      toast('Horários salvos com sucesso!');
    } catch {
      toast('Erro ao salvar horários.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBlock(id: string) {
    if (!confirm('Remover este bloqueio?')) return;
    try {
      await deleteBlockedTime(id);
      toast('Bloqueio removido.');
      router.refresh();
    } catch {
      toast('Erro ao remover bloqueio.', 'error');
    }
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-4xl mx-auto min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-orange-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Horários</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Funcionamento semanal e bloqueios de agenda</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('horarios')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'horarios' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Clock className="w-3.5 h-3.5 inline mr-1.5" />Funcionamento
        </button>
        <button
          onClick={() => setTab('bloqueios')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'bloqueios' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Ban className="w-3.5 h-3.5 inline mr-1.5" />Bloqueios ({blockedTimes.length})
        </button>
      </div>

      {tab === 'horarios' && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 mb-4">Configure os dias e horários de funcionamento da barbearia. Os clientes só poderão agendar nos dias e horários ativos.</p>

          {DAYS.map(({ key, label }) => {
            const active = !!schedule[key];
            const day = schedule[key];
            return (
              <div
                key={key}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  active
                    ? 'bg-zinc-900/60 border-zinc-700/60'
                    : 'bg-zinc-900/20 border-zinc-800/40 opacity-60'
                }`}
              >
                {/* Toggle */}
                <button
                  onClick={() => toggleDay(key)}
                  className={`w-10 h-6 rounded-full flex items-center transition-all flex-shrink-0 ${active ? 'bg-orange-500 justify-end pr-1' : 'bg-zinc-700 justify-start pl-1'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>

                {/* Day label */}
                <div className="w-20 flex-shrink-0">
                  <span className={`text-sm font-bold ${active ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
                </div>

                {/* Times */}
                {active ? (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Abre</span>
                      <input
                        type="time"
                        value={day?.open ?? '09:00'}
                        onChange={e => setTime(key, 'open', e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                    <span className="text-zinc-600 text-xs">até</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Fecha</span>
                      <input
                        type="time"
                        value={day?.close ?? '20:00'}
                        onChange={e => setTime(key, 'close', e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-600 italic">Fechado</span>
                )}

                {active && (
                  <div className="ml-auto">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 active:scale-95 shadow-lg shadow-orange-500/15"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Horários'}
          </button>
        </div>
      )}

      {tab === 'bloqueios' && (
        <div>
          {blockedTimes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <CalendarDays className="w-12 h-12 text-zinc-800 mb-3" />
              <p className="text-zinc-500 font-medium">Nenhum bloqueio ativo.</p>
              <p className="text-zinc-700 text-xs mt-1">Use o botão "Bloquear" na Agenda para adicionar bloqueios.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {blockedTimes.map(b => {
                const dateStr = b.startTime.toLocaleDateString('pt-BR');
                const startStr = b.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const endStr = b.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={b.id} className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl hover:border-zinc-700/60 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center text-red-400 flex-shrink-0">
                      <Ban className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{b.barber.name}</p>
                      <p className="text-zinc-500 text-xs">{dateStr} — {startStr} às {endStr}</p>
                    </div>
                    <span className="text-xs font-medium bg-red-500/8 text-red-400 border border-red-500/15 px-2.5 py-1 rounded-lg">
                      {b.reason || 'Sem motivo'}
                    </span>
                    <button
                      onClick={() => handleDeleteBlock(b.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
