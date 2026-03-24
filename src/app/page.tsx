import { BookingCalendar } from "@/components/BookingCalendar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex mb-16 flex-col">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">
          Barbearia <span className="text-orange-500">SaaS Premium</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-medium">
          Agende seu horário com os melhores profissionais da cidade.
        </p>
      </div>

      <BookingCalendar
        barberId="barber-123"
        serviceId="service-123"
        tenantSlug="corte-top" // Exemplo prático de Multi-Tenancy em ação
      />
    </main>
  );
}
