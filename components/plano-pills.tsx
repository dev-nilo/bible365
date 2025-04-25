"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { planosDisponiveis } from "@/lib/planos-leitura"
import { loadPlanoSelecionado, savePlanoSelecionado } from "@/lib/storage-utils"
import { PlanIcon, getPlanColor } from "./plano-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PlanoPillsProps {
  onPlanoChange?: (planoId: string) => void
  className?: string
}

export function PlanoPills({ onPlanoChange, className = "" }: PlanoPillsProps) {
  const [planoAtual, setPlanoAtual] = useState<string>("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar plano selecionado
  useEffect(() => {
    try {
      const planoId = loadPlanoSelecionado() || "mcheyne" // Plano padrão
      console.log("PlanoPills: Plano carregado do localStorage:", planoId)
      setPlanoAtual(planoId)
    } catch (error) {
      console.error("PlanoPills: Erro ao carregar plano:", error)
      setPlanoAtual("mcheyne") // Fallback para plano padrão
    }
  }, [])

  // Função para mudar o plano
  const handleChangePlano = (planoId: string) => {
    console.log("PlanoPills: Tentando mudar para o plano:", planoId)
    setError(null)

    // Se o plano for diferente do atual, mostrar diálogo de confirmação
    if (planoId !== planoAtual) {
      setPlanoSelecionado(planoId)
      setShowConfirmDialog(true)
      console.log("PlanoPills: Diálogo de confirmação aberto")
    } else {
      console.log("PlanoPills: Mesmo plano selecionado, nenhuma ação necessária")
    }
  }

  // Função para confirmar a mudança de plano
  const confirmChangePlano = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("PlanoPills: Confirmando mudança para o plano:", planoSelecionado)

      const plano = planosDisponiveis.find((p) => p.id === planoSelecionado)
      console.log("PlanoPills: Plano encontrado para confirmação:", plano)

      if (plano) {
        // Salvar no localStorage
        const saved = savePlanoSelecionado(planoSelecionado)
        console.log("PlanoPills: Plano salvo no localStorage:", saved)

        // Atualizar estado local
        setPlanoAtual(planoSelecionado)

        // Notificar o componente pai sobre a mudança
        if (onPlanoChange) {
          console.log("PlanoPills: Chamando onPlanoChange com:", planoSelecionado)
          onPlanoChange(planoSelecionado)
        }

        // Fechar o diálogo
        setShowConfirmDialog(false)

        // Recarregar a página para aplicar as mudanças
        console.log("PlanoPills: Recarregando a página...")
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        throw new Error("Plano não encontrado")
      }
    } catch (error: any) {
      console.error("PlanoPills: Erro ao confirmar mudança de plano:", error)
      setError(error.message || "Erro ao mudar de plano")
    } finally {
      setIsLoading(false)
    }
  }

  // Se não houver plano atual, mostrar mensagem de carregamento
  if (!planoAtual) {
    return (
      <div className="flex items-center justify-center h-10 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin text-sky-500 mr-2" />
        <span className="text-sky-700 dark:text-sky-300 text-sm">Carregando planos...</span>
      </div>
    )
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
        <TooltipProvider>
          {planosDisponiveis.map((plano) => {
            const colors = getPlanColor(plano.id)
            const isActive = plano.id === planoAtual

            return (
              <Tooltip key={plano.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangePlano(plano.id)}
                    className={`relative transition-all duration-200 ${
                      isActive
                        ? `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} border-2 border-sky-500 dark:border-sky-400 shadow-md`
                        : "bg-white dark:bg-gray-800 border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-gray-700"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center gap-1.5">
                      <PlanIcon
                        planType={plano.id}
                        className={isActive ? `${colors.text} ${colors.darkText}` : "text-sky-600 dark:text-sky-400"}
                      />
                      <span
                        className={isActive ? `${colors.text} ${colors.darkText}` : "text-sky-700 dark:text-sky-300"}
                      >
                        {plano.nome.split(" ")[0]}
                      </span>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 ml-0.5 text-sky-600 dark:text-sky-400 plan-pill-checkmark" />
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-white dark:bg-gray-800 border-sky-200 dark:border-sky-800 p-3 max-w-xs"
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-sky-800 dark:text-sky-200">{plano.nome}</div>
                    <div className="text-xs text-sky-600 dark:text-sky-400">{plano.descricao}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>

      {/* Diálogo de confirmação */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md animate-in fade-in-80 zoom-in-90 slide-in-from-bottom-10">
          <DialogHeader>
            <DialogTitle>Mudar plano de leitura?</DialogTitle>
            <DialogDescription>
              Ao mudar o plano de leitura, seu progresso será mantido, mas a visualização será adaptada para o novo
              plano. Você pode voltar ao plano anterior a qualquer momento.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
              className="transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmChangePlano}
              disabled={isLoading}
              className="bg-sky-500 hover:bg-sky-600 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aplicando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
