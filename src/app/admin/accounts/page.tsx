// app/admin/accounts/page.tsx
'use client'

import { UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Profiles {
  id: string;
  email: string;
  is_admin: boolean;
  last_registration: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<Profiles[]>([])
  const supabase = createClientComponentClient()

  const fetchAccounts = useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
      alert(error.message)
    } else {
      setAccounts(data)
    }
  }, [supabase])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const toggleAdminRole = async (userId: string, isAdmin: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !isAdmin })
      .eq('id', userId)

    if (error) {
      alert(error.message)
    } else {
      fetchAccounts()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <UserCog className="mr-2" />
        Gérer les comptes des instructeurs
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Instructeur</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.email}</TableCell>
              <TableCell>{account.is_admin ? 'Oui' : 'Non'}</TableCell>
              <TableCell>
                <Button onClick={() => toggleAdminRole(account.id, account.is_admin)}>
                  {account.is_admin ? 'Supprimer le rôle d\'instructeur' : 'Ajouter le rôle d\'instructeur'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}