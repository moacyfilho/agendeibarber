// GLOBAL MOCK DB PARA DESENVOLVIMENTO ÁGIL
// Em produção, isso é trocado diretamente pelo PrismaClient ligado ao PostgreSQL.

const globalDb = global as any;

if (!globalDb.db) {
  globalDb.db = {
    clientes: [
      { id: 1, name: "Marcos Silva", phone: "(11) 98888-7777", points: 150, lastVisit: "Ontem", status: "VIP" },
      { id: 2, name: "Jonas Oliveira", phone: "(11) 99999-5555", points: 80, lastVisit: "Semana Passada", status: "Regular" },
    ],
    barbeiros: [
      { id: 1, name: "Lucas 'Navalha'", phone: "(11) 91111-2222", commission: "45%", special: "Degradê e Freestyle", status: "Ativo" },
      { id: 2, name: "Felipe 'Fade'", phone: "(11) 92222-3333", commission: "50%", special: "Barboterapia", status: "Férias" },
    ],
    servicos: [
      { id: 1, name: "Corte na Tesoura", time: "45 min", price: "R$ 45,00", active: true },
      { id: 2, name: "Barba Desenhada", time: "30 min", price: "R$ 35,00", active: true },
    ],
    produtos: [
      { id: 1, p: "Pomada Modeladora", q: 12, cost: "R$ 15,00", sell: "R$ 45,00" },
      { id: 2, p: "Óleo para Barba", q: 3, cost: "R$ 20,00", sell: "R$ 55,00" },
    ]
  };
}

export const getClientes = () => globalDb.db.clientes;
export const addCliente = (data: any) => globalDb.db.clientes.unshift({ id: Date.now(), ...data });

export const getBarbeiros = () => globalDb.db.barbeiros;
export const addBarbeiro = (data: any) => globalDb.db.barbeiros.unshift({ id: Date.now(), ...data });

export const getServicos = () => globalDb.db.servicos;
export const addServico = (data: any) => globalDb.db.servicos.unshift({ id: Date.now(), ...data });

export const getProdutos = () => globalDb.db.produtos;
export const addProduto = (data: any) => globalDb.db.produtos.unshift({ id: Date.now(), ...data });
