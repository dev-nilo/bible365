"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, ChevronRight, BookOpen, CheckSquare, Settings2, AlertTriangle, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  loadReadingProgress,
  saveReadingProgress,
  clearReadingProgress,
  isLocalStorageAvailable,
  loadPlanoSelecionado,
  type ReadingProgress,
} from "@/lib/storage-utils"
import { getSupabase } from "@/lib/supabase"
import { loadRemoteProgress, syncReadingProgress } from "@/lib/sync-utils"
import { getPlanoLeitura, getPlanoMetadata } from "@/lib/planos-leitura"
import { PlanoPills } from "@/components/plano-pills"

export default function Home() {
  const router = useRouter()
  const [completedReadings, setCompletedReadings] = useState<ReadingProgress>({})
  const [activeMonth, setActiveMonth] = useState("1")
  const [progress, setProgress] = useState(0)
  const [todaysReadings, setTodaysReadings] = useState<{ month: string; day: string }>({ month: "1", day: "1" })
  const [showSettings, setShowSettings] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("mcheyne")
  const [planoLeitura, setPlanoLeitura] = useState<Record<string, Record<string, string[]>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabase()

  // Carregar plano selecionado e dados iniciais
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)

      try {
        // Verificar autenticação
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)

        // Verificar se o localStorage está disponível
        if (!isLocalStorageAvailable()) {
          setStorageError("O armazenamento local não está disponível. Seu progresso não será salvo.")
        }

        // Carregar plano selecionado
        const planoId = loadPlanoSelecionado() || "mcheyne"
        console.log("Home: Plano carregado:", planoId)
        setPlanoSelecionado(planoId)

        // Carregar o plano de leitura
        const plano = getPlanoLeitura(planoId)
        console.log("Home: Plano carregado:", Object.keys(plano).length, "meses")
        setPlanoLeitura(plano)

        // Determinar o mês e dia atual
        const currentDate = new Date()
        const month = String(Math.min(12, currentDate.getMonth() + 1))
        const day = String(Math.min(31, currentDate.getDate()))

        setTodaysReadings({ month, day })
        setActiveMonth(month)

        // Carregar progresso
        let progress: ReadingProgress = {}

        if (session) {
          setSyncStatus("syncing")
          setSyncMessage("Carregando dados da nuvem...")

          const result = await loadRemoteProgress()

          if (result.status === "success" && result.progress) {
            // Mesclar progresso remoto com local
            const localProgress = loadReadingProgress()
            progress = { ...localProgress, ...result.progress }

            setSyncMessage(`Dados sincronizados com sucesso (${new Date(result.timestamp || "").toLocaleString()})`)
            setSyncStatus("success")

            // Resetar mensagem após 5 segundos
            setTimeout(() => {
              setSyncMessage(null)
              setSyncStatus("idle")
            }, 5000)
          } else {
            // Se não conseguir carregar dados remotos, usar dados locais
            progress = loadReadingProgress()

            // Tentar sincronizar
            syncReadingProgress().then((result) => {
              if (result.status === "success") {
                setSyncMessage(`Dados sincronizados com sucesso (${new Date(result.timestamp || "").toLocaleString()})`)
                setSyncStatus("success")
              } else {
                setSyncMessage("Erro ao sincronizar dados. Tente novamente mais tarde.")
                setSyncStatus("error")
              }

              // Resetar mensagem após 5 segundos
              setTimeout(() => {
                setSyncMessage(null)
                setSyncStatus("idle")
              }, 5000)
            })
          }
        } else {
          // Se não estiver autenticado, usar dados locais
          progress = loadReadingProgress()
        }

        setCompletedReadings(progress)

        // Calcular progresso geral
        if (plano && Object.keys(plano).length > 0) {
          // Contar o total de leituras no plano
          const totalReadings = Object.keys(plano).reduce(
            (acc, month) =>
              acc + Object.keys(plano[month]).reduce((dayAcc, day) => dayAcc + plano[month][day].length, 0),
            0,
          )

          // Contar leituras concluídas
          const completedCount = Object.keys(progress).filter((key) => progress[key]).length

          // Calcular porcentagem
          setProgress(Math.round((completedCount / totalReadings) * 100))
        }
      } catch (error) {
        console.error("Home: Erro ao inicializar aplicação:", error)
        setStorageError("Ocorreu um erro ao carregar os dados. Tente recarregar a página.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Função para lidar com a mudança de plano
  const handlePlanoChange = useCallback(
    (novoPlanoId: string) => {
      console.log("Home: handlePlanoChange chamado com:", novoPlanoId)

      // Atualizar o estado
      setPlanoSelecionado(novoPlanoId)

      // Carregar o novo plano
      const plano = getPlanoLeitura(novoPlanoId)
      setPlanoLeitura(plano)

      // Verificar se é um plano sequencial
      const metadata = getPlanoMetadata(novoPlanoId)
      if (metadata?.tipoSequencia === "continua") {
        console.log("Home: Redirecionando para página de plano contínuo")
        router.push("/continuo")
      }
    },
    [router],
  )

  // Marcar leitura como concluída
  const toggleReading = useCallback(
    (readingId: string) => {
      setCompletedReadings((prev) => {
        const newCompletedReadings = { ...prev }

        // Se a leitura já estava marcada, remova-a
        if (newCompletedReadings[readingId]) {
          newCompletedReadings[readingId] = false
        } else {
          newCompletedReadings[readingId] = true
        }

        // Salvar no localStorage com validação
        const saved = saveReadingProgress(newCompletedReadings)
        if (!saved && !storageError) {
          setStorageError("Não foi possível salvar seu progresso. Verifique as configurações do seu navegador.")
        }

        return newCompletedReadings
      })
    },
    [storageError],
  )

  // Marcar todas as leituras do dia como concluídas
  const markAllDayReadings = useCallback(
    (month: string, day: string) => {
      setCompletedReadings((prev) => {
        const newCompletedReadings = { ...prev }

        // Marcar todas as leituras do dia como concluídas
        planoLeitura[month][day].forEach((_, index) => {
          const readingId = `${month}-${day}-${index}`
          newCompletedReadings[readingId] = true
        })

        // Salvar no localStorage com validação
        const saved = saveReadingProgress(newCompletedReadings)
        if (!saved && !storageError) {
          setStorageError("Não foi possível salvar seu progresso. Verifique as configurações do seu navegador.")
        }

        return newCompletedReadings
      })
    },
    [planoLeitura, storageError],
  )

  // Calcular progresso do mês
  const calculateMonthProgress = useCallback(
    (month: string) => {
      if (!planoLeitura[month]) return 0

      const totalReadingsInMonth = Object.keys(planoLeitura[month]).reduce(
        (acc, day) => acc + planoLeitura[month][day].length,
        0,
      )

      if (totalReadingsInMonth === 0) return 0

      let completedInMonth = 0
      Object.keys(planoLeitura[month]).forEach((day) => {
        planoLeitura[month][day].forEach((_, index) => {
          const readingId = `${month}-${day}-${index}`
          if (completedReadings[readingId]) {
            completedInMonth++
          }
        })
      })

      return Math.round((completedInMonth / totalReadingsInMonth) * 100)
    },
    [planoLeitura, completedReadings],
  )

  // Verificar se um dia tem todas as leituras concluídas
  const isDayCompleted = useCallback(
    (month: string, day: string) => {
      if (!planoLeitura[month] || !planoLeitura[month][day]) return false
      return planoLeitura[month][day].every((_, index) => completedReadings[`${month}-${day}-${index}`])
    },
    [planoLeitura, completedReadings],
  )

  // Ir para a leitura de hoje
  const goToToday = useCallback(() => {
    setActiveMonth(todaysReadings.month)
    // Após a mudança de tab, rolar até o card do dia atual
    setTimeout(() => {
      const todayCard = document.getElementById(`day-${todaysReadings.day}`)
      if (todayCard) {
        todayCard.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }, [todaysReadings])

  // Limpar progresso
  const resetProgress = useCallback(() => {
    setCompletedReadings({})
    const cleared = clearReadingProgress()
    if (!cleared && !storageError) {
      setStorageError("Não foi possível limpar seu progresso. Verifique as configurações do seu navegador.")
    }
    setShowSettings(false)
  }, [storageError])

  // Função para obter cor baseada no progresso
  const getProgressColor = useCallback((progress: number) => {
    if (progress < 25) return "bg-sky-200 text-sky-800"
    if (progress < 50) return "bg-sky-300 text-sky-800"
    if (progress < 75) return "bg-sky-400 text-white"
    return "bg-sky-500 text-white"
  }, [])

  // Função para fechar o alerta de erro
  const dismissError = useCallback(() => {
    setStorageError(null)
  }, [])

  // Verificar se o plano é contínuo
  const isPlanoSequencial =
    planoSelecionado.includes("sequencial") || getPlanoMetadata(planoSelecionado)?.tipoSequencia === "continua"

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-sky-800 dark:text-sky-200">Carregando plano de leitura...</h2>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-6 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      {storageError && (
        <Alert
          variant="destructive"
          className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 animate-in fade-in-80 slide-in-from-top-5"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{storageError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={dismissError}
              className="ml-2 h-7 px-2 border-red-200 dark:border-red-800"
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {syncMessage && (
        <Alert
          className={`mb-6 animate-in fade-in-80 slide-in-from-top-5 ${
            syncStatus === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : syncStatus === "error"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800"
          }`}
        >
          <AlertTitle
            className={
              syncStatus === "success"
                ? "text-green-800 dark:text-green-200"
                : syncStatus === "error"
                  ? "text-red-800 dark:text-red-200"
                  : "text-sky-800 dark:text-sky-200"
            }
          >
            {syncStatus === "success" ? "Sincronização" : syncStatus === "error" ? "Erro" : "Sincronizando"}
          </AlertTitle>
          <AlertDescription
            className={
              syncStatus === "success"
                ? "text-green-700 dark:text-green-300"
                : syncStatus === "error"
                  ? "text-red-700 dark:text-red-300"
                  : "text-sky-700 dark:text-sky-300"
            }
          >
            {syncMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center mb-8 relative">
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors duration-200"
              >
                <Settings2 className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 border-sky-200 dark:border-sky-800 animate-in fade-in-80 zoom-in-90 slide-in-from-bottom-10">
              <DialogHeader>
                <DialogTitle className="text-sky-800 dark:text-sky-200">Configurações</DialogTitle>
                <DialogDescription className="text-sky-600 dark:text-sky-400">
                  Gerencie as configurações do seu plano de leitura
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-sky-800 dark:text-sky-200">Gerenciar dados</h3>
                  <p className="text-sm text-sky-600 dark:text-sky-400">
                    Cuidado: limpar o progresso irá remover todas as suas leituras marcadas.
                  </p>
                </div>

                {!isLocalStorageAvailable() && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Armazenamento indisponível</AlertTitle>
                    <AlertDescription>
                      O armazenamento local não está disponível no seu navegador. Seu progresso não será salvo entre
                      sessões.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={resetProgress}
                  className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                >
                  Limpar todo o progresso
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <UserMenu />
          <ThemeToggle />
        </div>

        <h1 className="text-3xl font-bold mb-2 text-sky-900 dark:text-sky-100 animate-in fade-in-50 slide-in-from-bottom-5">
          Plano de Leitura Bíblica
        </h1>
        <p
          className="text-sky-700 dark:text-sky-300 mb-4 text-center animate-in fade-in-50 slide-in-from-bottom-5"
          style={{ animationDelay: "100ms" }}
        >
          Acompanhe seu progresso no plano anual
        </p>

        <div
          className="w-full max-w-md mb-4 animate-in fade-in-50 slide-in-from-bottom-5"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-sky-800 dark:text-sky-200">Progresso Geral</span>
            <span className="text-sm font-medium text-sky-800 dark:text-sky-200">{progress}%</span>
          </div>
          <div className="progress-bar-sky">
            <div style={{ width: `${progress}%` }} className="transition-all duration-1000 ease-out"></div>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2 justify-center mb-4 animate-in fade-in-50 slide-in-from-bottom-5"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 border-sky-300 dark:border-sky-700 bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => router.push("/estatisticas")}
          >
            <BarChart className="h-4 w-4" />
            Ver Estatísticas
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
            onClick={goToToday}
          >
            <BookOpen className="h-4 w-4" />
            Leitura de Hoje
          </Button>
        </div>

        <div className="mt-2 animate-in fade-in-50 slide-in-from-bottom-5" style={{ animationDelay: "400ms" }}>
          <span className="block text-sm text-sky-700 dark:text-sky-300 text-center mb-2">Escolha seu plano:</span>
          <PlanoPills onPlanoChange={handlePlanoChange} />
        </div>
      </div>

      {isPlanoSequencial ? (
        // Visualização para plano sequencial
        <div
          className="text-center mb-6 animate-in fade-in-50 slide-in-from-bottom-5"
          style={{ animationDelay: "500ms" }}
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 border-sky-300 dark:border-sky-700 bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => router.push("/continuo")}
          >
            <BookOpen className="h-4 w-4" />
            Ver Plano Sequencial (Dia 1 a 365)
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Visualização para plano mensal
        <Tabs defaultValue="1" value={activeMonth} onValueChange={setActiveMonth} className="w-full max-w-4xl mx-auto">
          <TabsList
            className="grid grid-cols-6 mb-4 sm:grid-cols-12 bg-sky-100 dark:bg-gray-800 p-1 rounded-lg animate-in fade-in-50 slide-in-from-bottom-5"
            style={{ animationDelay: "500ms" }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const monthProgress = calculateMonthProgress(month.toString())
              return (
                <TabsTrigger
                  key={month}
                  value={month.toString()}
                  className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-sky-700 dark:data-[state=active]:text-sky-300 rounded-md transition-all duration-200"
                >
                  <span>Mês {month}</span>
                  <div className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${getProgressColor(monthProgress)}`}
                      style={{
                        background: `conic-gradient(hsl(199 89% 48%) ${monthProgress}%, transparent 0)`,
                        transition: "all 0.5s ease-out",
                      }}
                    >
                      <span className="z-10">{monthProgress}</span>
                    </div>
                  </div>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <TabsContent key={month} value={month.toString()} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {planoLeitura[month.toString()] &&
                  Object.keys(planoLeitura[month.toString()]).map((day) => {
                    const isToday = month.toString() === todaysReadings.month && day === todaysReadings.day
                    const dayCompleted = isDayCompleted(month.toString(), day)

                    // Calcular progresso do dia
                    const totalReadingsInDay = planoLeitura[month.toString()][day].length
                    const completedReadingsInDay = planoLeitura[month.toString()][day].filter(
                      (_, index) => completedReadings[`${month}-${day}-${index}`],
                    ).length
                    const dayProgress = Math.round((completedReadingsInDay / totalReadingsInDay) * 100)

                    return (
                      <Card
                        key={day}
                        id={`day-${day}`}
                        className={`overflow-hidden transition-all duration-300 border-sky-200 dark:border-sky-800 ${
                          isToday ? "ring-2 ring-sky-500 dark:ring-sky-400" : ""
                        } ${dayCompleted ? "bg-sky-50 dark:bg-sky-900/20" : "bg-white dark:bg-gray-800"} 
                        hover:shadow-md animate-in fade-in-50 slide-in-from-bottom-5`}
                        style={{ animationDelay: `${Number.parseInt(day) * 20}ms` }}
                      >
                        <CardHeader
                          className={`py-3 transition-colors duration-300 ${
                            isToday
                              ? "bg-sky-500 text-white"
                              : dayCompleted
                                ? "bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200"
                                : "bg-sky-50 dark:bg-gray-700 text-sky-800 dark:text-sky-200"
                          }`}
                        >
                          <CardTitle className="text-lg flex justify-between items-center">
                            <span>
                              Dia {day} {isToday && <span className="text-xs ml-2">(Hoje)</span>}
                            </span>
                            <Badge
                              variant={dayCompleted ? "default" : "outline"}
                              className={`ml-2 transition-colors duration-300 ${
                                dayCompleted
                                  ? "bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 border-none"
                                  : "border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300"
                              }`}
                            >
                              {completedReadingsInDay} / {totalReadingsInDay}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-sky-700 dark:text-sky-300">Progresso do dia</span>
                              <span className="text-sky-700 dark:text-sky-300">{dayProgress}%</span>
                            </div>
                            <div className="progress-bar-sky">
                              <div
                                style={{ width: `${dayProgress}%` }}
                                className="transition-all duration-500 ease-out"
                              ></div>
                            </div>
                          </div>
                          <ul className="space-y-3">
                            {planoLeitura[month.toString()][day].map((reading, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Checkbox
                                  id={`${month}-${day}-${index}`}
                                  checked={!!completedReadings[`${month}-${day}-${index}`]}
                                  onCheckedChange={() => toggleReading(`${month}-${day}-${index}`)}
                                  className="mt-1 border-sky-300 dark:border-sky-700 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 transition-colors duration-200"
                                />
                                <label
                                  htmlFor={`${month}-${day}-${index}`}
                                  className={`text-sm flex-1 transition-all duration-300 ${
                                    completedReadings[`${month}-${day}-${index}`]
                                      ? "line-through text-sky-500/70 dark:text-sky-400/70"
                                      : "text-sky-800 dark:text-sky-200"
                                  }`}
                                >
                                  {reading}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        {!dayCompleted && (
                          <CardFooter className="pt-0 pb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors duration-200"
                              onClick={() => markAllDayReadings(month.toString(), day)}
                            >
                              <CheckSquare className="h-3 w-3 mr-1" />
                              Marcar todas como concluídas
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    )
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  )
}
