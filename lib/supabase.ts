import { createClient } from "@supabase/supabase-js"

// Tipos para o banco de dados
export type Profile = {
  id: string
  auth_id: string | null
  email: string
  display_name: string | null
  created_at: string
  last_sync: string
}

export type ReadingProgressItem = {
  id: string
  user_id: string
  reading_id: string
  completed: boolean
  created_at: string
  updated_at: string
}

// Criação do cliente Supabase para o lado do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton para evitar múltiplas instâncias
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Cliente Supabase para o lado do servidor
export const createServerSupabaseClient = () => {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
