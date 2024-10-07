'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCog, ClipboardList, Trash2, Scale, Download, LucideProps } from 'lucide-react'

const Cleaner = (props: LucideProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" stroke="currentColor" className="lucide lucide-download mr-2" width={24} height={24} {...props}>
    <title>clean</title>
    <rect x="20" y="18" width="6" height="2" transform="translate(46 38) rotate(-180)"/>
    <rect x="24" y="26" width="6" height="2" transform="translate(54 54) rotate(-180)"/>
    <rect x="22" y="22" width="6" height="2" transform="translate(50 46) rotate(-180)"/>
    <path d="M17.0029,20a4.8952,4.8952,0,0,0-2.4044-4.1729L22,3,20.2691,2,12.6933,15.126A5.6988,5.6988,0,0,0,7.45,16.6289C3.7064,20.24,3.9963,28.6821,4.01,29.04a1,1,0,0,0,1,.96H20.0012a1,1,0,0,0,.6-1.8C17.0615,25.5439,17.0029,20.0537,17.0029,20ZM11.93,16.9971A3.11,3.11,0,0,1,15.0041,20c0,.0381.0019.208.0168.4688L9.1215,17.8452A3.8,3.8,0,0,1,11.93,16.9971ZM15.4494,28A5.2,5.2,0,0,1,14,25H12a6.4993,6.4993,0,0,0,.9684,3H10.7451A16.6166,16.6166,0,0,1,10,24H8a17.3424,17.3424,0,0,0,.6652,4H6c.031-1.8364.29-5.8921,1.8027-8.5527l7.533,3.35A13.0253,13.0253,0,0,0,17.5968,28Z"/>
  </svg>
)

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        setIsAdmin(data?.is_admin || false)
      }
    }
    getUser()
  }, [supabase])

  if (!user) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenue, {user.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/club-registration" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2" />
                Site d&#39;inscription au club d&#39;auto défense
              </CardTitle>
              <CardDescription>Inscription pour cette année au club d&#39;auto défense</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/delete-account" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trash2 className="mr-2" />
                Supprimer votre compte
              </CardTitle>
              <CardDescription>Suppression définitive de votre compte</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/gdpr" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2" />
                Information RGPD
              </CardTitle>
              <CardDescription>Voir la politique de sécurité de vos données relative au RGPD</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        {isAdmin && (
          <>
            <Link href="/admin/accounts" passHref>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCog className="mr-2" />
                    Gestion des instructeurs
                  </CardTitle>
                  <CardDescription>Gérer les droits des comptes pour les instructeurs du club d&#39;auto défense</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/admin/download-registrations" passHref>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="mr-2" />
                    Télécharger les inscriptions
                  </CardTitle>
                  <CardDescription>Télécharger les inscriptions pour l&#39;année en cours</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/admin/clean-database" passHref>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cleaner className="mr-2" />
                    Comptes inactifs
                  </CardTitle>
                  <CardDescription>Suppression des comptes inactifs</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}