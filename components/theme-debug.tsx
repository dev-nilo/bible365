"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ThemeDebug() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Depuração de Tema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Tema atual:</strong> {theme}
          </p>
          <p>
            <strong>Tema resolvido:</strong> {resolvedTheme}
          </p>
          <p>
            <strong>localStorage:</strong>{" "}
            {typeof window !== "undefined" ? localStorage.getItem("biblia-theme-preference") : "N/A"}
          </p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setTheme("light")} className="px-3 py-1 bg-blue-500 text-white rounded">
              Forçar Claro
            </button>
            <button onClick={() => setTheme("dark")} className="px-3 py-1 bg-gray-800 text-white rounded">
              Forçar Escuro
            </button>
            <button onClick={() => setTheme("system")} className="px-3 py-1 bg-gray-500 text-white rounded">
              Forçar Sistema
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
