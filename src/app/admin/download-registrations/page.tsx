// app/admin/download-registrations/page.tsx
'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
}

export default function DownloadRegistrations() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleDownload = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('year', new Date().getFullYear())

    if (error) {
      alert(error.message)
    } else {
      const csv: string = convertToCSV(data)
      downloadCSV(csv, `registrations_${new Date().getFullYear()}.csv`)
    }
    setIsLoading(false)
  }

  const convertToCSV = (data: Registration[]) => {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(obj => Object.values(obj).join(','))
    return [headers, ...rows].join('\n')
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
        Download Current Registrations
      </h1>
      <Button onClick={handleDownload} disabled={isLoading}>
        {isLoading ? 'Downloading...' : 'Download CSV'}
      </Button>
    </div>
  )
}