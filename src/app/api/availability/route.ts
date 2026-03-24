import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  const barberId = searchParams.get('barberId');

  // Lógica Clean Architecture - chamando o Use Case na camada correspondente
  // const availability = await getBarberAvailabilityUseCase.execute({ barberId, dateStr });

  // Retorno Simulado (MOCK para demonstração do Backend funcional)
  return NextResponse.json([
    { time: '09:00', available: true },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: false },
    { time: '14:00', available: true },
  ]);
}
