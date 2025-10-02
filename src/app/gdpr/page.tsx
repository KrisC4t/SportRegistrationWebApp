// app/gdpr/page.tsx
import { Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GDPR() {
  const gpdrEmail = process.env.NEXT_PUBLIC_GDPR_EMAIL;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="mr-2" />
            Informations RGPD
          </CardTitle>
          <CardDescription>Comment nous traitons vos données personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">1. Collecte et utilisation des données</h2>
          <p className="mb-4">
            Nous collectons et traitons vos données personnelles afin de gérer votre adhésion et vos inscriptions au club.
            Cela inclut votre nom, vos coordonnées, les détails d'inscription, les paiements et votre consentement aux droits à l'image.
            Les données sont utilisées exclusivement à des fins administratives, de gestion des adhésions, de conformité légale et
            de communication sur les activités du club.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. Droits à l'image</h2>
          <p className="mb-4">
            Lors de l'inscription, vous pouvez consentir à l'utilisation de photographies et vidéos dans lesquelles vous pourriez apparaître,
            dans le but de promouvoir et communiquer sur le club. Votre consentement peut être <span className="font-bold">modifié ultérieurement</span>, et chaque modification
            est <span className="font-bold">historisée dans notre base de données</span>.  
            Cela garantit un enregistrement complet des droits à l'image dans le temps, permettant au club de prouver le consentement
            valable à une date donnée. Les images publiées sont toujours utilisées conformément au consentement en vigueur au moment de l'utilisation.
          </p>

          <h2 className="text-xl font-semibold mb-2">3. Paiements et données financières</h2>
          <p className="mb-4">
            Les paiements effectués via Stripe sont stockés de manière immuable dans notre base de données et liés à votre inscription et votre email.
            Même si votre profil est supprimé, vos emails et vos enregistrements de paiement sont conservés afin de fournir une <span className="font-bold">preuve légale
            des paiements et transactions financières</span>. Les enregistrements de paiement ne sont jamais modifiés ou supprimés, sauf obligation légale.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Stockage et sécurité des données</h2>
          <p className="mb-4">
            Toutes les données sont stockées de manière sécurisée sur l'infrastructure Supabase. Seul le personnel autorisé (administrateurs) peut accéder
            aux inscriptions, paiements et droits à l'image. Des mesures techniques et organisationnelles sont en place pour protéger vos
            données contre tout accès, divulgation ou modification non autorisé.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Conservation des données</h2>
          <p className="mb-4">
            Vos données personnelles sont conservées pendant la durée de votre adhésion active plus deux ans.  
            Cela inclut les données de profil, les détails d'inscription, les paiements et tous les enregistrements historiques des droits à l'image.  
            Les adresses email sont conservées pour <span className="font-bold">preuve des paiements et du consentement à l'image</span>, même après suppression du profil,
            strictement à des fins légales et administratives.
          </p>

          <h2 className="text-xl font-semibold mb-2">6. Vos droits</h2>
          <p className="mb-4">
            Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
            <ul className="list-disc list-inside">
              <li>Accéder à vos données personnelles et en obtenir une copie.</li>
              <li>Demander la rectification des données inexactes ou incomplètes.</li>
              <li>Demander la suppression de vos données personnelles, à l'exception des données nécessaires à la preuve légale des paiements et des droits à l'image historiques.</li>
              <li>Restreindre ou vous opposer à certaines opérations de traitement.</li>
              <li>Modifier votre consentement pour les droits à l'image ; toutes les modifications sont historisées pour preuve.</li>
              <li>Retirer votre consentement pour le traitement optionnel des données (sans affecter les enregistrements légaux ou historiques).</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold mb-2">7. Base légale</h2>
          <p className="mb-4">
            Le club traite vos données selon les bases légales suivantes :
            <ul className="list-disc list-inside">
              <li>Exécution d'un contrat : gestion des adhésions et des inscriptions.</li>
              <li>Obligation légale : conservation des enregistrements de paiement et des droits à l'image historiques pour preuve en cas de litige.</li>
              <li>Intérêts légitimes : promotion des activités du club, archivage historique et conformité légale.</li>
              <li>Consentement : communications optionnelles et modifications des droits à l'image, sauf si nécessaire pour preuve légale.</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold mb-2">8. Partage des données</h2>
          <p className="mb-4">
            Vos données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales. Elles peuvent être consultées par le personnel
            autorisé du club pour la gestion des adhésions, l'audit financier, les archives historiques et la conformité légale.
          </p>

          <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
          <p>
            Pour toute question concernant vos données personnelles, pour exercer vos droits ou pour déposer une réclamation, veuillez
            contacter notre Délégué à la Protection des Données à l'adresse : <a href={`mailto:${gpdrEmail}`}>{gpdrEmail}</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
