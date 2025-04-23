"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("login")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabase()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirecionar para a página principal após login bem-sucedido
      router.push("/")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      setSuccessMessage("Registro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.")
      setActiveTab("login")
    } catch (error: any) {
      setError(error.message || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-sky-800 dark:text-sky-200">
          {activeTab === "login" ? "Entrar" : "Criar Conta"}
        </CardTitle>
        <CardDescription className="text-center text-sky-600 dark:text-sky-400">
          {activeTab === "login"
            ? "Entre para sincronizar seu progresso entre dispositivos"
            : "Crie uma conta para salvar seu progresso na nuvem"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sky-800 dark:text-sky-200">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-sky-200 dark:border-sky-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sky-800 dark:text-sky-200">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-sky-200 dark:border-sky-800"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sky-800 dark:text-sky-200">
                  Nome
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-sky-200 dark:border-sky-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sky-800 dark:text-sky-200">
                  E-mail
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-sky-200 dark:border-sky-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sky-800 dark:text-sky-200">
                  Senha
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-sky-200 dark:border-sky-800"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">Sucesso</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-sky-600 dark:text-sky-400">
          {activeTab === "login" ? "Não tem uma conta? " : "Já tem uma conta? "}
          <Button
            variant="link"
            className="p-0 h-auto text-sky-700 dark:text-sky-300"
            onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
          >
            {activeTab === "login" ? "Registre-se" : "Entre"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}
