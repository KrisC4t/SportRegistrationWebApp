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
            Information RGPD
          </CardTitle>
          <CardDescription>How we handle your personal data</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">1. Data Collection and Usage</h2>
          <p className="mb-4">
            We collect and process your personal data to manage your membership and registrations in the club.
            This includes your name, contact information, registration details, payments, and image rights consent.
            The data is used exclusively for administrative purposes, membership management, legal compliance, and
            communication about club activities.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. Image Rights</h2>
          <p className="mb-4">
            Upon registration, you can consent to the use of photographs and videos in which you may appear for the purpose
            of promoting and communicating about the club. Your consent can be <span className="font-bold">modified later</span>, and each modification
            is <span className="font-bold">historized in our database</span>.  
            This ensures a complete record of image rights over time, allowing the club to prove the consent that was valid
            at any specific date. Published images are always used according to the consent in force at the time of use.
          </p>

          <h2 className="text-xl font-semibold mb-2">3. Payments and Financial Data</h2>
          <p className="mb-4">
            Payments made via Stripe are stored immutably in our database and linked to your registration and email.
            Even if your profile is deleted, your email and payment records are preserved to provide a <span className="font-bold">legal proof of
            payments and financial transactions</span>. Payment records are never modified or deleted except under legal obligation.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Data Storage and Security</h2>
          <p className="mb-4">
            All data is stored securely on Supabase infrastructure. Only authorized personnel (administrators) can access
            registrations, payments, and image rights. Technical and organizational measures are in place to protect your
            data from unauthorized access, disclosure, or modification.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
          <p className="mb-4">
            Your personal data is retained for the duration of your active membership plus two years.  
            This includes profile data, registration details, payments, and all historical image rights records.  
            Email addresses are retained for <span className="font-bold">proof of payments and image consent</span>, even after profile deletion, strictly
            for legal and administrative purposes.
          </p>

          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p className="mb-4">
            Under the GDPR, you have the following rights regarding your personal data:
            <ul className="list-disc list-inside">
              <li>Access your personal data and obtain a copy.</li>
              <li>Request rectification of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data, with the exception of data required for legal proof of payments and historical image rights.</li>
              <li>Restrict or object to certain processing activities.</li>
              <li>Modify your consent for image rights; all modifications are historized for proof.</li>
              <li>Withdraw consent for optional data processing (not affecting legal or historic records).</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold mb-2">7. Legal Basis</h2>
          <p className="mb-4">
            The club processes your data under the following legal bases:
            <ul className="list-disc list-inside">
              <li>Performance of a contract: membership and registration management.</li>
              <li>Legal obligation: retaining payment records and historical image rights for proof in case of disputes.</li>
              <li>Legitimate interests: promoting club activities, historical record keeping, and legal compliance.</li>
              <li>Consent: optional communications and image rights modifications, except where required for legal proof.</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold mb-2">8. Data Sharing</h2>
          <p className="mb-4">
            Your data is never sold or shared with third parties for marketing purposes. It may be accessed by authorized
            club personnel for membership management, financial auditing, historical records, and legal compliance.
          </p>

          <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
          <p>
            For any questions regarding your personal data, to exercise your rights, or to raise a complaint, please
            contact our Data Protection Officer at: <a href={`mailto:${gpdrEmail}`}>{gpdrEmail}</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
