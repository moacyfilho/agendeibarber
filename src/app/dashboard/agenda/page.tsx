import { CalendarDays } from "lucide-react"
import { BookingCalendar } from "@/components/BookingCalendar"

export default function AgendaPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
          <CalendarDays className="text-orange-500 w-10 h-10" /> 
          Agendamento Direto (Painel)
        </h2>
        <p className="text-zinc-400 font-medium text-lg">Use o calendário nativo para agendar um cliente pelo telefone ou balcão.</p>
      </header>

      {/* Renderizando o Componente Complexo feito na Fase 4 */}
      <BookingCalendar 
        barberId="owner-admin" 
        serviceId="manual-service" 
        tenantSlug="admin-view" 
      />
    </div>
  )
}
