// app/admin/download-registrations/page.tsx
'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Payment {
  status: string;
}

interface Registration {
  id: string;
  user_id: string;
  year: number;
  lastname: string;
  firstname: string;
  phone: string;
  whatsapp: boolean;
  email: string;
  birthdate: Date;
  address: string;
  payment_mode: string;
  created_at: Date;
  updated_at: Date;
  payments?: Payment[];
}

export default function DownloadRegistrations() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleDownload = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('registrations')
      .select('*, payments(status)')
      .eq('year', new Date().getFullYear())

    if (error) {
      alert(error.message)
    } else {
      const csv: string = convertToCSV(data as Registration[])
      downloadCSV(csv, `inscriptions_${new Date().getFullYear()}.csv`)
    }
    setIsLoading(false)
  }

  const convertToCSV = (data: Registration[]) => {
    if (data.length === 0) return ''

    const baseHeaders = Object.keys(data[0]).filter(h => h !== 'payments')
    const headers = [...baseHeaders, 'paid']

    const rows = data.map(row => headers.map(h => {
      if (h === 'paid') {
        const paid = row.payments?.some(p => p.status.toLowerCase() === 'succeeded') ?? false
        return paid ? '"Oui"' : '"Non"'
      }

      const value = row[h as keyof Registration]

      if (typeof value === 'boolean') return value ? '"Oui"' : '"Non"'
      if (value instanceof Date) return value.toISOString()
      if (value === undefined || value === null) return ''

      return `"${String(value).replace(/"/g, '""')}"`
    }).join(','))

    return [headers.join(','), ...rows].join('\n')
  }


  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Download className="mr-2" />
        Télécharger les inscriptions de l&#39;année en cours
      </h1>
      <Button onClick={handleDownload} disabled={isLoading}>
        {isLoading ? 'Téléchargement en cours...' : 'Téléchargement au format CSV'}
      </Button>
    </div>
  )
}
