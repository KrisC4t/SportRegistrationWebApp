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
            GDPR Information
          </CardTitle>
          <CardDescription>How we handle your data</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Data Collection and Usage</h2>
          <p className="mb-4">
            We collect and process your personal data for the purpose of managing your club membership. 
            This includes your name, contact information, and registration details.
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Data Storage and Extraction</h2>
          <p className="mb-4">
            Your data is securely stored in our database and is only accessible to authorized personnel.
            The authorized personnel can extract all registrations to create your license.
            The database service name is supabase and data are stored on the service infrastructure,
            administrator can access to the data.
          </p>

          <h2 className="text-xl font-semibold mb-2">Data Modification</h2>
          <p className="mb-4">
            You can modify your data at any time from the web application.
            Other members can't modify your data from the web application.
            Authorized personnel can modify your role.
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
          <p className="mb-4">
            We retain your data for as long as you are an active member, plus two years. After this period, 
            your data can be deleted by authorized personnel if you haven&#39;t renewed your membership.
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
          <p className="mb-4">
            You have the right to access, rectify, or erase your personal data. You can also request a copy of your data 
            or restrict its processing. To exercise these rights, please contact our data protection officer.
          </p>
          
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>
            For any questions regarding your data or this policy, please contact us at: privacy@selfdefenseclub.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}