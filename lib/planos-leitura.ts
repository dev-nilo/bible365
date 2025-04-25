import { planoDeLeitura } from "./plano-leitura"

// Tipos e interfaces
export type PlanoLeitura = Record<string, Record<string, string[]>>

export interface PlanoMetadata {
  id: string
  nome: string
  descricao: string
  tipoSequencia: "mensal" | "continua" | "cronologica"
}

// Função para converter plano mensal em sequencial
export function converterParaPlanoSequencial(planoMensal: PlanoLeitura): PlanoLeitura {
  const planoSequencial: PlanoLeitura = { "1": {} }
  let diaSequencial = 1

  // Percorrer todos os meses e dias do plano mensal
  Object.keys(planoMensal).forEach((mes) => {
    Object.keys(planoMensal[mes]).forEach((dia) => {
      // Adicionar as leituras do dia ao plano sequencial
      planoSequencial["1"][diaSequencial.toString()] = planoMensal[mes][dia]
      diaSequencial++
    })
  })

  return planoSequencial
}

// Planos de leitura disponíveis
export const planoMCheyne: PlanoLeitura = planoDeLeitura

export const planoMCheyneSequencial: PlanoLeitura = converterParaPlanoSequencial(planoMCheyne)

// Plano de leitura cronológica (exemplo simplificado)
export const planoCronologico: PlanoLeitura = {
  "1": {
    "1": ["Gn 1-3", "Jó 1-2"],
    "2": ["Gn 4-7", "Jó 3-5"],
    "3": ["Gn 8-11", "Jó 6-9"],
    "4": ["Gn 12-15", "Jó 10-13"],
    "5": ["Gn 16-18", "Jó 14-16"],
    // ... outros dias
  },
  "2": {
    "1": ["Gn 19-21", "Jó 17-19"],
    "2": ["Gn 22-24", "Jó 20-23"],
    // ... outros dias
  },
  // ... outros meses
}

// Plano de leitura capa-a-capa (exemplo simplificado)
export const planoCapaACapa: PlanoLeitura = {
  "1": {
    "1": ["Gn 1-3"],
    "2": ["Gn 4-7"],
    "3": ["Gn 8-11"],
    "4": ["Gn 12-15"],
    "5": ["Gn 16-18"],
    // ... outros dias
  },
  "2": {
    "1": ["Gn 19-21"],
    "2": ["Gn 22-24"],
    // ... outros dias
  },
  // ... outros meses
}

// Lista de planos disponíveis
export const planosDisponiveis: PlanoMetadata[] = [
  {
    id: "mcheyne",
    nome: "M'Cheyne (Mensal)",
    descricao: "Plano tradicional com 4 leituras diárias",
    tipoSequencia: "mensal",
  },
  {
    id: "mcheyne-sequencial",
    nome: "M'Cheyne (Sequencial)",
    descricao: "Plano contínuo do dia 1 ao 365",
    tipoSequencia: "continua",
  },
  {
    id: "cronologico",
    nome: "Cronológico",
    descricao: "Leitura na ordem dos eventos",
    tipoSequencia: "cronologica",
  },
  {
    id: "capa-a-capa",
    nome: "Capa a Capa",
    descricao: "Leitura do início ao fim da Bíblia",
    tipoSequencia: "continua",
  },
]

// Função para obter o plano de leitura com base no ID
export function getPlanoLeitura(planoId: string): PlanoLeitura {
  console.log("getPlanoLeitura: Carregando plano:", planoId)

  // Verificar se o ID do plano é válido
  if (!planoId) {
    console.warn("getPlanoLeitura: ID do plano não fornecido, usando plano padrão")
    return planoMCheyne
  }

  switch (planoId) {
    case "mcheyne":
      return planoMCheyne
    case "mcheyne-sequencial":
      return planoMCheyneSequencial
    case "cronologico":
      return planoCronologico
    case "capa-a-capa":
      return planoCapaACapa
    default:
      console.warn(`getPlanoLeitura: Plano '${planoId}' não encontrado, usando plano padrão`)
      return planoMCheyne
  }
}

// Função para obter os metadados do plano com base no ID
export function getPlanoMetadata(planoId: string): PlanoMetadata | undefined {
  const metadata = planosDisponiveis.find((plano) => plano.id === planoId)
  console.log("getPlanoMetadata:", planoId, "->", metadata)
  return metadata
}

// Função para obter o dia do ano atual (1-365)
export function getDiaDoAno(): number {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - startOfYear.getTime()
  const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000)) + 1
  return Math.min(dayOfYear, 365)
}

// Função para obter as leituras de um dia específico
export function getLeituraDoDia(planoId: string, dia: number): { leituras: string[]; totalDias: number } {
  const plano = getPlanoLeitura(planoId)

  // Para planos sequenciais (todos os dias estão no mês "1")
  if (plano["1"] && plano["1"][dia.toString()]) {
    return {
      leituras: plano["1"][dia.toString()],
      totalDias: Object.keys(plano["1"]).length,
    }
  }

  // Para planos mensais, calcular o mês e dia correspondentes
  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let diaAcumulado = 0

  for (let mes = 1; mes <= 12; mes++) {
    const diasNoMes = diasPorMes[mes - 1]
    if (diaAcumulado + diasNoMes >= dia) {
      const diaDoMes = dia - diaAcumulado
      if (plano[mes.toString()] && plano[mes.toString()][diaDoMes.toString()]) {
        return {
          leituras: plano[mes.toString()][diaDoMes.toString()],
          totalDias: 365,
        }
      }
      break
    }
    diaAcumulado += diasNoMes
  }

  // Se não encontrar, retornar array vazio
  return { leituras: [], totalDias: 365 }
}
