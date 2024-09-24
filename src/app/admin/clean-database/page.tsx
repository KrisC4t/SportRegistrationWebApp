// app/admin/clean-database/page.tsx
'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CleanDatabase() {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleCleanDatabase = async () => {
    setIsLoading(true)
    const { error } = await supabase.rpc('clean_old_accounts')

    if (error) {
      alert(error.message)
    } else {
      alert('Database cleaned successfully')
      router.push('/home')
    }
    setIsLoading(false)
    setIsConfirming(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trash2 className="mr-2" />
            Clean Database
          </CardTitle>
          <CardDescription>Remove inactive accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This action will remove all accounts that haven&#39t registered in the last two years.</p>
        </CardContent>
        <CardFooter>
          {!isConfirming ? (
            <Button onClick={() => setIsConfirming(true)} className="flex items-center">
              <Trash2 className="mr-2" />
              Clean Database
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsConfirming(false)} className="mr-2">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleCleanDatabase} disabled={isLoading} className="flex items-center">
                <Trash2 className="mr-2" />
                {isLoading ? 'Cleaning...' : 'Confirm Clean'}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}