import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plano de Leitura Bíblica M'Cheyne",
  description: "Acompanhe seu progresso no plano de leitura bíblica M'Cheyne",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="biblia-theme-preference">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
