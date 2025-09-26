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
          <CardTitle className="mt-4">Payment Successful</CardTitle>
          <CardDescription>
            Thank you for your payment. Your registration is now confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You will receive a confirmation email shortly.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push('/home')}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
