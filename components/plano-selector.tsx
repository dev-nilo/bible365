"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { planosDisponiveis, type PlanoMetadata } from "@/lib/planos-leitura"
import { loadPlanoSelecionado, savePlanoSelecionado } from "@/lib/storage-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
// Add the import for the PlanIcon and getPlanColor
import { PlanIcon, getPlanColor } from "./plano-icons"

interface PlanoSelectorProps {
  onPlanoChange?: (planoId: string) => void
}

export function PlanoSelector({ onPlanoChange }: PlanoSelectorProps) {
  const [planoAtual, setPlanoAtual] = useState<PlanoMetadata | undefined>()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Carregar plano selecionado
  useEffect(() => {
    try {
      const planoId = loadPlanoSelecionado() || "mcheyne" // Plano padrão
      console.log("PlanoSelector: Plano carregado do localStorage:", planoId)

      // Garantir que planosDisponiveis está definido antes de tentar encontrar o plano
      if (planosDisponiveis && planosDisponiveis.length > 0) {
        const plano = planosDisponiveis.find((p) => p.id === planoId)
        console.log("PlanoSelector: Plano encontrado na lista:", plano)

        if (plano) {
          setPlanoAtual(plano)
        } else {
          console.error("PlanoSelector: Plano não encontrado na lista de planos disponíveis")
          // Usar o primeiro plano disponível como fallback
          setPlanoAtual(planosDisponiveis[0])
        }
      } else {
        console.error("PlanoSelector: Lista de planos disponíveis vazia ou indefinida")
      }
    } catch (error) {
      console.error("PlanoSelector: Erro ao carregar plano:", error)
      // Usar o primeiro plano disponível como fallback se disponível
      if (planosDisponiveis && planosDisponiveis.length > 0) {
        setPlanoAtual(planosDisponiveis[0])
      }
    }
  }, [])

  // Função para mudar o plano
  const handleChangePlano = (planoId: string) => {
    console.log("PlanoSelector: Tentando mudar para o plano:", planoId)
    setError(null)

    // Se o plano for diferente do atual, mostrar diálogo de confirmação
    if (planoId !== planoAtual?.id) {
      setPlanoSelecionado(planoId)
      setShowConfirmDialog(true)
      console.log("PlanoSelector: Diálogo de confirmação aberto")
    } else {
      console.log("PlanoSelector: Mesmo plano selecionado, nenhuma ação necessária")
    }
  }

  // Função para confirmar a mudança de plano
  const confirmChangePlano = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("PlanoSelector: Confirmando mudança para o plano:", planoSelecionado)

      const plano = planosDisponiveis.find((p) => p.id === planoSelecionado)
      console.log("PlanoSelector: Plano encontrado para confirmação:", plano)

      if (plano) {
        // Salvar no localStorage
        const saved = savePlanoSelecionado(planoSelecionado)
        console.log("PlanoSelector: Plano salvo no localStorage:", saved)

        // Atualizar estado local
        setPlanoAtual(plano)

        // Notificar o componente pai sobre a mudança
        if (onPlanoChange) {
          console.log("PlanoSelector: Chamando onPlanoChange com:", planoSelecionado)
          onPlanoChange(planoSelecionado)
        }

        // Fechar o diálogo
        setShowConfirmDialog(false)

        // Recarregar a página para aplicar as mudanças
        console.log("PlanoSelector: Recarregando a página...")

        // Usar window.location.reload() em vez de router.refresh()
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        throw new Error("Plano não encontrado")
      }
    } catch (error: any) {
      console.error("PlanoSelector: Erro ao confirmar mudança de plano:", error)
      setError(error.message || "Erro ao mudar de plano")
    } finally {
      setIsLoading(false)
    }
  }

  // Se não houver plano atual, mostrar mensagem de carregamento
  if (!planoAtual) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2 border-sky-300 dark:border-sky-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sky-700 dark:text-sky-300">Carregando planos...</span>
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-sky-300 dark:border-sky-700 transition-all duration-300 hover:bg-sky-50 dark:hover:bg-sky-900/20"
            onClick={(e) => {
              // This is critical - prevent event bubbling
              e.stopPropagation()
            }}
          >
            <PlanIcon planType={planoAtual?.id || "mcheyne"} />
            <span className="text-sky-700 dark:text-sky-300">{planoAtual?.nome || "Carregando..."}</span>
            <ChevronDown className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 animate-in fade-in-80 zoom-in-95 bg-white dark:bg-gray-800 border border-sky-200 dark:border-sky-800"
        >
          {/* Update the DropdownMenuItem to include the icon and color: */}
          {planosDisponiveis.map((plano) => {
            const colors = getPlanColor(plano.id)
            return (
              <DropdownMenuItem
                key={plano.id}
                className={`flex items-center justify-between transition-colors duration-200 ${
                  plano.id === planoAtual?.id ? `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}` : ""
                } hover:bg-sky-100 dark:hover:bg-sky-800/30 cursor-pointer`}
                onClick={() => handleChangePlano(plano.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${colors.bg} ${colors.darkBg}`}>
                    <PlanIcon planType={plano.id} className={`${colors.text} ${colors.darkText}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sky-800 dark:text-sky-200">{plano.nome}</span>
                    <span className="text-xs text-sky-600 dark:text-sky-400">{plano.descricao}</span>
                  </div>
                </div>
                {plano.id === planoAtual?.id && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

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
