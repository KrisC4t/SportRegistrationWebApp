// app/payment/success/page.tsx
'use client'

import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function PaymentSuccess() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle className="mx-auto text-green-600" size={48} />
          <CardTitle className="mt-4">Paiement Réussi</CardTitle>
          <CardDescription>
            Merci pour votre paiement. Votre inscription est maintenant confirmée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Vous recevrez un email de confirmation dans les plus brefs délais.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push('/home')}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
