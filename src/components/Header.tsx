// components/Header.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { House, ClipboardList, Scale, Swords } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Button asChild variant="link" className="w-full md:w-auto justify-start text-primary-foreground">
          <Link href="/home" className="text-xl font-bold">
            <Swords className="mr-2 h-8 w-8" />
            Self Defense Club
            <Swords className="ml-2 h-8 w-8" />
          </Link>
        </Button>
        <div className="space-x-4">
          <Button asChild variant="link" className="w-full md:w-auto justify-start text-primary-foreground">
            <Link href="/home" className="hover:underline">
              <House className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="link" className="w-full md:w-auto justify-start text-primary-foreground">
            <Link href="/club-registration" className="hover:underline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Register
            </Link>
          </Button>
          <Button asChild variant="link" className="w-full md:w-auto justify-start text-primary-foreground">
            <Link href="/gdpr" className="hover:underline">
              <Scale className="mr-2 h-4 w-4" />
              GDPR
            </Link>
          </Button>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </nav>
    </header>
  )
}