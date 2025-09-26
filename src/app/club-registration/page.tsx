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

interface FormData {
  lastname: string
  firstname: string
  phone: string
  whatsapp: boolean
  email: string
  birthdate: string
  address: string
  payment_mode: string
  image_rights_consent: boolean
}

interface Registration {
  user_id: string
  year: number
  lastname: string
  firstname: string
  phone: string
  whatsapp: boolean
  email: string
  birthdate: string
  address: string
  payment_mode: string
  image_rights_consent: boolean
}


export default function ClubRegistration() {
  const [formData, setFormData] = useState<FormData>({
    lastname: '',
    firstname: '',
    phone: '',
    whatsapp: false,
    email: '',
    birthdate: '',
    address: '',
    payment_mode: '',
    image_rights_consent: false
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
          setFormData({
	    lastname: data.lastname || '',
	    firstname: data.firstname || '',
	    phone: data.phone || '',
	    whatsapp: data.whatsapp || false,
	    email: data.email || '',
	    birthdate: data.birthdate || '',
	    address: data.address || '',
	    payment_mode: data.payment_mode || '',
	    image_rights_consent: data.image_rights_consent || false,
	  })
        }
      }
    }
    fetchPreviousRegistration()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (sessionError || !user) {
      alert('Please log in before registering.');
      return;
    }

    if (!formData.image_rights_consent) {
      alert('You must accept the image rights to continue.');
      return;
    }
    
    const registrationPayload: Registration = {
      ...formData,
      user_id: user.id,
      year: new Date().getFullYear(),
    }

    const { data: registrationData, error: registrationError } = await supabase
      .from('registrations')
      .upsert(registrationPayload, { onConflict: ['user_id', 'year'] })
      .select()
      .single();

    if (registrationError || !registrationData) {
      alert(registrationError?.message ?? 'Error saving the registration.');
      console.error('registration error', registrationError);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ last_registration: new Date().toISOString().split('T')[0] })
      .eq('id', user.id);

    async function launchPayment(registrationId: string) {
      // Get the access token to identify the caller server-side
      // If you have supabase-js v2: use auth.getSession() or auth.getUser()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (sessionError || !accessToken) {
        alert('Unable to retrieve session. Please log in again.');
        return;
      }
  
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ registrationId }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating the payment : ' + (data?.error ?? 'unknown'));
        console.error('create-checkout failure', data);
      }
    }

    await launchPayment(registrationData.id);

    if (profileError) {
      console.warn('Profile update error:', profileError);
    }
  };

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
            Club Registration
          </CardTitle>
          <CardDescription>Register for this year&#39;s club membership</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="lastname" className="text-sm font-medium">Last Name</label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="firstname" className="text-sm font-medium">First Name</label>
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
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
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
              <label htmlFor="whatsapp" className="text-sm font-medium">Add to WhatsApp group</label>
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
              <label htmlFor="birthdate" className="text-sm font-medium">Birth Date</label>
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
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="payment_mode" className="text-sm font-medium">Payment Mode</label>
              <Select
                value={formData.payment_mode}
                onValueChange={(value) => setFormData(prev => ({ ...prev, payment_mode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="espèces">Cash</SelectItem>
                  <SelectItem value="1 chèque bancaire">1 bank check</SelectItem>
                  <SelectItem value="2 chèques bancaires">2 bank checks</SelectItem>
                  <SelectItem value="carte bancaire">Credit card (online)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="image_rights_consent"
                name="image_rights_consent"
                checked={formData.image_rights_consent}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, image_rights_consent: checked as boolean }))
                }
                required
              />
              <label htmlFor="image_rights_consent" className="text-sm font-medium leading-snug">
                I consent to the use of my image as part of the club's communication materials. <br />
                <span className="text-xs text-muted-foreground">
                  This consent cannot be changed once submitted.
                </span>
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Submit Registration</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
