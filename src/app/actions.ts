'use server';

import { addCliente, addBarbeiro, addServico, addProduto } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// ============================================
// SERVER ACTIONS (Controles de Backend Nativos)
// ============================================

export async function createClienteAction(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!name) return;

  addCliente({
    name,
    phone: phone || "(Sem Fone)",
    points: 10,
    lastVisit: "Primeira Visita",
    status: "Regular"
  });

  revalidatePath('/dashboard/clientes');
}

export async function createBarbeiroAction(formData: FormData) {
  const name = formData.get('bname') as string;
  const commission = formData.get('comm') as string;

  if (!name) return;

  addBarbeiro({
    name,
    phone: "(Novo)",
    commission: commission ? `${commission}%` : "50%",
    special: "Cortes em Geral",
    status: "Ativo"
  });

  revalidatePath('/dashboard/barbeiros');
}

export async function createServicoAction(formData: FormData) {
  const name = formData.get('sname') as string;
  const time = formData.get('stime') as string;
  const price = formData.get('sprice') as string;

  if (!name) return;

  addServico({
    name,
    time: time ? `${time} min` : "30 min",
    price: price || "R$ 30,00",
    active: true
  });

  revalidatePath('/dashboard/servicos');
}

export async function createProdutoAction(formData: FormData) {
  const p = formData.get('pname') as string;
  const cost = formData.get('pcost') as string;
  const sell = formData.get('psell') as string;

  if (!p) return;

  addProduto({
    p,
    q: 10, // Default estoque novo
    cost: cost || "R$ 10,00",
    sell: sell || "R$ 30,00"
  });

  revalidatePath('/dashboard/produtos');
}
