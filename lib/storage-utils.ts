/**
 * Utilitários para gerenciar o armazenamento local de forma segura
 */

// Chave usada para armazenar o progresso de leitura
const STORAGE_KEY = "bibliaProgress"
// Chave para armazenar o plano selecionado
const PLANO_KEY = "bibliaPlanoSelecionado"

// Tipo para o progresso de leitura
export type ReadingProgress = Record<string, boolean>

/**
 * Verifica se o localStorage está disponível
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__"
    localStorage.setItem(testKey, testKey)
    const result = localStorage.getItem(testKey) === testKey
    localStorage.removeItem(testKey)
    return result
  } catch (e) {
    console.error("localStorage não está disponível:", e)
    return false
  }
}

/**
 * Valida se o objeto de progresso tem o formato esperado
 */
export function isValidProgressData(data: any): data is ReadingProgress {
  // Verificar se é um objeto
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false
  }

  // Verificar se todas as chaves têm o formato esperado (mês-dia-índice)
  // e todos os valores são booleanos
  for (const key in data) {
    // Verificar formato da chave: deve ser algo como "1-1-0"
    if (!/^\d+-\d+-\d+$/.test(key)) {
      return false
    }

    // Verificar se o valor é booleano
    if (typeof data[key] !== "boolean") {
      return false
    }
  }

  return true
}

/**
 * Carrega o progresso de leitura do localStorage com validação
 */
export function loadReadingProgress(): ReadingProgress {
  try {
    // Verificar se o localStorage está disponível
    if (!isLocalStorageAvailable()) {
      console.warn("loadReadingProgress: LocalStorage não está disponível. Usando dados vazios.")
      return {}
    }

    // Tentar carregar os dados
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (!savedData) {
      console.log("loadReadingProgress: Nenhum dado encontrado no localStorage")
      return {}
    }

    // Tentar fazer o parse dos dados
    const parsedData = JSON.parse(savedData)

    // Validar os dados
    if (!isValidProgressData(parsedData)) {
      console.warn("loadReadingProgress: Dados de progresso inválidos encontrados. Usando dados vazios.")
      return {}
    }

    console.log(`loadReadingProgress: Carregados ${Object.keys(parsedData).length} itens de progresso`)
    return parsedData
  } catch (error) {
    console.error("loadReadingProgress: Erro ao carregar progresso:", error)
    return {}
  }
}

/**
 * Salva o progresso de leitura no localStorage com validação
 */
export function saveReadingProgress(progress: ReadingProgress): boolean {
  try {
    // Verificar se o localStorage está disponível
    if (!isLocalStorageAvailable()) {
      console.warn("saveReadingProgress: LocalStorage não está disponível. Não foi possível salvar o progresso.")
      return false
    }

    // Validar os dados antes de salvar
    if (!isValidProgressData(progress)) {
      console.error("saveReadingProgress: Tentativa de salvar dados de progresso inválidos.")
      return false
    }

    // Salvar os dados
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    console.log(`saveReadingProgress: Salvos ${Object.keys(progress).length} itens de progresso`)
    return true
  } catch (error) {
    console.error("saveReadingProgress: Erro ao salvar progresso:", error)
    return false
  }
}

/**
 * Limpa o progresso de leitura do localStorage
 */
export function clearReadingProgress(): boolean {
  try {
    // Verificar se o localStorage está disponível
    if (!isLocalStorageAvailable()) {
      console.warn("clearReadingProgress: LocalStorage não está disponível. Não foi possível limpar o progresso.")
      return false
    }

    // Limpar os dados
    localStorage.removeItem(STORAGE_KEY)
    console.log("clearReadingProgress: Progresso limpo com sucesso")
    return true
  } catch (error) {
    console.error("clearReadingProgress: Erro ao limpar progresso:", error)
    return false
  }
}

/**
 * Salva o plano de leitura selecionado
 */
export function savePlanoSelecionado(planoId: string): boolean {
  try {
    console.log("savePlanoSelecionado: Tentando salvar plano:", planoId)

    if (!isLocalStorageAvailable()) {
      console.warn(
        "savePlanoSelecionado: LocalStorage não está disponível. Não foi possível salvar o plano selecionado.",
      )
      return false
    }

    // Salvar os dados
    localStorage.setItem(PLANO_KEY, planoId)
    console.log("savePlanoSelecionado: Plano salvo com sucesso:", planoId)
    return true
  } catch (error) {
    console.error("savePlanoSelecionado: Erro ao salvar plano selecionado:", error)
    return false
  }
}

/**
 * Carrega o plano de leitura selecionado
 */
export function loadPlanoSelecionado(): string | null {
  try {
    console.log("loadPlanoSelecionado: Tentando carregar plano selecionado")

    if (!isLocalStorageAvailable()) {
      console.warn("loadPlanoSelecionado: LocalStorage não está disponível. Usando plano padrão.")
      return null
    }

    // Tentar carregar os dados
    const planoId = localStorage.getItem(PLANO_KEY)
    console.log("loadPlanoSelecionado: Plano carregado:", planoId)
    return planoId
  } catch (error) {
    console.error("loadPlanoSelecionado: Erro ao carregar plano selecionado:", error)
    return null
  }
}
