"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Cloud, CloudOff } from "lucide-react"
import { syncReadingProgress } from "@/lib/sync-utils"

export function UserMenu() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [lastSync, setLastSync] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabase()

  // Carregar usuário atual
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    fetchUser()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Função para fazer logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Função para sincronizar progresso
  const handleSync = async () => {
    setSyncing(true)
    setSyncStatus("idle")

    try {
      const result = await syncReadingProgress()

      if (result.status === "success") {
        setSyncStatus("success")
        setLastSync(result.timestamp || new Date().toISOString())
      } else {
        setSyncStatus("error")
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error)
      setSyncStatus("error")
    } finally {
      setSyncing(false)

      // Resetar o status após 3 segundos
      setTimeout(() => {
        setSyncStatus("idle")
      }, 3000)
    }
  }

  // Se estiver carregando, não mostrar nada
  if (loading) return null

  // Se não houver usuário, mostrar botão de login
  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push("/auth")}
        className="flex items-center gap-2 border-sky-300 dark:border-sky-700 bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-gray-700"
      >
        <User className="h-4 w-4" />
        <span>Entrar</span>
      </Button>
    )
  }

  // Se houver usuário, mostrar menu
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={syncing}
        className={`flex items-center gap-2 ${
          syncStatus === "success"
            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
            : syncStatus === "error"
              ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
              : "border-sky-300 dark:border-sky-700 bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300"
        }`}
      >
        {syncing ? (
          <>
            <Cloud className="h-4 w-4 animate-pulse" />
            <span>Sincronizando...</span>
          </>
        ) : syncStatus === "success" ? (
          <>
            <Cloud className="h-4 w-4" />
            <span>Sincronizado</span>
          </>
        ) : syncStatus === "error" ? (
          <>
            <CloudOff className="h-4 w-4" />
            <span>Erro ao sincronizar</span>
          </>
        ) : (
          <>
            <Cloud className="h-4 w-4" />
            <span>Sincronizar</span>
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-sky-200 dark:border-sky-800">
              <AvatarFallback className="bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "Usuário"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
