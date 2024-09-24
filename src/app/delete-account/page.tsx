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
            Delete Account
          </CardTitle>
          <CardDescription>This action cannot be undone</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Are you sure you want to delete your account? This will permanently erase all your data.</p>
        </CardContent>
        <CardFooter>
          {!isConfirming ? (
            <Button variant="destructive" onClick={() => setIsConfirming(true)}>Delete Account</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsConfirming(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Confirm Delete</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}