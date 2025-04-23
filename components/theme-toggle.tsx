"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Alternar entre os temas claro e escuro
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  if (!mounted) {
    // Renderizar um placeholder durante a hidratação para evitar mudanças de layout
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 relative overflow-hidden"
      title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          theme === "dark" ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        }`}
      />
      <span className="sr-only">{theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}</span>
    </Button>
  )
}
