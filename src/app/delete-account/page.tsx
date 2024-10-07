// app/delete-account/page.tsx
'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function DeleteAccount() {
  const [isConfirming, setIsConfirming] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleDeleteAccount = async () => {
    const { error } = await supabase.rpc('delete_user')
    if (error) {
      alert(error.message)
    } else {
      await supabase.auth.signOut()
      router.push('/signin')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trash2 className="mr-2" />
            Suppression de votre compte
          </CardTitle>
          <CardDescription>Cette action est irréversible</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Êtes-vous sur de vouloir supprimer le compte ? Cette action supprime toutes vos données de manière permanente.</p>
        </CardContent>
        <CardFooter>
          {!isConfirming ? (
            <Button variant="destructive" onClick={() => setIsConfirming(true)}>Suppression de votre compte</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsConfirming(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Confirmez la suppression</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}