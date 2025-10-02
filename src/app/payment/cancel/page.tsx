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
          <CardTitle className="mt-4">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was not completed. You can try again or use another payment method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            If the issue persists, contact us or try again later.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 w-full">
          <Button className="w-full" variant="secondary" onClick={() => router.push('/home')}>
            Return to Home
          </Button>
          <Button className="w-full" onClick={() => router.push('/register')}>
            Retry Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
