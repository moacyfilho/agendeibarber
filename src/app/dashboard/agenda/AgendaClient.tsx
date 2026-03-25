'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Loader2, Search, Lock, CheckCircle2 } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createPortal } from 'react-dom';
import {
  createAppointmentAction,
  checkCustomerByPhoneAction,
  createBlockedTimeAction,
} from '@/app/actions';

const SLOT_HEIGHT = 56; // px por slot de 30min
const START_HOUR = 8;
const END_HOUR = 21;

const BARBER_COLORS = [
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', dot: 'bg-blue-400', card: 'bg-blue-500/15 border-blue-500/25' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', dot: 'bg-purple-400', card: 'bg-purple-500/15 border-purple-500/25' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', dot: 'bg-emerald-400', card: 'bg-emerald-500/15 border-emerald-500/25' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-300', dot: 'bg-orange-400', card: 'bg-orange-500/15 border-orange-500/25' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-300', dot: 'bg-pink-400', card: 'bg-pink-500/15 border-pink-500/25' },
];

function timeSlots() {
  const slots: string[] = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < END_HOUR) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

function minutesToY(minutes: number) {
  const offset = minutes - START_HOUR * 60;
  return (offset / 30) * SLOT_HEIGHT;
}

type Appointment = {
  id: string;
  scheduledAt: string;
  endTime: string | null;
  status: string;
  customer: { name: string; phone: string | null };
  service: { name: string; durationMinutes: number; priceInCents: number };
  barber: { id: string; name: string };
};

type Barber = { id: string; name: string; avatarUrl: string | null };
type Service = { id: string; name: string; durationMinutes: number; priceInCents: number };

interface Props {
  barbers: Barber[];
  services: Service[];
  initialAppointments: Appointment[];
  tenantId: string;
}

export function AgendaClient({ barbers, services, initialAppointments, tenantId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const appointments = initialAppointments;
  const [filterBarber, setFilterBarber] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ barberId: string; date: Date; time: string } | null>(null);
  const [nowY, setNowY] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Toda lógica de data só roda no cliente — evita hydration mismatch
    const today = new Date();
    setCurrentDate(today);
    setMounted(true);

    function updateNow() {
      const n = new Date();
      setNowY(minutesToY(n.getHours() * 60 + n.getMinutes()));
    }
    updateNow();
    const timer = setInterval(updateNow, 60000);

    const y = minutesToY(today.getHours() * 60 + today.getMinutes());
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, y - 120);
    }
    return () => clearInterval(timer);
  }, []);

  // Skeleton enquanto não montou no cliente
  if (!mounted || !currentDate) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-10 bg-zinc-900 rounded-xl w-2/3" />
        <div className="h-8 bg-zinc-900 rounded-xl w-1/3" />
        <div className="flex-1 h-[600px] bg-zinc-900 rounded-2xl" />
      </div>
    );
  }

  const slots = timeSlots();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return addDays(weekStart, i);
  });

  const displayedDays = viewMode === 'day' ? [currentDate] : weekDays;

  const visibleBarbers = filterBarber === 'all' ? barbers : barbers.filter(b => b.id === filterBarber);

  function getAppointmentsFor(barberId: string, date: Date) {
    return appointments.filter(a => {
      const d = new Date(a.scheduledAt);
      return a.barber.id === barberId && isSameDay(d, date);
    });
  }

  function matchesSearch(a: Appointment) {
    if (!search) return true;
    return (
      a.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.customer.phone || '').includes(search)
    );
  }

  function navigate(dir: 1 | -1) {
    if (viewMode === 'day') {
      setCurrentDate(d => dir === 1 ? addDays(d, 1) : subDays(d, 1));
    } else {
      setCurrentDate(d => dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1));
    }
  }

  function handleCellClick(barberId: string, date: Date, slot: string) {
    setModal({ barberId, date, time: slot });
  }

  const dateLabel = viewMode === 'day'
    ? format(currentDate, "d 'de' MMMM", { locale: ptBR })
    : `${format(weekDays[0], 'd MMM', { locale: ptBR })} – ${format(weekDays[6], 'd MMM', { locale: ptBR })}`;

  // Usa o horário local do cliente (UTC-4 Manaus) — não o UTC do servidor
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isToday = (d: Date) => format(d, 'yyyy-MM-dd') === todayStr;

  return (
    <div className="flex flex-col h-full">
      {/* ── TOOLBAR ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Nav */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 text-sm font-bold text-white min-w-[130px] text-center">{dateLabel}</span>
          <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hoje */}
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1.5 text-xs font-bold bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-orange-500/30 transition-all"
        >
          Hoje
        </button>

        {/* Day / Semana */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-bold">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'day' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Dia
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'week' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Semana
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-orange-500/40"
          />
        </div>

        {/* Filtro barbeiro */}
        <select
          value={filterBarber}
          onChange={e => setFilterBarber(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/40 min-w-[160px]"
        >
          <option value="all">Todos os barbeiros</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        {/* Novo agendamento */}
        <button
          onClick={() => setModal({ barberId: barbers[0]?.id || '', date: currentDate, time: '09:00' })}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black rounded-xl transition-all shadow-[0_0_16px_rgba(249,115,22,0.3)]"
        >
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      {/* ── LEGENDA BARBEIROS ── */}
      <div className="flex items-center gap-4 mb-3 px-1 flex-wrap">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Barbeiros:</span>
        {visibleBarbers.map((b, i) => {
          const color = BARBER_COLORS[i % BARBER_COLORS.length];
          return (
            <div key={b.id} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
              <div className={`w-6 h-6 rounded-full ${color.bg} border ${color.border} flex items-center justify-center text-[9px] font-black ${color.text} overflow-hidden`}>
                {b.avatarUrl ? <img src={b.avatarUrl} alt={b.name} className="w-full h-full object-cover rounded-full" /> : b.name[0]}
              </div>
              <span className="text-xs text-zinc-400 font-medium">{b.name}</span>
            </div>
          );
        })}
      </div>

      {/* ── GRADE ── */}
      <div className="flex-1 overflow-hidden bg-[#0a0a0a] border border-zinc-900 rounded-2xl flex flex-col">
        {/* Header: Horário | [Barbeiro x Dia] colunas */}
        <div className="flex border-b border-zinc-900 flex-shrink-0">
          <div className="w-16 flex-shrink-0 border-r border-zinc-900" />
          {viewMode === 'day'
            ? visibleBarbers.map((barber, i) => {
                const color = BARBER_COLORS[i % BARBER_COLORS.length];
                return (
                  <div key={barber.id} className={`flex-1 min-w-0 border-r border-zinc-900 last:border-r-0 px-3 py-3 flex flex-col items-center gap-2 ${color.bg}`}>
                    <div className={`w-10 h-10 rounded-full ${color.bg} border-2 ${color.border} flex items-center justify-center text-sm font-black ${color.text} overflow-hidden`}>
                      {barber.avatarUrl ? <img src={barber.avatarUrl} alt={barber.name} className="w-full h-full object-cover" /> : barber.name[0]}
                    </div>
                    <span className={`text-xs font-bold ${color.text}`}>{barber.name}</span>
                    <button
                      onClick={() => setModal({ barberId: barber.id, date: currentDate, time: '__block__' })}
                      className="flex items-center gap-1 px-2 py-1 bg-zinc-900/80 border border-zinc-800 rounded-lg text-[9px] font-bold text-zinc-500 hover:text-orange-400 hover:border-orange-500/30 transition-all"
                    >
                      <Lock className="w-2.5 h-2.5" /> Bloquear
                    </button>
                  </div>
                );
              })
            : displayedDays.map(day => (
                <div key={day.toISOString()} className={`flex-1 min-w-0 border-r border-zinc-900 last:border-r-0 px-2 py-3 text-center ${isToday(day) ? 'bg-orange-500/5' : ''}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${isToday(day) ? 'text-orange-400' : 'text-zinc-600'}`}>
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={`text-lg font-black ${isToday(day) ? 'text-orange-400' : 'text-zinc-300'}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))
          }
        </div>

        {/* Scroll area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-auto relative" style={{ scrollbarWidth: 'thin' }}>
          <div className="flex" style={{ minHeight: `${slots.length * SLOT_HEIGHT}px` }}>
            {/* Time column */}
            <div className="w-16 flex-shrink-0 border-r border-zinc-900 relative">
              {slots.map((slot, idx) => (
                <div
                  key={slot}
                  className="absolute w-full flex items-start justify-end pr-2 pt-1"
                  style={{ top: idx * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                >
                  {slot.endsWith(':00') && (
                    <span className="text-[10px] font-bold text-zinc-700">{slot}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Colunas */}
            {viewMode === 'day'
              ? visibleBarbers.map((barber, bi) => {
                  const color = BARBER_COLORS[bi % BARBER_COLORS.length];
                  const dayApps = getAppointmentsFor(barber.id, currentDate).filter(matchesSearch);
                  return (
                    <BarberColumn
                      key={barber.id}
                      barber={barber}
                      color={color}
                      slots={slots}
                      slotHeight={SLOT_HEIGHT}
                      appointments={dayApps}
                      date={currentDate}
                      isToday={isToday(currentDate)}
                      nowY={isToday(currentDate) ? nowY : null}
                      onCellClick={(slot) => handleCellClick(barber.id, currentDate, slot)}
                    />
                  );
                })
              : displayedDays.map((day) => {
                  const dayApps = visibleBarbers.flatMap(b => getAppointmentsFor(b.id, day)).filter(matchesSearch);
                  return (
                    <WeekColumn
                      key={day.toISOString()}
                      barbers={visibleBarbers}
                      slots={slots}
                      slotHeight={SLOT_HEIGHT}
                      appointments={dayApps}
                      date={day}
                      isToday={isToday(day)}
                      nowY={isToday(day) ? nowY : null}
                      colors={BARBER_COLORS}
                      onCellClick={(slot) => handleCellClick(visibleBarbers[0]?.id || '', day, slot)}
                    />
                  );
                })
            }
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <AppointmentModal
          modal={modal}
          barbers={barbers}
          services={services}
          tenantId={tenantId}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); window.location.reload(); }}
        />
      )}
    </div>
  );
}

/* ── Coluna dia/barbeiro ── */
function BarberColumn({ color, slots, slotHeight, appointments, isToday: _isToday, nowY, onCellClick }: {
  color: typeof BARBER_COLORS[0];
  slots: string[];
  slotHeight: number;
  appointments: Appointment[];
  isToday: boolean;
  nowY: number | null;
  onCellClick: (slot: string) => void;
}) {
  return (
    <div className={`flex-1 min-w-0 border-r border-zinc-900 last:border-r-0 relative`}>
      {/* Linhas dos slots */}
      {slots.map((slot: string, idx: number) => (
        <div
          key={slot}
          onClick={() => onCellClick(slot)}
          className={`absolute w-full border-b transition-colors cursor-pointer hover:bg-white/[0.015] ${
            slot.endsWith(':00') ? 'border-zinc-900' : 'border-zinc-900/40'
          }`}
          style={{ top: idx * slotHeight, height: slotHeight }}
        />
      ))}

      {/* Linha do horário atual */}
      {nowY !== null && (
        <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: nowY }}>
          <div className="h-[2px] bg-orange-500/60 shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
          <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </div>
      )}

      {/* Agendamentos */}
      {appointments.map((app: Appointment) => {
        const start = new Date(app.scheduledAt);
        const end = app.endTime ? new Date(app.endTime) : new Date(start.getTime() + 30 * 60000);
        const startMin = start.getHours() * 60 + start.getMinutes();
        const endMin = end.getHours() * 60 + end.getMinutes();
        const top = minutesToY(startMin);
        const height = Math.max(slotHeight, minutesToY(endMin) - top);

        return (
          <div
            key={app.id}
            className={`absolute left-1 right-1 rounded-xl border ${color.card} px-2 py-1.5 z-10 cursor-pointer overflow-hidden transition-all hover:brightness-125`}
            style={{ top: top + 2, height: height - 4 }}
          >
            <p className={`text-[11px] font-black leading-tight truncate ${color.text}`}>{app.customer.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{app.service.name}</p>
            {height > 50 && (
              <p className="text-[9px] text-zinc-600 mt-0.5">
                {format(new Date(app.scheduledAt), 'HH:mm')} – {format(end, 'HH:mm')}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Coluna semana ── */
function WeekColumn({ barbers, slots, slotHeight, appointments, isToday, nowY, colors, onCellClick }: {
  barbers: Barber[];
  slots: string[];
  slotHeight: number;
  appointments: Appointment[];
  isToday: boolean;
  nowY: number | null;
  colors: typeof BARBER_COLORS;
  onCellClick: (slot: string) => void;
}) {
  return (
    <div className={`flex-1 min-w-0 border-r border-zinc-900 last:border-r-0 relative ${isToday ? 'bg-orange-500/[0.02]' : ''}`}>
      {slots.map((slot: string, idx: number) => (
        <div
          key={slot}
          onClick={() => onCellClick(slot)}
          className={`absolute w-full border-b cursor-pointer hover:bg-white/[0.015] transition-colors ${
            slot.endsWith(':00') ? 'border-zinc-900' : 'border-zinc-900/40'
          }`}
          style={{ top: idx * slotHeight, height: slotHeight }}
        />
      ))}

      {nowY !== null && (
        <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: nowY }}>
          <div className="h-[2px] bg-orange-500/60" />
        </div>
      )}

      {appointments.map((app: Appointment) => {
        const bi = barbers.findIndex((b: Barber) => b.id === app.barber.id);
        const color = colors[bi >= 0 ? bi % colors.length : 0];
        const start = new Date(app.scheduledAt);
        const end = app.endTime ? new Date(app.endTime) : new Date(start.getTime() + 30 * 60000);
        const top = minutesToY(start.getHours() * 60 + start.getMinutes());
        const height = Math.max(slotHeight - 4, minutesToY(end.getHours() * 60 + end.getMinutes()) - top);

        return (
          <div
            key={app.id}
            className={`absolute left-0.5 right-0.5 rounded-lg border ${color.card} px-1.5 py-1 z-10 overflow-hidden`}
            style={{ top: top + 2, height: height - 4 }}
          >
            <p className={`text-[10px] font-black truncate ${color.text}`}>{app.customer.name}</p>
            <p className="text-[9px] text-zinc-600 truncate">{app.service.name}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Modal de Agendamento Manual ── */
function AppointmentModal({ modal, barbers, services, tenantId, onClose, onSuccess }: {
  modal: { barberId: string; date: Date; time: string };
  barbers: Barber[];
  services: Service[];
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isBlock = modal.time === '__block__';
  const [barberId, setBarberId] = useState(modal.barberId);
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [date, setDate] = useState(format(modal.date, 'yyyy-MM-dd'));
  const [time, setTime] = useState(isBlock ? '09:00' : modal.time);
  const [endTime, setEndTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'found' | 'new'>('input');
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function checkPhone() {
    if (customerPhone.length < 8) return;
    setIsChecking(true);
    const found = await checkCustomerByPhoneAction(customerPhone, tenantId);
    if (found) {
      setCustomerName(found.name);
      setPhoneStep('found');
    } else {
      setPhoneStep('new');
    }
    setIsChecking(false);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      if (isBlock) {
        const fd = new FormData();
        fd.append('barberId', barberId);
        fd.append('date', date);
        fd.append('startTime', time);
        fd.append('endTime', endTime);
        fd.append('reason', reason || 'Bloqueado');
        await createBlockedTimeAction(fd);
      } else {
        const [h, m] = time.split(':').map(Number);
        const scheduledAt = new Date(date);
        scheduledAt.setHours(h, m, 0, 0);
        await createAppointmentAction({
          barberId,
          serviceId,
          scheduledAt,
          customerName,
          customerPhone,
        });
      }
      onSuccess();
    } catch (e) {
      setIsSubmitting(false);
    }
  }

  const canSubmit = isBlock
    ? barberId && date && time && endTime
    : barberId && serviceId && date && time && customerName;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h3 className="text-base font-black text-white">
            {isBlock ? '🔒 Bloquear Horário' : '📅 Novo Agendamento'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Barbeiro */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Barbeiro</label>
            <select
              value={barberId}
              onChange={e => setBarberId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/40"
            >
              {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {/* Data + Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Data</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">
                {isBlock ? 'Início' : 'Horário'}
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/40"
              />
            </div>
          </div>

          {isBlock ? (
            <>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Fim</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/40"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Motivo</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Ex: Almoço, Férias..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/40"
                />
              </div>
            </>
          ) : (
            <>
              {/* Serviço */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Serviço</label>
                <select
                  value={serviceId}
                  onChange={e => setServiceId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/40"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.priceInCents / 100)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cliente */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Telefone do Cliente</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={e => { setCustomerPhone(e.target.value); setPhoneStep('input'); setCustomerName(''); }}
                    placeholder="(92) 98170-8066"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/40"
                  />
                  <button
                    type="button"
                    onClick={checkPhone}
                    disabled={customerPhone.length < 8 || isChecking}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 disabled:opacity-40 transition-all"
                  >
                    {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {phoneStep === 'found' && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-300 font-bold">{customerName}</span>
                  <span className="text-xs text-zinc-500 ml-auto">cliente cadastrado</span>
                </div>
              )}

              {(phoneStep === 'new' || phoneStep === 'input') && (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Nome do Cliente</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/40"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-all">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-black bg-orange-500 hover:bg-orange-400 text-black transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(249,115,22,0.3)]"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isBlock ? 'Bloquear' : 'Agendar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
