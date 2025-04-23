import { getSupabase } from "./supabase"
import { loadReadingProgress, saveReadingProgress, type ReadingProgress } from "./storage-utils"

// Status de sincronização
export type SyncStatus = "idle" | "syncing" | "success" | "error"

// Função para sincronizar o progresso local com o Supabase
export async function syncReadingProgress(): Promise<{
  status: SyncStatus
  message?: string
  timestamp?: string
}> {
  try {
    const supabase = getSupabase()

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { status: "error", message: "Usuário não autenticado" }
    }

    // Obter o perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_id", session.user.id)
      .single()

    if (profileError || !profileData) {
      // Se o perfil não existir, criar um novo
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          auth_id: session.user.id,
          email: session.user.email || "",
          display_name: session.user.user_metadata.full_name || session.user.email?.split("@")[0] || "Usuário",
        })
        .select()
        .single()

      if (createError || !newProfile) {
        console.error("Erro ao criar perfil:", createError)
        return { status: "error", message: "Erro ao criar perfil de usuário" }
      }

      profileData = newProfile
    }

    // Obter o progresso local
    const localProgress = loadReadingProgress()

    // Obter o progresso remoto
    const { data: remoteProgressData, error: remoteError } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", profileData.id)

    if (remoteError) {
      console.error("Erro ao obter progresso remoto:", remoteError)
      return { status: "error", message: "Erro ao obter progresso remoto" }
    }

    // Converter o progresso remoto para o formato local
    const remoteProgress: ReadingProgress = {}
    remoteProgressData?.forEach((item) => {
      remoteProgress[item.reading_id] = item.completed
    })

    // Mesclar o progresso local com o remoto (estratégia: o mais recente prevalece)
    const mergedProgress = { ...remoteProgress, ...localProgress }

    // Salvar o progresso mesclado localmente
    saveReadingProgress(mergedProgress)

    // Sincronizar o progresso mesclado com o Supabase
    // Primeiro, excluir todos os registros existentes
    const { error: deleteError } = await supabase.from("reading_progress").delete().eq("user_id", profileData.id)

    if (deleteError) {
      console.error("Erro ao excluir progresso remoto:", deleteError)
      return { status: "error", message: "Erro ao sincronizar progresso" }
    }

    // Inserir os novos registros
    const progressToInsert = Object.entries(mergedProgress)
      .filter(([_, completed]) => completed) // Apenas inserir leituras concluídas
      .map(([reading_id, completed]) => ({
        user_id: profileData.id,
        reading_id,
        completed,
      }))

    if (progressToInsert.length > 0) {
      const { error: insertError } = await supabase.from("reading_progress").insert(progressToInsert)

      if (insertError) {
        console.error("Erro ao inserir progresso remoto:", insertError)
        return { status: "error", message: "Erro ao sincronizar progresso" }
      }
    }

    // Atualizar a data da última sincronização
    const now = new Date().toISOString()
    const { error: updateError } = await supabase.from("profiles").update({ last_sync: now }).eq("id", profileData.id)

    if (updateError) {
      console.error("Erro ao atualizar data de sincronização:", updateError)
    }

    return { status: "success", timestamp: now }
  } catch (error) {
    console.error("Erro ao sincronizar progresso:", error)
    return { status: "error", message: "Erro ao sincronizar progresso" }
  }
}

// Função para carregar o progresso do Supabase
export async function loadRemoteProgress(): Promise<{
  status: SyncStatus
  progress?: ReadingProgress
  message?: string
  timestamp?: string
}> {
  try {
    const supabase = getSupabase()

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { status: "error", message: "Usuário não autenticado" }
    }

    // Obter o perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_id", session.user.id)
      .single()

    if (profileError || !profileData) {
      return { status: "error", message: "Perfil de usuário não encontrado" }
    }

    // Obter o progresso remoto
    const { data: remoteProgressData, error: remoteError } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", profileData.id)

    if (remoteError) {
      console.error("Erro ao obter progresso remoto:", remoteError)
      return { status: "error", message: "Erro ao obter progresso remoto" }
    }

    // Converter o progresso remoto para o formato local
    const remoteProgress: ReadingProgress = {}
    remoteProgressData?.forEach((item) => {
      remoteProgress[item.reading_id] = item.completed
    })

    return {
      status: "success",
      progress: remoteProgress,
      timestamp: profileData.last_sync,
    }
  } catch (error) {
    console.error("Erro ao carregar progresso remoto:", error)
    return { status: "error", message: "Erro ao carregar progresso remoto" }
  }
}
