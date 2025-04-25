// Definição dos tipos
interface PlanoLeitura {
  [mes: string]: {
    [dia: string]: string[]
  }
}

interface PlanoMetadata {
  id: string
  nome: string
  tipoSequencia: "continua" | "mensal"
  descricao: string
}

// Declaração dos planos de leitura
const planoCapaACapa: PlanoLeitura = {
  "2": {
    "1": ["1Sm 28-31", "1Cr 9-11", "Jó 21-25"],
    "2": ["2Sm 1-3", "1Cr 12-15", "Jó 26-28"],
    "3": ["2Sm 4-7", "1Cr 16-18", "Jó 29-31"],
    "4": ["2Sm 8-11", "1Cr 19-22", "Jó 32-34"],
    "5": ["2Sm 12-14", "1Cr 23-25", "Jó 35-27"],
    "6": ["2Sm 15-17", "1Cr 26-29", "Jó 38-40"],
    "7": ["2Sm 18-19", "2Cr 1-4", "Jó 41-42"],
    "8": ["2Sm 20-22", "2Cr 5-7", "Sl 1-7"],
    "9": ["2Sm 23-24", "2Cr 8-11", "Sl 8-14"],
    "10": ["1Re 1-2", "2Cr 12-15", "Sl 15-18"],
    "11": ["1Re 3-5", "2Cr 16-19", "Sl 19-23"],
    "12": ["1Re 6-7", "2Cr 20-23", "Sl 24-29"],
    "13": ["1Re 8-9", "2Cr 24-26", "Sl 30-34"],
    "14": ["1Re 10-11", "2Cr 27-29", "Sl 35-37"],
    "15": ["1Re 12-14", "2Cr 30-32", "Sl 38-42"],
    "16": ["1Re 15-17", "2Cr 33-36", "Sl 43-48"],
    "17": ["1Re 18-20", "Ed 1-2", "Sl 48-53"],
    "18": ["1Re 21-22", "Ed 3-6", "Sl 54-59"],
    "19": ["2Re 1-4", "Ed 7-10", "Sl 60-66"],
    "20": ["2Re 5-7", "Ne 1-4", "Sl 67-69"],
    "21": ["2Re 8-10", "Ne 6-7", "Sl 70-73"],
    "22": ["2Re 11-14", "Ne 8-10", "Sl 74-78"],
    "23": ["2Re 15-17", "Ne 11-13", "Sl 78-83"],
    "24": ["2Re 18-19", "Et 1-4", "Sl 84-89"],
    "25": ["2Re 20-23", "Et 5-10", "Sl 90-94"],
    "26": ["2Re 24-25", "Jó 1-2", "Sl 95-102"],
    "27": ["1Cr 1-2", "Jó 3-5", "Sl 103-105"],
    "28": ["1Cr 3-5", "Jó 6-8", "Sl 106-107"],
    "29": ["1Cr 6", "Jó 9-11", "Sl 108-113"],
  },
  "3": {
    "1": ["1Cr 7-8", "Jó 12-15", "Sl 114-118"],
    "2": ["Sl 119", "Is 41-43", "Ez 31-33"],
    "3": ["Sl 120-130", "Is 44-47", "Ez 34-36"],
    "4": ["Sl 131-136", "Is 48-51", "Ez 37-39"],
    "5": ["Sl 137-143", "Is 52-57", "Ez 40-42"],
    "6": ["Sl 144-148", "Is 58-62", "Ez 43-45"],
    "7": ["Sl 149-150", "Is 63-66", "Ez 46-48"],
    "8": ["Pv 1-3", "Jr 1-3", "Dn 1-3"],
    "9": ["Pv 4-6", "Jr 4-6", "Dn 4-6"],
    "10": ["Pv 7-9", "Jr 7-9", "Dn 7-9"],
    "11": ["Pv 10-12", "Jr 10-13", "Dn 10-12"],
    "12": ["Pv 13-15", "Jr 14-17", "Os 1-5"],
    "13": ["Pv 16-18", "Jr 18-22", "Os 6-10"],
    "14": ["Pv 19-21", "Jr 23-25", "Os 11-14"],
    "15": ["Pv 22-24", "Jr 26-29", "Jl 1-3"],
    "16": ["Pv 25-27", "Jr 30-32", "Am 1-5"],
    "17": ["Pv 28-31", "Jr 33-36", "Am 6-9"],
    "18": ["Ec 1-4", "Jr 37-40", "Ob 1"],
    "19": ["Ec 5-8", "Jr 41-44", "Jn 1-4"],
    "20": ["Ec 9-12", "Jr 45-48", "Mq 1-7"],
    "21": ["Ct 1-5", "Jr 49-50", "Na 1-3"],
    "22": ["Ct 6-8", "Jr 51-52", "Hc 1-3"],
    "23": ["Is 1-3", "Lm 1-3", "Sf 1-3"],
    "24": ["Is 4-7", "Lm 4-5", "Ag 1-2"],
    "25": ["Is 8-10", "Ez 1-4", "Zc 1-6"],
    "26": ["Is 11-14", "Ez 5-8", "Zc 7-11"],
    "27": ["Is 15-20", "Ez 9-12", "Zc 12-14"],
    "28": ["Is 21-24", "Ez 13-16", "Ml 1-4"],
    "29": ["Is 25-28", "Ez 17-20", "Mt 1-4"],
    "30": ["Is 29-32", "Ez 21-23", "Mt5-6"],
    "31": ["Is 33-36", "Ez 24-27", "Mt 7-9"],
  },
  "4": {
    "1": ["Is 37-40", "Ez 28-30", "Mt 10-11"],
    "2": ["Mt 12-13", "Jo 7-8", "Gl 1-3"],
    "3": ["Mt 14-15", "Jo 9-10", "Gl 4-6"],
    "4": ["Mt 16-18", "Jo 11-12", "Ef 1-4"],
    "5": ["Mt 19-21", "Jo 13-15", "Ef 5-6"],
    "6": ["Mt 22-23", "Jo 16-18", "Fp 1-4"],
    "7": ["Mt 24-25", "Jo 19-21", "Cl 1-4"],
    "8": ["Mt 26", "At 1-2", "1Ts 1-5"],
    "9": ["Mt 27-28", "At 3-5", "2Ts 1-3"],
    "10": ["Mc 1-2", "At 6-7", "1Tm 1-6"],
    "11": ["Mc 3-4", "At 8-9", "2Tm 1-4"],
    "12": ["Mc 5-6", "At 10-11", "Tt 1-3"],
    "13": ["Mc 7-8", "At 12-13", "Fm 1"],
    "14": ["Mc 9-10", "At 14-16", "Hb 1-5"],
    "15": ["Mc 11-12", "At 17-19", "Hb 6-9"],
    "16": ["Mc 13-14", "At 20-21", "Hb 10-11"],
    "17": ["Mc 15-16", "At 22-24", "Hb 12-13"],
    "18": ["Lc 1", "At 25-28", "Tg 1-5"],
    "19": ["Lc 2-3", "Rm 1-3", "1Pe 1-3"],
    "20": ["Lc 4-5", "Rm 4-7", "1Pe 4-5"],
    "21": ["Lc 6-7", "Rm 8-9", "2Pe 1-3"],
    "22": ["Lc 8-9", "Rm 10-12", "1Jo 1-5"],
    "23": ["Lc 10-11", "Rm 13-16", "2Jo 1"],
    "24": ["Lc 12-13", "1Co 1-4", "3Jo 1"],
    "25": ["Lc 14-16", "1Co 5-7", "Jd 1"],
    "26": ["Lc 17-18", "1Co 8-10", "Ap 1-4"],
    "27": ["Lc 19-20", "1Co 11-13", "Ap 5-9"],
    "28": ["Lc 21-22", "1Co 14-16", "Ap 10-14"],
    "29": ["Lc 23-24", "2Co 1-4", "Ap 15-19"],
    "30": ["Jo 1-2", "2Cp 5-8", "Ap 20-22"],
  },
}

const planoCronologico: PlanoLeitura = {
  "1": {
    "1": ["Gn 1-2"],
    "2": ["Gn 3-5"],
    "3": ["Gn 6-8"],
    "4": ["Gn 9-11"],
    "5": ["Gn 12-14"],
    "6": ["Gn 15-17"],
    "7": ["Gn 18-20"],
    "8": ["Gn 21-23"],
    "9": ["Gn 24-26"],
    "10": ["Gn 27-29"],
    "11": ["Gn 30-32"],
    "12": ["Gn 33-35"],
    "13": ["Gn 36-38"],
    "14": ["Gn 39-41"],
    "15": ["Gn 42-44"],
    "16": ["Gn 45-47"],
    "17": ["Gn 48-50"],
    "18": ["Jó 1-3"],
    "19": ["Jó 4-6"],
    "20": ["Jó 7-9"],
    "21": ["Jó 10-12"],
    "22": ["Jó 13-15"],
    "23": ["Jó 16-18"],
    "24": ["Jó 19-21"],
    "25": ["Jó 22-24"],
    "26": ["Jó 25-27"],
    "27": ["Jó 28-30"],
    "28": ["Jó 31-33"],
    "29": ["Jó 34-36"],
    "30": ["Jó 37-39"],
    "31": ["Jó 40-42"],
  },
  "2": {
    "1": ["Êx 1-3"],
    "2": ["Êx 4-6"],
    "3": ["Êx 7-9"],
    "4": ["Êx 10-12"],
    "5": ["Êx 13-15"],
    "6": ["Êx 16-18"],
    "7": ["Êx 19-21"],
    "8": ["Êx 22-24"],
    "9": ["Êx 25-27"],
    "10": ["Êx 28-30"],
    "11": ["Êx 31-33"],
    "12": ["Êx 34-36"],
    "13": ["Êx 37-39"],
    "14": ["Êx 40", "Lv 1-3"],
    "15": ["Lv 4-6"],
    "16": ["Lv 7-9"],
    "17": ["Lv 10-12"],
    "18": ["Lv 13-15"],
    "19": ["Lv 16-18"],
    "20": ["Lv 19-21"],
    "21": ["Lv 22-24"],
    "22": ["Lv 25-27"],
    "23": ["Nm 1-3"],
    "24": ["Nm 4-6"],
    "25": ["Nm 7"],
    "26": ["Nm 8-10"],
    "27": ["Nm 11-13"],
    "28": ["Nm 14-16"],
  },
  "3": {
    "1": ["Nm 17-19"],
    "2": ["Nm 20-22"],
    "3": ["Nm 23-25"],
    "4": ["Nm 26-28"],
    "5": ["Nm 29-31"],
    "6": ["Nm 32-34"],
    "7": ["Nm 35-36", "Dt 1-3"],
    "8": ["Dt 4-6"],
    "9": ["Dt 7-9"],
    "10": ["Dt 10-12"],
    "11": ["Dt 13-15"],
    "12": ["Dt 16-18"],
    "13": ["Dt 19-21"],
    "14": ["Dt 22-24"],
    "15": ["Dt 25-27"],
    "16": ["Dt 28-30"],
    "17": ["Dt 31-34"],
    "18": ["Js 1-3"],
    "19": ["Js 4-6"],
    "20": ["Js 7-9"],
    "21": ["Js 10-12"],
    "22": ["Js 13-15"],
    "23": ["Js 16-18"],
    "24": ["Js 19-21"],
    "25": ["Js 22-24"],
    "26": ["Jz 1-3"],
    "27": ["Jz 4-6"],
    "28": ["Jz 7-9"],
    "29": ["Jz 10-12"],
    "30": ["Jz 13-15"],
    "31": ["Jz 16-18"],
  },
  "4": {
    "1": ["Jz 19-21"],
    "2": ["Rt 1-4"],
    "3": ["1Sm 1-3"],
    "4": ["1Sm 4-6"],
    "5": ["1Sm 7-9"],
    "6": ["1Sm 10-12"],
    "7": ["1Sm 13-15"],
    "8": ["1Sm 16-18"],
    "9": ["1Sm 19-21"],
    "10": ["1Sm 22-24"],
    "11": ["1Sm 25-27"],
    "12": ["1Sm 28-31"],
    "13": ["2Sm 1-3"],
    "14": ["2Sm 4-6"],
    "15": ["2Sm 7-9"],
    "16": ["2Sm 10-12"],
    "17": ["2Sm 13-15"],
    "18": ["2Sm 16-18"],
    "19": ["2Sm 19-21"],
    "20": ["2Sm 22-24"],
    "21": ["1Rs 1-3"],
    "22": ["1Rs 4-6"],
    "23": ["1Rs 7-9"],
    "24": ["1Rs 10-12"],
    "25": ["1Rs 13-15"],
    "26": ["1Rs 16-18"],
    "27": ["1Rs 19-21"],
    "28": ["1Rs 22", "2Rs 1-3"],
    "29": ["2Rs 4-6"],
    "30": ["2Rs 7-9"],
  },
}

function getPlanoCheyne(): PlanoLeitura {
  return {
    "1": {
      "1": ["Gn 1", "Mt 1", "Es 1", "At 1"],
      "2": ["Gn 2", "Mt 2", "Es 2", "At 2"],
      "3": ["Gn 3", "Mt 3", "Es 3", "At 3"],
      "4": ["Gn 4", "Mt 4", "Es 4", "At 4"],
      "5": ["Gn 5", "Mt 5", "Es 5", "At 5"],
      "6": ["Gn 6", "Mt 6", "Sl 1", "At 6"],
      "7": ["Gn 7", "Mt 7", "Sl 2", "At 7"],
      "8": ["Gn 8", "Mt 8", "Sl 3", "At 8"],
      "9": ["Gn 9", "Mt 9", "Sl 4", "At 9"],
      "10": ["Gn 10", "Mt 10", "Sl 5", "At 10"],
      "11": ["Gn 11", "Mt 11", "Sl 6", "At 11"],
      "12": ["Gn 12", "Mt 12", "Sl 7", "At 12"],
      "13": ["Gn 13", "Mt 13", "Sl 8", "At 13"],
      "14": ["Gn 14", "Mt 14", "Sl 9", "At 14"],
      "15": ["Gn 15", "Mt 15", "Sl 10", "At 15"],
      "16": ["Gn 16", "Mt 16", "Sl 11", "At 16"],
      "17": ["Gn 17", "Mt 17", "Sl 12", "At 17"],
      "18": ["Gn 18", "Mt 18", "Sl 13", "At 18"],
      "19": ["Gn 19", "Mt 19", "Sl 14", "At 19"],
      "20": ["Gn 20", "Mt 20", "Sl 15", "At 20"],
      "21": ["Gn 21", "Mt 21", "Sl 16", "At 21"],
      "22": ["Gn 22", "Mt 22", "Sl 17", "At 22"],
      "23": ["Gn 23", "Mt 23", "Sl 18", "At 23"],
      "24": ["Gn 24", "Mt 24", "Sl 19", "At 24"],
      "25": ["Gn 25", "Mt 25", "Sl 20", "At 25"],
      "26": ["Gn 26", "Mt 26", "Sl 21", "At 26"],
      "27": ["Gn 27", "Mt 27", "Sl 22", "At 27"],
      "28": ["Gn 28", "Mt 28", "Sl 23", "At 28"],
      "29": ["Gn 29", "Mc 1", "Sl 24", "At 29"],
      "30": ["Gn 30", "Mc 2", "Sl 25", "At 30"],
      "31": ["Gn 31", "Mc 3", "Sl 26", "At 31"],
    },
  }
}

const planosDisponiveis: PlanoMetadata[] = [
  {
    id: "mcheyne",
    nome: "M'Cheyne",
    tipoSequencia: "mensal",
    descricao: "Um plano clássico com leituras diárias do Antigo e Novo Testamento.",
  },
  {
    id: "cronologico",
    nome: "Cronológico",
    tipoSequencia: "mensal",
    descricao: "Organiza a leitura da Bíblia na ordem em que os eventos ocorreram.",
  },
  {
    id: "capa-a-capa",
    nome: "Capa a Capa",
    tipoSequencia: "continua",
    descricao: "Um plano de leitura contínua para ler a Bíblia do início ao fim.",
  },
]

// Continuação do plano Capa-a-Capa
export const planoCapaACapaContinuacao: PlanoLeitura = {
  "2": {
    "1": ["1Sm 28-31", "1Cr 9-11", "Jó 21-25"],
    "2": ["2Sm 1-3", "1Cr 12-15", "Jó 26-28"],
    "3": ["2Sm 4-7", "1Cr 16-18", "Jó 29-31"],
    "4": ["2Sm 8-11", "1Cr 19-22", "Jó 32-34"],
    "5": ["2Sm 12-14", "1Cr 23-25", "Jó 35-27"],
    "6": ["2Sm 15-17", "1Cr 26-29", "Jó 38-40"],
    "7": ["2Sm 18-19", "2Cr 1-4", "Jó 41-42"],
    "8": ["2Sm 20-22", "2Cr 5-7", "Sl 1-7"],
    "9": ["2Sm 23-24", "2Cr 8-11", "Sl 8-14"],
    "10": ["1Re 1-2", "2Cr 12-15", "Sl 15-18"],
    "11": ["1Re 3-5", "2Cr 16-19", "Sl 19-23"],
    "12": ["1Re 6-7", "2Cr 20-23", "Sl 24-29"],
    "13": ["1Re 8-9", "2Cr 24-26", "Sl 30-34"],
    "14": ["1Re 10-11", "2Cr 27-29", "Sl 35-37"],
    "15": ["1Re 12-14", "2Cr 30-32", "Sl 38-42"],
    "16": ["1Re 15-17", "2Cr 33-36", "Sl 43-48"],
    "17": ["1Re 18-20", "Ed 1-2", "Sl 48-53"],
    "18": ["1Re 21-22", "Ed 3-6", "Sl 54-59"],
    "19": ["2Re 1-4", "Ed 7-10", "Sl 60-66"],
    "20": ["2Re 5-7", "Ne 1-4", "Sl 67-69"],
    "21": ["2Re 8-10", "Ne 6-7", "Sl 70-73"],
    "22": ["2Re 11-14", "Ne 8-10", "Sl 74-78"],
    "23": ["2Re 15-17", "Ne 11-13", "Sl 78-83"],
    "24": ["2Re 18-19", "Et 1-4", "Sl 84-89"],
    "25": ["2Re 20-23", "Et 5-10", "Sl 90-94"],
    "26": ["2Re 24-25", "Jó 1-2", "Sl 95-102"],
    "27": ["1Cr 1-2", "Jó 3-5", "Sl 103-105"],
    "28": ["1Cr 3-5", "Jó 6-8", "Sl 106-107"],
    "29": ["1Cr 6", "Jó 9-11", "Sl 108-113"],
  },
  "3": {
    "1": ["1Cr 7-8", "Jó 12-15", "Sl 114-118"],
    "2": ["Sl 119", "Is 41-43", "Ez 31-33"],
    "3": ["Sl 120-130", "Is 44-47", "Ez 34-36"],
    "4": ["Sl 131-136", "Is 48-51", "Ez 37-39"],
    "5": ["Sl 137-143", "Is 52-57", "Ez 40-42"],
    "6": ["Sl 144-148", "Is 58-62", "Ez 43-45"],
    "7": ["Sl 149-150", "Is 63-66", "Ez 46-48"],
    "8": ["Pv 1-3", "Jr 1-3", "Dn 1-3"],
    "9": ["Pv 4-6", "Jr 4-6", "Dn 4-6"],
    "10": ["Pv 7-9", "Jr 7-9", "Dn 7-9"],
    "11": ["Pv 10-12", "Jr 10-13", "Dn 10-12"],
    "12": ["Pv 13-15", "Jr 14-17", "Os 1-5"],
    "13": ["Pv 16-18", "Jr 18-22", "Os 6-10"],
    "14": ["Pv 19-21", "Jr 23-25", "Os 11-14"],
    "15": ["Pv 22-24", "Jr 26-29", "Jl 1-3"],
    "16": ["Pv 25-27", "Jr 30-32", "Am 1-5"],
    "17": ["Pv 28-31", "Jr 33-36", "Am 6-9"],
    "18": ["Ec 1-4", "Jr 37-40", "Ob 1"],
    "19": ["Ec 5-8", "Jr 41-44", "Jn 1-4"],
    "20": ["Ec 9-12", "Jr 45-48", "Mq 1-7"],
    "21": ["Ct 1-5", "Jr 49-50", "Na 1-3"],
    "22": ["Ct 6-8", "Jr 51-52", "Hc 1-3"],
    "23": ["Is 1-3", "Lm 1-3", "Sf 1-3"],
    "24": ["Is 4-7", "Lm 4-5", "Ag 1-2"],
    "25": ["Is 8-10", "Ez 1-4", "Zc 1-6"],
    "26": ["Is 11-14", "Ez 5-8", "Zc 7-11"],
    "27": ["Is 15-20", "Ez 9-12", "Zc 12-14"],
    "28": ["Is 21-24", "Ez 13-16", "Ml 1-4"],
    "29": ["Is 25-28", "Ez 17-20", "Mt 1-4"],
    "30": ["Is 29-32", "Ez 21-23", "Mt5-6"],
    "31": ["Is 33-36", "Ez 24-27", "Mt 7-9"],
  },
  "4": {
    "1": ["Is 37-40", "Ez 28-30", "Mt 10-11"],
    "2": ["Mt 12-13", "Jo 7-8", "Gl 1-3"],
    "3": ["Mt 14-15", "Jo 9-10", "Gl 4-6"],
    "4": ["Mt 16-18", "Jo 11-12", "Ef 1-4"],
    "5": ["Mt 19-21", "Jo 13-15", "Ef 5-6"],
    "6": ["Mt 22-23", "Jo 16-18", "Fp 1-4"],
    "7": ["Mt 24-25", "Jo 19-21", "Cl 1-4"],
    "8": ["Mt 26", "At 1-2", "1Ts 1-5"],
    "9": ["Mt 27-28", "At 3-5", "2Ts 1-3"],
    "10": ["Mc 1-2", "At 6-7", "1Tm 1-6"],
    "11": ["Mc 3-4", "At 8-9", "2Tm 1-4"],
    "12": ["Mc 5-6", "At 10-11", "Tt 1-3"],
    "13": ["Mc 7-8", "At 12-13", "Fm 1"],
    "14": ["Mc 9-10", "At 14-16", "Hb 1-5"],
    "15": ["Mc 11-12", "At 17-19", "Hb 6-9"],
    "16": ["Mc 13-14", "At 20-21", "Hb 10-11"],
    "17": ["Mc 15-16", "At 22-24", "Hb 12-13"],
    "18": ["Lc 1", "At 25-28", "Tg 1-5"],
    "19": ["Lc 2-3", "Rm 1-3", "1Pe 1-3"],
    "20": ["Lc 4-5", "Rm 4-7", "1Pe 4-5"],
    "21": ["Lc 6-7", "Rm 8-9", "2Pe 1-3"],
    "22": ["Lc 8-9", "Rm 10-12", "1Jo 1-5"],
    "23": ["Lc 10-11", "Rm 13-16", "2Jo 1"],
    "24": ["Lc 12-13", "1Co 1-4", "3Jo 1"],
    "25": ["Lc 14-16", "1Co 5-7", "Jd 1"],
    "26": ["Lc 17-18", "1Co 8-10", "Ap 1-4"],
    "27": ["Lc 19-20", "1Co 11-13", "Ap 5-9"],
    "28": ["Lc 21-22", "1Co 14-16", "Ap 10-14"],
    "29": ["Lc 23-24", "2Co 1-4", "Ap 15-19"],
    "30": ["Jo 1-2", "2Cp 5-8", "Ap 20-22"],
  },
}

// Função para obter o plano selecionado
export function getPlanoLeitura(planoId: string): PlanoLeitura {
  switch (planoId) {
    case "mcheyne":
      return getPlanoCheyne()
    case "cronologico":
      return planoCronologico
    case "capa-a-capa":
      return planoCapaACapa
    default:
      return getPlanoCheyne() // Plano padrão
  }
}

// Função para obter os metadados do plano selecionado
export function getPlanoMetadata(planoId: string): PlanoMetadata | undefined {
  return planosDisponiveis.find((plano) => plano.id === planoId)
}

// Função para converter um plano mensal em uma sequência contínua
export function converterParaSequenciaContinua(plano: PlanoLeitura): { dia: string; leituras: string[] }[] {
  const sequencia: { dia: string; leituras: string[] }[] = []
  let diaAtual = 1

  // Percorrer todos os meses e dias do plano
  Object.keys(plano).forEach((mes) => {
    Object.keys(plano[mes]).forEach((dia) => {
      sequencia.push({
        dia: diaAtual.toString(),
        leituras: plano[mes][dia],
      })
      diaAtual++
    })
  })

  return sequencia
}

// Função para obter a leitura do dia atual em um plano contínuo
export function getLeituraDoDia(
  planoId: string,
  diaDoAno: number,
): { leituras: string[]; dia: string; totalDias: number } {
  const plano = getPlanoLeitura(planoId)
  const metadata = getPlanoMetadata(planoId)

  if (metadata?.tipoSequencia === "continua") {
    // Para planos contínuos, converter para sequência e pegar o dia correspondente
    const sequencia = converterParaSequenciaContinua(plano)
    const diaIndex = Math.min(diaDoAno - 1, sequencia.length - 1)

    return {
      leituras: sequencia[diaIndex].leituras,
      dia: sequencia[diaIndex].dia,
      totalDias: sequencia.length,
    }
  } else {
    // Para planos mensais, calcular o mês e dia atual
    const data = new Date()
    const mes = (data.getMonth() + 1).toString()
    const dia = data.getDate().toString()

    // Verificar se o mês e dia existem no plano
    if (plano[mes] && plano[mes][dia]) {
      return {
        leituras: plano[mes][dia],
        dia,
        totalDias: 365, // Aproximadamente um ano
      }
    } else {
      // Caso não exista, retornar o primeiro dia do plano
      const primeiroMes = Object.keys(plano)[0]
      const primeiroDia = Object.keys(plano[primeiroMes])[0]

      return {
        leituras: plano[primeiroMes][primeiroDia],
        dia: primeiroDia,
        totalDias: 365,
      }
    }
  }
}

// Função para calcular o dia do ano
export function getDiaDoAno(data: Date = new Date()): number {
  const inicioAno = new Date(data.getFullYear(), 0, 0)
  const diff = data.getTime() - inicioAno.getTime()
  const umDia = 1000 * 60 * 60 * 24
  return Math.floor(diff / umDia)
}
