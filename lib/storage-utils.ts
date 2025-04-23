/**
 * Utilitários para gerenciar o armazenamento local de forma segura
 */

// Chave usada para armazenar o progresso de leitura
const STORAGE_KEY = "bibliaProgress"

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
      console.warn("LocalStorage não está disponível. Usando dados vazios.")
      return {}
    }

    // Tentar carregar os dados
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (!savedData) {
      return {}
    }

    // Tentar fazer o parse dos dados
    const parsedData = JSON.parse(savedData)

    // Validar os dados
    if (!isValidProgressData(parsedData)) {
      console.warn("Dados de progresso inválidos encontrados. Usando dados vazios.")
      return {}
    }

    return parsedData
  } catch (error) {
    console.error("Erro ao carregar progresso:", error)
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
      console.warn("LocalStorage não está disponível. Não foi possível salvar o progresso.")
      return false
    }

    // Validar os dados antes de salvar
    if (!isValidProgressData(progress)) {
      console.error("Tentativa de salvar dados de progresso inválidos.")
      return false
    }

    // Salvar os dados
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch (error) {
    console.error("Erro ao salvar progresso:", error)
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
      console.warn("LocalStorage não está disponível. Não foi possível limpar o progresso.")
      return false
    }

    // Limpar os dados
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error("Erro ao limpar progresso:", error)
    return false
  }
}

/**
 * Migra dados de versões anteriores para o formato atual
 * (Útil para futuras atualizações da estrutura de dados)
 */
export function migrateOldData(): ReadingProgress {
  try {
    // Verificar se o localStorage está disponível
    if (!isLocalStorageAvailable()) {
      return {}
    }

    // Verificar se existem dados no formato antigo
    // Exemplo: se no futuro mudarmos o formato, podemos migrar aqui
    const oldData = localStorage.getItem("oldFormatKey")
    if (!oldData) {
      return {}
    }

    // Lógica de migração aqui
    // ...

    // Retornar dados migrados
    return {}
  } catch (error) {
    console.error("Erro ao migrar dados antigos:", error)
    return {}
  }
}
