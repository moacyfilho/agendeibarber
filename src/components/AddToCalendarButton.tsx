"use client";

import { Calendar, Download } from "lucide-react";

export function AddToCalendarButton({ serviceName, barberName, date, time, durationMinutes }: {
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  durationMinutes: number;
}) {
  function generateICS() {
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    const pad = (n: number) => String(n).padStart(2, '0');
    const formatICS = (d: Date) => 
      `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Agendei Barber//PT',
      'BEGIN:VEVENT',
      `DTSTART:${formatICS(startDate)}`,
      `DTEND:${formatICS(endDate)}`,
      `SUMMARY:✂️ ${serviceName} com ${barberName}`,
      `DESCRIPTION:Agendamento feito pelo Agendei Barber. Não se atrase!`,
      `LOCATION:Barbearia`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'DESCRIPTION:Seu corte é em 30 minutos!',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `agendamento-${serviceName.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openGoogleCalendar() {
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    const pad = (n: number) => String(n).padStart(2, '0');
    const gFormat = (d: Date) => 
      `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`✂️ ${serviceName} com ${barberName}`)}&dates=${gFormat(startDate)}/${gFormat(endDate)}&details=${encodeURIComponent('Agendamento via Agendei Barber')}&location=${encodeURIComponent('Barbearia')}`;
    
    window.open(url, '_blank');
  }

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={openGoogleCalendar}
        className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4 text-blue-400" /> Google Agenda
      </button>
      <button
        onClick={generateICS}
        className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4 text-orange-400" /> Baixar .ICS
      </button>
    </div>
  );
}
