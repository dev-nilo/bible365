// Função para extrair o livro da Bíblia de uma referência
function extractBook(reference: string): string {
  // Regex para extrair o nome do livro (letras seguidas por espaço)
  const match = reference.match(/^(\d?\s?[A-Za-zçãõáéíóúâêîôûàèìòù]+)/i)
  return match ? match[0].trim() : ""
}

// Função para obter estatísticas por livro da Bíblia
export function getBooksStats(completedReadings: Record<string, boolean>, planoDeLeitura: any): any[] {
  const booksProgress: Record<string, { total: number; completed: number }> = {}

  // Primeiro, vamos contar o total de referências para cada livro no plano
  Object.keys(planoDeLeitura).forEach((month) => {
    Object.keys(planoDeLeitura[month]).forEach((day) => {
      planoDeLeitura[month][day].forEach((reading: string) => {
        const book = extractBook(reading)
        if (book) {
          if (!booksProgress[book]) {
            booksProgress[book] = { total: 0, completed: 0 }
          }
          booksProgress[book].total++
        }
      })
    })
  })

  // Agora, vamos contar as leituras concluídas
  Object.keys(completedReadings).forEach((readingId) => {
    if (completedReadings[readingId]) {
      const [month, day, index] = readingId.split("-")

      try {
        const reading = planoDeLeitura[month][day][Number(index)]
        const book = extractBook(reading)

        if (book && booksProgress[book]) {
          booksProgress[book].completed++
        }
      } catch (error) {
        console.error("Erro ao processar leitura:", readingId)
      }
    }
  })

  // Converter para o formato necessário para o gráfico
  return Object.keys(booksProgress)
    .filter((book) => {
      // Filtrar apenas livros que tenham pelo menos uma leitura concluída
      return booksProgress[book].completed > 0
    })
    .map((book) => ({
      name: book,
      progress: Math.round((booksProgress[book].completed / booksProgress[book].total) * 100) || 0,
      completed: booksProgress[book].completed,
      total: booksProgress[book].total,
    }))
}

// Função para calcular dados de sequência
export function getStreakData(completedReadings: Record<string, boolean>, planoDeLeitura: any): any {
  // Criar um mapa de dias com pelo menos uma leitura concluída
  const daysWithReadings: Record<string, boolean> = {}
  const daysWithAllReadings: Record<string, boolean> = {}

  // Mapear todos os dias do plano
  const allDays: { month: string; day: string }[] = []
  Object.keys(planoDeLeitura).forEach((month) => {
    Object.keys(planoDeLeitura[month]).forEach((day) => {
      allDays.push({ month, day })
    })
  })

  // Ordenar os dias cronologicamente
  allDays.sort((a, b) => {
    if (a.month !== b.month) {
      return Number.parseInt(a.month) - Number.parseInt(b.month)
    }
    return Number.parseInt(a.day) - Number.parseInt(b.day)
  })

  // Verificar dias com leituras
  allDays.forEach(({ month, day }) => {
    const totalReadingsInDay = planoDeLeitura[month][day].length
    let completedInDay = 0

    planoDeLeitura[month][day].forEach((_, index) => {
      const readingId = `${month}-${day}-${index}`
      if (completedReadings[readingId]) {
        completedInDay++
      }
    })

    if (completedInDay > 0) {
      daysWithReadings[`${month}-${day}`] = true
    }

    if (completedInDay === totalReadingsInDay) {
      daysWithAllReadings[`${month}-${day}`] = true
    }
  })

  // Calcular total de dias no plano
  const totalDays = allDays.length

  // Calcular total de dias com leituras
  const totalDaysRead = Object.keys(daysWithReadings).length
  const totalDaysCompleted = Object.keys(daysWithAllReadings).length

  // Calcular taxa de conclusão
  const completionRate = Math.round((totalDaysRead / totalDays) * 100)

  // Calcular sequência atual
  let currentStreak = 0
  let longestStreak = 0
  let currentStreakCount = 0

  // Simulação de sequência baseada nos dias com leituras
  // Em uma implementação real, isso seria baseado em datas reais
  for (let i = 0; i < allDays.length; i++) {
    const { month, day } = allDays[i]
    const dayKey = `${month}-${day}`

    if (daysWithReadings[dayKey]) {
      currentStreakCount++
      longestStreak = Math.max(longestStreak, currentStreakCount)
    } else {
      currentStreakCount = 0
    }
  }

  // Definir sequência atual (limitada para demonstração)
  currentStreak = Math.min(currentStreakCount, 30)

  return {
    currentStreak,
    longestStreak,
    totalDaysRead,
    totalDaysCompleted,
    completionRate,
  }
}

// Função para obter dados mensais
export function getMonthlyData(completedReadings: Record<string, boolean>, planoDeLeitura: any): any[] {
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString()

    // Total de leituras no mês
    const totalReadingsInMonth = Object.keys(planoDeLeitura[month] || {}).reduce(
      (acc, day) => acc + (planoDeLeitura[month][day]?.length || 0),
      0,
    )

    // Leituras concluídas no mês
    let completedInMonth = 0

    Object.keys(completedReadings).forEach((readingId) => {
      if (completedReadings[readingId] && readingId.startsWith(`${month}-`)) {
        completedInMonth++
      }
    })

    // Calcular progresso
    const progress = totalReadingsInMonth > 0 ? Math.round((completedInMonth / totalReadingsInMonth) * 100) : 0

    return {
      name: monthNames[i],
      progress,
      total: totalReadingsInMonth,
      completed: completedInMonth,
    }
  })
}

// Função para obter dados por dia da semana
export function getWeekdayData(completedReadings: Record<string, boolean>, planoDeLeitura: any): any[] {
  const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const counts = Array(7).fill(0)

  // Mapear dias reais da semana (simulação)
  const dayMapping: Record<string, number> = {}
  let currentDay = new Date().getDay()

  Object.keys(planoDeLeitura).forEach((month, monthIndex) => {
    Object.keys(planoDeLeitura[month]).forEach((day, dayIndex) => {
      // Simular um dia da semana para cada dia do plano
      // Em uma implementação real, você calcularia isso com base em datas reais
      const weekdayIndex = (currentDay + dayIndex) % 7
      dayMapping[`${month}-${day}`] = weekdayIndex
    })
    currentDay = (currentDay + 1) % 7
  })

  // Contar leituras por dia da semana
  Object.keys(completedReadings).forEach((readingId) => {
    if (completedReadings[readingId]) {
      const [month, day] = readingId.split("-")
      const weekdayIndex = dayMapping[`${month}-${day}`] || 0
      counts[weekdayIndex]++
    }
  })

  return weekdays.map((name, index) => ({
    name,
    count: counts[index],
  }))
}
