"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { AuthForm } from "@/components/auth/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthPage() {
  const router = useRouter()
  const supabase = getSupabase()

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/")
      }
    }

    checkAuth()
  }, [])

  return (
    <main className="container mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-sky-900 dark:text-sky-100">
          Plano de Leitura Bíblica M&apos;Cheyne
        </h1>
        <p className="text-sky-700 dark:text-sky-300">Sincronize seu progresso entre dispositivos</p>
      </div>

      <AuthForm />
    </main>
  )
}
