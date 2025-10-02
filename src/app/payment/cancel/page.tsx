// app/payment/cancel/page.tsx
'use client'

import { XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function PaymentCancel() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <XCircle className="mx-auto text-red-600" size={48} />
          <CardTitle className="mt-4">Paiement Annulé</CardTitle>
          <CardDescription>
            Votre paiement n'a pas été effectué. Vous pouvez réessayer ou utiliser un autre mode de paiement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Si le problème persiste, contactez-nous ou réessayez plus tard.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 w-full">
          <Button className="w-full" variant="secondary" onClick={() => router.push('/home')}>
            Retour à l'accueil
          </Button>
          <Button className="w-full" onClick={() => router.push('/register')}>
            Réessayer le paiement
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

