// app/gdpr/page.tsx
import { Scale } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GDPR() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="mr-2" />
            Information RGPD
          </CardTitle>
          <CardDescription>Traitements de vos données</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Collecte et utilisations de vos données</h2>
          <p className="mb-4">
            Nous collectons et utilisons vos données pour gérer les inscriptions des membres du club.
            Cela inclut votre identité, des moyens de contact et les détails de l&#39;inscription.
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Stockage et extraction des données</h2>
          <p className="mb-4">
            Vos données sont stockées de manière sécurisé dans notre base de données.
            Les inscriptions de l&#39;année en cours sont accessible aux instructeurs du club d&#39;auto défense.
            Les instructeurs peuvent télécharger toutes les inscriptions de l&#39;année en cours pour créer votre license.
            Le service de stockage est &#34;supabase&#34;, vos données sont stockées sur leurs infrastructures,
            les administrateurs peuvent y avoir accès dans les contextes nécessitant des interventions pour le bon fonctionnement du service.
          </p>

          <h2 className="text-xl font-semibold mb-2">Modification des données</h2>
          <p className="mb-4">
            Vous pouvez modifier vos données quand vous le souhaitez depuis cette application web.
            Les autres membres du club (y compris les instructeurs) ne peuvent modifier vos données personnelles.
            Les instructeurs peuvent modifier votre rôle en rôle instructeurs si nécessaire pour le bon fonctionnement des inscriptions au club.
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Durée de stockage</h2>
          <p className="mb-4">
            Nous stockons vos données durant tout le temps où vous serez un membre actif.
            Si vous avez une période d&#39;inactivité plus grande que 2 ans (pas de renouvellement d&#39;inscription au club),
            vos données pourront être supprimées par les instructeurs, sans consultations préalables des données
            (donc sans tri possible par les instructeurs).
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
          <p className="mb-4">
            Vous avez le droit d&#39;accèder, de rectifier, de modifier et de supprimer vos données quand vous le souhaitez.
            Vous pouvez donc récupérer toutes vos informations personnelles dans les différentes pages de l&#39;application.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}