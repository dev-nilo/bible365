"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, BookOpen, CheckCircle, BookOpenCheck, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { planoDeLeitura } from "@/lib/plano-leitura"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { getBooksStats, getStreakData, getMonthlyData, getWeekdayData } from "@/lib/stats-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { loadReadingProgress, isLocalStorageAvailable } from "@/lib/storage-utils"
import { getSupabase } from "@/lib/supabase"
import { loadRemoteProgress } from "@/lib/sync-utils"

export default function Estatisticas() {
  const router = useRouter()
  const [completedReadings, setCompletedReadings] = useState<Record<string, boolean>>({})
  const [totalProgress, setTotalProgress] = useState(0)
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [weekdayData, setWeekdayData] = useState<any[]>([])
  const [booksData, setBooksData] = useState<any[]>([])
  const [storageError, setStorageError] = useState<string | null>(null)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalDaysRead: 0,
    totalDaysCompleted: 0,
    completionRate: 0,
  })
  const supabase = getSupabase()

  // Verificar autenticação e carregar progresso
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      // Verificar se o localStorage está disponível
      if (!isLocalStorageAvailable()) {
        setStorageError("O armazenamento local não está disponível. Seu progresso não será salvo entre sessões.")
      }

      // Verificar autenticação
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      let progress: Record<string, boolean> = {}

      // Se estiver autenticado, tentar carregar dados remotos
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

          setSyncMessage("Erro ao carregar dados da nuvem. Usando dados locais.")
          setSyncStatus("error")

          // Resetar mensagem após 5 segundos
          setTimeout(() => {
            setSyncMessage(null)
            setSyncStatus("idle")
          }, 5000)
        }
      } else {
        // Se não estiver autenticado, usar dados locais
        progress = loadReadingProgress()
      }

      setCompletedReadings(progress)

      // Calcular estatísticas
      const totalReadings = Object.keys(planoDeLeitura).reduce(
        (acc, month) =>
          acc +
          Object.keys(planoDeLeitura[month]).reduce((dayAcc, day) => dayAcc + planoDeLeitura[month][day].length, 0),
        0,
      )

      const completedCount = Object.keys(progress).filter((key) => progress[key]).length
      setTotalProgress(Math.round((completedCount / totalReadings) * 100))

      // Dados por mês
      setMonthlyData(getMonthlyData(progress, planoDeLeitura))

      // Dados por dia da semana
      setWeekdayData(getWeekdayData(progress, planoDeLeitura))

      // Dados por livro da Bíblia
      setBooksData(getBooksStats(progress, planoDeLeitura))

      // Dados de sequência
      setStreakData(getStreakData(progress, planoDeLeitura))
    }

    checkAuthAndLoadData()

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

  // Formatar tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 text-foreground p-3 rounded-lg shadow-lg border border-sky-200 dark:border-sky-800 text-sm">
          <p className="font-medium text-sky-800 dark:text-sky-300 mb-1">{label}</p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-sky-500"></span>
            {`${payload[0].name}: ${payload[0].value}${payload[0].name === "Progresso" ? "%" : ""}`}
          </p>
        </div>
      )
    }
    return null
  }

  // Cores para os gráficos
  const skyColors = [
    "#0ea5e9", // sky-500
    "#0284c7", // sky-600
    "#0369a1", // sky-700
    "#075985", // sky-800
    "#0c4a6e", // sky-900
  ]

  // Função para fechar o alerta de erro
  const dismissError = () => {
    setStorageError(null)
  }

  // Função para fechar o alerta de sincronização
  const dismissSyncMessage = () => {
    setSyncMessage(null)
    setSyncStatus("idle")
  }

  return (
    <main className="container mx-auto py-8 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      {storageError && (
        <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
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
          className={`mb-6 ${
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
          <AlertDescription className="flex justify-between items-center">
            <span
              className={
                syncStatus === "success"
                  ? "text-green-700 dark:text-green-300"
                  : syncStatus === "error"
                    ? "text-red-700 dark:text-red-300"
                    : "text-sky-700 dark:text-sky-300"
              }
            >
              {syncMessage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={dismissSyncMessage}
              className={`ml-2 h-7 px-2 ${
                syncStatus === "success"
                  ? "border-green-200 dark:border-green-800"
                  : syncStatus === "error"
                    ? "border-red-200 dark:border-red-800"
                    : "border-sky-200 dark:border-sky-800"
              }`}
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-gray-700 border-sky-200 dark:border-sky-800"
        >
          <ArrowLeft className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <span className="text-sky-800 dark:text-sky-200">Voltar</span>
        </Button>
        <div className="flex items-center gap-2">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 text-sky-900 dark:text-sky-100">Estatísticas de Leitura</h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">
          Acompanhe seu progresso detalhado no plano de leitura bíblica M&apos;Cheyne
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="stats-card border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-800 dark:text-sky-200">Progresso Total</CardTitle>
            <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">{totalProgress}%</div>
            <div className="progress-bar-sky">
              <div style={{ width: `${totalProgress}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-800 dark:text-sky-200">Sequência Atual</CardTitle>
            <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-900 dark:text-sky-100 mb-1">
              {streakData.currentStreak} dias
            </div>
            <div className="flex items-center gap-1 text-sky-700 dark:text-sky-300">
              <TrendingUp className="h-3 w-3" />
              <p className="text-xs">Maior sequência: {streakData.longestStreak} dias</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-800 dark:text-sky-200">Dias de Leitura</CardTitle>
            <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-900 dark:text-sky-100 mb-1">
              {streakData.totalDaysRead} dias
            </div>
            <div className="flex items-center gap-1">
              <span className="badge-sky">{streakData.completionRate}%</span>
              <p className="text-xs text-sky-700 dark:text-sky-300">{streakData.totalDaysCompleted} dias completos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sky-800 dark:text-sky-200">Livros Iniciados</CardTitle>
            <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <BookOpenCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sky-900 dark:text-sky-100 mb-1">{booksData.length}</div>
            <div className="flex items-center gap-1">
              <span className="badge-sky">{booksData.filter((b) => b.progress === 100).length} concluídos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-sky-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="monthly"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-sky-700 dark:data-[state=active]:text-sky-300 rounded-md"
          >
            Progresso Mensal
          </TabsTrigger>
          <TabsTrigger
            value="weekday"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-sky-700 dark:data-[state=active]:text-sky-300 rounded-md"
          >
            Dias da Semana
          </TabsTrigger>
          <TabsTrigger
            value="books"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-sky-700 dark:data-[state=active]:text-sky-300 rounded-md"
          >
            Livros da Bíblia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card className="border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="border-b border-sky-100 dark:border-sky-900">
              <CardTitle className="text-sky-800 dark:text-sky-200">Progresso por Mês</CardTitle>
              <CardDescription className="text-sky-600 dark:text-sky-400">
                Porcentagem de leituras concluídas em cada mês do plano
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-sky-100 dark:stroke-sky-900" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="progress" name="Progresso" radius={[4, 4, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={skyColors[index % skyColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekday">
          <Card className="border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="border-b border-sky-100 dark:border-sky-900">
              <CardTitle className="text-sky-800 dark:text-sky-200">Leituras por Dia da Semana</CardTitle>
              <CardDescription className="text-sky-600 dark:text-sky-400">
                Número de leituras concluídas em cada dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-sky-100 dark:stroke-sky-900" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Leituras" radius={[4, 4, 0, 0]}>
                    {weekdayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={skyColors[index % skyColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books">
          <Card className="border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="border-b border-sky-100 dark:border-sky-900">
              <CardTitle className="text-sky-800 dark:text-sky-200">Progresso por Livro</CardTitle>
              <CardDescription className="text-sky-600 dark:text-sky-400">
                Porcentagem de leituras concluídas em cada livro da Bíblia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto pr-4 pt-4 space-y-4">
                {booksData
                  .sort((a, b) => b.progress - a.progress)
                  .map((book, index) => (
                    <div key={book.name} className="animate-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-sky-800 dark:text-sky-200">{book.name}</span>
                        <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
                          {book.progress}% ({book.completed}/{book.total})
                        </span>
                      </div>
                      <div className="progress-bar-sky">
                        <div
                          style={{
                            width: `${book.progress}%`,
                            backgroundColor: skyColors[index % skyColors.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
