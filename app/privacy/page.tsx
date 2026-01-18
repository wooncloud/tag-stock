import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy | TagStock',
  description: "Check TagStock's policy on personal information collection and processing.",
};

export default function PrivacyPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 13, 2026</p>
        </div>

        {/* Content */}
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>TagStock Privacy Policy</CardTitle>
            <CardDescription>
              TagStock (hereinafter referred to as the &quot;Company&quot;) complies with relevant
              laws such as the Act on Promotion of Information and Communications Network
              Utilization and Information Protection, and the Personal Information Protection Act.
              We have established and disclosed this Privacy Policy to protect users&apos; personal
              information and to promptly handle related grievances.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <section className="space-y-6">
              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  1. Items and Methods of Personal Information Collection
                </h2>

                <h3 className="mt-4 mb-3 text-xl font-semibold">
                  1.1 Items of Personal Information Collected
                </h3>
                <p className="text-muted-foreground mb-3">
                  The company collects the following personal information to provide services:
                </p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Required Items:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>Email Address</li>
                      <li>Password (Stored encrypted)</li>
                      <li>Name or Nickname</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Optional Items:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>Profile Picture</li>
                      <li>Phone Number</li>
                      <li>Company Name (for corporate members)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Automatically Collected Items:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>IP Address</li>
                      <li>Cookies</li>
                      <li>Service Usage Records</li>
                      <li>Access Logs</li>
                      <li>Device Information (Browser type, OS, etc.)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="mt-4 mb-3 text-xl font-semibold">
                  1.2 Methods of Personal Information Collection
                </h3>
                <ul className="text-muted-foreground ml-4 list-inside list-disc">
                  <li>Direct input by users during sign-up and service use</li>
                  <li>Automatic collection through generated information collection tools</li>
                  <li>Collection during consultation through the customer center</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  2. Purpose of Collection and Use of Personal Information
                </h2>
                <p className="text-muted-foreground mb-3">
                  The company uses the collected personal information for the following purposes:
                </p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Service Provision:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>AI-based image analysis and metadata generation</li>
                      <li>Provision of customized services to members</li>
                      <li>Content provision and management</li>
                      <li>Credit management and payment processing</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Member Management:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>Identity verification and member identification</li>
                      <li>Prevention of unauthorized use and unauthorized access</li>
                      <li>Confirmation of intention to join</li>
                      <li>Preservation of records for dispute meditation</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Service Improvement and Marketing:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>Development of new services and provision of customized services</li>
                      <li>Statistics on service use</li>
                      <li>
                        Provision of event and advertising information (only for consenting members)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  3. Retention and Use Period of Personal Information
                </h2>
                <p className="text-muted-foreground mb-3">
                  In principle, the company destroys the information without delay after the purpose
                  of collecting and using personal information is achieved. However, the following
                  information is preserved for the period specified below for the reasons stated:
                </p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Upon Membership Withdrawal:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>Personal information destroyed immediately upon withdrawal</li>
                      <li>
                        However, email addresses are hashed and stored for 1 year to prevent
                        unauthorized use
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Retention According to Relevant Laws:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc space-y-1">
                      <li>
                        Records on contracts or withdrawal of subscription: 5 years (Electronic
                        Commerce Act)
                      </li>
                      <li>
                        Records on payment and supply of goods: 5 years (Electronic Commerce Act)
                      </li>
                      <li>
                        Records on consumer complaints or dispute handling: 3 years (Electronic
                        Commerce Act)
                      </li>
                      <li>
                        Website visit records: 3 months (Protection of Communications Secrets Act)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  4. Destruction Procedure and Method of Personal Information
                </h2>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Destruction Procedure:</p>
                    <p className="text-muted-foreground ml-4">
                      Information entered by the user is stored for a certain period according to
                      internal policies and relevant laws after the purpose is achieved, and then
                      destroyed. This personal information will not be used for any purpose other
                      than retention unless required by law.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Destruction Method:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>
                        Electronic files: Permanently deleted so they cannot be recovered or
                        reproduced
                      </li>
                      <li>
                        Personal information printed on paper: Shredded with a shredder or
                        incinerated
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  5. Provision of Personal Information to Third Parties
                </h2>
                <p className="text-muted-foreground">
                  In principle, the company does not provide users&apos; personal information to
                  third parties. However, exceptions are made in the following cases:
                </p>
                <ul className="text-muted-foreground mt-3 ml-4 list-inside list-disc">
                  <li>When users have consented in advance</li>
                  <li>
                    When required by law or requested by investigative agencies according to
                    procedures and methods prescribed by law for investigative purposes
                  </li>
                </ul>

                <div className="mt-4 ml-4">
                  <p className="mb-2 font-semibold">Payment Services:</p>
                  <ul className="text-muted-foreground ml-4 list-inside list-disc">
                    <li>Recipient: Payment gateway providers (e.g., Stripe, Toss Payments)</li>
                    <li>Purpose: Payment processing and identity verification</li>
                    <li>Items provided: Name, email, payment information</li>
                    <li>Retention and use period: 5 years after the transaction ends</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  6. Entrustment of Personal Information Processing
                </h2>
                <p className="text-muted-foreground mb-3">
                  The company entrusts personal information as follows to improve services, and
                  prescribes necessary matters so that personal information can be safely managed
                  during trust contracts according to relevant laws:
                </p>

                <div className="text-muted-foreground ml-4 space-y-2">
                  <li>• Supabase: Database and authentication services</li>
                  <li>• Amazon Web Services (AWS): Cloud server hosting</li>
                  <li>• Google Cloud Platform: AI model services</li>
                  <li>• Stripe: Payment and subscription management</li>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  7. Rights of Users and Legal Representatives and How to Exercise Them
                </h2>
                <p className="text-muted-foreground mb-3">
                  Users can exercise the following rights at any time:
                </p>
                <ul className="text-muted-foreground ml-4 list-inside list-disc">
                  <li>Request to view personal information</li>
                  <li>Request Correction of errors in personal information</li>
                  <li>Request deletion of personal information</li>
                  <li>Request suspension of personal information processing</li>
                </ul>
                <p className="text-muted-foreground mt-3 ml-4">
                  Rights can be exercised in writing or by email, and the company will take action
                  without delay.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  8. Technical/Managerial Measures for Personal Information Protection
                </h2>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Technical Measures:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>
                        Encryption of personal information (passwords, sensitive information, etc.)
                      </li>
                      <li>
                        Installation of security programs to protect against hacking or computer
                        viruses
                      </li>
                      <li>Periodic security updates and inspections</li>
                      <li>Encrypted communication through SSL/TLS</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">Managerial Measures:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>
                        Minimization and regular training of employees handling personal information
                      </li>
                      <li>
                        Operation of a dedicated department for personal information protection
                      </li>
                      <li>Access right management and access record keeping</li>
                      <li>Establishment and implementation of internal management plans</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">9. Operation of Cookies</h2>
                <p className="text-muted-foreground mb-3">
                  The company uses cookies to provide individualized customized services to users.
                </p>

                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Purpose of Cookie Use:</p>
                    <ul className="text-muted-foreground ml-4 list-inside list-disc">
                      <li>Maintaining login status</li>
                      <li>Providing user-specific customized services</li>
                      <li>Analyzing service usage statistics</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold">How to Refuse Cookie Settings:</p>
                    <p className="text-muted-foreground ml-4">
                      You can refuse to store cookies through browser settings. However, if you
                      refuse to store cookies, you may have difficulty using some services.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  10. Personal Information Protection Officer
                </h2>
                <p className="text-muted-foreground mb-3">
                  The company is responsible for overall tasks related to personal information
                  processing and designates a personal information protection officer as follows to
                  handle user complaints and remedy damages related to personal information
                  processing:
                </p>

                <div className="bg-muted ml-4 rounded-lg p-4">
                  <p className="mb-2 font-semibold">Personal Information Protection Officer</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Name: TagStock Admin</li>
                    <li>Position: Privacy Team Lead</li>
                    <li>Email: privacy@tagstock</li>
                    <li>Phone: +82-2-1234-5678</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">11. Changes to the Privacy Policy</h2>
                <p className="text-muted-foreground">
                  This Privacy Policy will be applied from January 13, 2026. If there are additions,
                  deletions, or corrections to the content according to laws and policies, they will
                  be notified through announcements 7 days before the implementation of the changes.
                </p>
              </div>

              <div className="bg-muted mt-8 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Announcement Date:</strong> January 13, 2026
                  <br />
                  <strong>Effective Date:</strong> January 13, 2026
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
