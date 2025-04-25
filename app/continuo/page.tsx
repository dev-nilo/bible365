"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { PlanoPills } from "@/components/plano-pills"
import {
  loadReadingProgress,
  saveReadingProgress,
  loadPlanoSelecionado,
  type ReadingProgress,
} from "@/lib/storage-utils"
import { getPlanoLeitura } from "@/lib/planos-leitura"

export default function PlanoSequencial() {
  const router = useRouter()
  const [completedReadings, setCompletedReadings] = useState<ReadingProgress>({})
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("mcheyne-sequencial")
  const [planoLeitura, setPlanoLeitura] = useState<Record<string, Record<string, string[]>>>({})
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [daysPerPage, setDaysPerPage] = useState<number>(7)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalDays, setTotalDays] = useState<number>(0)

  // Carregar plano e progresso
  useEffect(() => {
    // Carregar plano selecionado
    const planoId = loadPlanoSelecionado() || "mcheyne-sequencial"
    setPlanoSelecionado(planoId)

    // Carregar o plano de leitura
    const plano = getPlanoLeitura(planoId)
    setPlanoLeitura(plano)

    // Calcular total de dias
    if (plano && plano["1"]) {
      setTotalDays(Object.keys(plano["1"]).length)
    }

    // Carregar progresso
    const progress = loadReadingProgress()
    setCompletedReadings(progress)

    // Calcular dia atual (baseado na data)
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (24 * 60 * 60 * 1000)) + 1
    setCurrentDay(Math.min(dayOfYear, totalDays || 365))

    // Calcular página atual
    setCurrentPage(Math.floor((dayOfYear - 1) / daysPerPage))
  }, [])

  // Atualizar quando o plano mudar
  useEffect(() => {
    if (planoSelecionado) {
      const plano = getPlanoLeitura(planoSelecionado)
      setPlanoLeitura(plano)

      // Calcular total de dias
      if (plano && plano["1"]) {
        setTotalDays(Object.keys(plano["1"]).length)
      }
    }
  }, [planoSelecionado])

  // Marcar leitura como concluída
  const toggleReading = (readingId: string) => {
    setCompletedReadings((prev) => {
      const newCompletedReadings = { ...prev }

      // Se a leitura já estava marcada, remova-a
      if (newCompletedReadings[readingId]) {
        newCompletedReadings[readingId] = false
      } else {
        newCompletedReadings[readingId] = true
      }

      // Salvar no localStorage
      saveReadingProgress(newCompletedReadings)

      return newCompletedReadings
    })
  }

  // Marcar todas as leituras do dia como concluídas
  const markAllDayReadings = (day: string) => {
    setCompletedReadings((prev) => {
      const newCompletedReadings = { ...prev }

      // Marcar todas as leituras do dia como concluídas
      planoLeitura["1"][day].forEach((_, index) => {
        const readingId = `1-${day}-${index}`
        newCompletedReadings[readingId] = true
      })

      // Salvar no localStorage
      saveReadingProgress(newCompletedReadings)

      return newCompletedReadings
    })
  }

  // Verificar se um dia tem todas as leituras concluídas
  const isDayCompleted = (day: string) => {
    if (!planoLeitura["1"] || !planoLeitura["1"][day]) return false
    return planoLeitura["1"][day].every((_, index) => completedReadings[`1-${day}-${index}`])
  }

  // Calcular progresso do dia
  const calculateDayProgress = (day: string) => {
    if (!planoLeitura["1"] || !planoLeitura["1"][day]) return 0

    const totalReadingsInDay = planoLeitura["1"][day].length
    const completedReadingsInDay = planoLeitura["1"][day].filter(
      (_, index) => completedReadings[`1-${day}-${index}`],
    ).length

    return Math.round((completedReadingsInDay / totalReadingsInDay) * 100)
  }

  // Navegar para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Navegar para a próxima página
  const goToNextPage = () => {
    const maxPage = Math.ceil(totalDays / daysPerPage) - 1
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Ir para a página do dia atual
  const goToToday = () => {
    const pageOfCurrentDay = Math.floor((currentDay - 1) / daysPerPage)
    setCurrentPage(pageOfCurrentDay)
  }

  // Calcular dias a serem exibidos na página atual
  const getDaysForCurrentPage = () => {
    const startDay = currentPage * daysPerPage + 1
    const endDay = Math.min(startDay + daysPerPage - 1, totalDays)

    return Array.from({ length: endDay - startDay + 1 }, (_, i) => (startDay + i).toString())
  }

  // Função para lidar com a mudança de plano
  const handlePlanoChange = (planoId: string) => {
    setPlanoSelecionado(planoId)
  }

  // Verificar se o plano atual é sequencial
  const isPlanoSequencial = planoSelecionado.includes("sequencial")

  // Se o plano não for sequencial, redirecionar para a página principal
  useEffect(() => {
    if (planoSelecionado && !isPlanoSequencial) {
      router.push("/")
    }
  }, [planoSelecionado, isPlanoSequencial, router])

  // Se não houver dados do plano, mostrar mensagem de carregamento
  if (!planoLeitura || !planoLeitura["1"] || Object.keys(planoLeitura["1"]).length === 0) {
    return (
      <main className="container mx-auto py-6 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
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

        <div className="text-center">
          <p className="text-sky-700 dark:text-sky-300">Carregando plano de leitura...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-6 px-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
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

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-sky-900 dark:text-sky-100">Plano de Leitura Sequencial</h1>
        <p className="text-sky-700 dark:text-sky-300 mb-4">Acompanhe seu progresso dia a dia (1 a {totalDays})</p>

        <div className="mb-4">
          <span className="block text-sm text-sky-700 dark:text-sky-300 text-center mb-2">Escolha seu plano:</span>
          <PlanoPills onPlanoChange={handlePlanoChange} />
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300"
          >
            Anterior
          </Button>

          <Button variant="default" onClick={goToToday} className="bg-sky-500 hover:bg-sky-600 text-white">
            Hoje (Dia {currentDay})
          </Button>

          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage >= Math.ceil(totalDays / daysPerPage) - 1}
            className="border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300"
          >
            Próximo
          </Button>
        </div>

        <div className="text-sm text-sky-600 dark:text-sky-400">
          Página {currentPage + 1} de {Math.ceil(totalDays / daysPerPage)} • Dias {currentPage * daysPerPage + 1}-
          {Math.min((currentPage + 1) * daysPerPage, totalDays)}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getDaysForCurrentPage().map((day) => {
          const isToday = Number.parseInt(day) === currentDay
          const dayCompleted = isDayCompleted(day)
          const dayProgress = calculateDayProgress(day)

          return (
            <Card
              key={day}
              id={`day-${day}`}
              className={`overflow-hidden transition-all border-sky-200 dark:border-sky-800 ${
                isToday ? "ring-2 ring-sky-500 dark:ring-sky-400" : ""
              } ${dayCompleted ? "bg-sky-50 dark:bg-sky-900/20" : "bg-white dark:bg-gray-800"}`}
            >
              <CardHeader
                className={`py-3 ${
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
                    className={`ml-2 ${
                      dayCompleted
                        ? "bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 border-none"
                        : "border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300"
                    }`}
                  >
                    {planoLeitura["1"][day].filter((_, index) => completedReadings[`1-${day}-${index}`]).length} /{" "}
                    {planoLeitura["1"][day].length}
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
                    <div style={{ width: `${dayProgress}%` }}></div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {planoLeitura["1"][day].map((reading, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Checkbox
                        id={`1-${day}-${index}`}
                        checked={!!completedReadings[`1-${day}-${index}`]}
                        onCheckedChange={() => toggleReading(`1-${day}-${index}`)}
                        className="mt-1 border-sky-300 dark:border-sky-700 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                      />
                      <label
                        htmlFor={`1-${day}-${index}`}
                        className={`text-sm flex-1 ${
                          completedReadings[`1-${day}-${index}`]
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
                    className="w-full text-xs border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30"
                    onClick={() => markAllDayReadings(day)}
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
    </main>
  )
}
