// app/club-registration/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClubRegistration() {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    phone: '',
    whatsapp: false,
    email: '',
    birthdate: '',
    address: '',
    payment_mode: ''
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPreviousRegistration = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Now fetch the previous registration
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data && !error) {
          setFormData(data)
        }
      }
    }
    fetchPreviousRegistration()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error: registrationError } = await supabase
        .from('registrations')
        .upsert({ ...formData, user_id: user.id, year: new Date().getFullYear() })

      if (registrationError) {
        alert(registrationError.message)
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ last_registration: new Date().toISOString().split('T')[0] })
          .eq('id', user.id)

        if (profileError) {
          alert(profileError.message)
        } else {
          router.push('/home')
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2" />
            Inscription au club d&#39;auto défense
          </CardTitle>
          <CardDescription>Inscription au club pour l&#39;année en cours</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="lastname" className="text-sm font-medium">Nom</label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="firstname" className="text-sm font-medium">Prénom</label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Numéro de téléphone</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                pattern="^(?:(?:\+|00)33|0)\s*[1-9](?:[\s\.\-]*\d{2}){4}$"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp"
                name="whatsapp"
                checked={formData.whatsapp}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsapp: checked as boolean }))}
              />
              <label htmlFor="whatsapp" className="text-sm font-medium">Ajout au groupe WhatsApp</label>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="birthdate" className="text-sm font-medium">Date de naissance</label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Adresse</label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="payment_mode" className="text-sm font-medium">Mode de payement</label>
              <Select
                value={formData.payment_mode}
                onValueChange={(value) => setFormData(prev => ({ ...prev, payment_mode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="espèces">Espèces</SelectItem>
                  <SelectItem value="1 chèque bancaire">1 chèque bancaire</SelectItem>
                  <SelectItem value="2 chèques bancaires">2 chèques bancaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">S&#39;inscrire pour l&#39;année</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}