// app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/signin')
      }
    }
    checkUser()
  }, [supabase, router])

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      setRegistrationComplete(true)
    }
  }

  if (registrationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Création de compte réussi</CardTitle>
            <CardDescription>Regardez vos mails pour confirmer votre création de compte</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Nous avons envoyé un mail de confirmation à {email}.
                Vérifiez vos mails et votre dossier de spam pour pouvoir confirmer votre création de compte.
                Vous ne pourrez pas vous connecter tant que votre création de compte ne sera pas validé avec le mail envoyé.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/signin')} className="w-full">
              Retourner à la page d&#39;inscription
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Creátion de compte</CardTitle>
          <CardDescription>Création d&#39;un nouveau compte</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Créer votre compte</Button>
          </CardFooter>
        </form>
        <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Vous avez déjà un compte ?{' '}
              <Link href="/signin" className="text-muted-foreground hover:underline">
                Connectez-vous ici
              </Link>
            </div>
          </CardFooter>
      </Card>
    </div>
  )
}