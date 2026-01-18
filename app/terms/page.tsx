import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service | TagStock',
  description: "Check TagStock's terms of service.",
};

export default function TermsPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 13, 2026</p>
        </div>

        {/* Content */}
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>TagStock Terms of Service</CardTitle>
            <CardDescription>
              These terms govern the conditions of use, procedures, rights and obligations of the
              services provided by TagStock.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <section className="space-y-6">
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 1 (Purpose)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The purpose of these terms is to prescribe the rights, obligations and
                  responsibilities between the Company and the User, and other necessary matters
                  related to the use of the AI-based stock photo metadata generation service
                  (hereinafter referred to as the &quot;Service&quot;) provided by TagStock
                  (hereinafter referred to as the &quot;Company&quot;).
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 2 (Definition of Terms)</h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    &quot;Service&quot; refers to the AI-based image analysis and metadata
                    generation service provided by the company.
                  </li>
                  <li>
                    &quot;Member&quot; refers to a person who has agreed to these terms and has
                    entered into a service use agreement with the company.
                  </li>
                  <li>
                    &quot;Credit&quot; refers to a virtual currency unit for using the service.
                  </li>
                  <li>
                    &quot;Content&quot; refers to all materials generated or uploaded by a member
                    using the service.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Article 3 (Effect and Change of Terms)
                </h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    These terms shall take effect for all members who wish to use the service.
                  </li>
                  <li>
                    The company may change these terms within the scope that does not violate
                    relevant laws if necessary.
                  </li>
                  <li>
                    If the terms are changed, the company will announce the changes 7 days before
                    the implementation date.
                  </li>
                  <li>
                    If a member does not agree to the changed terms, they may stop using the service
                    and withdraw.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 4 (Membership)</h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    Membership is concluded by the service user agreeing to these terms, filling in
                    the information according to the sign-up form set by the company, and the
                    company accepting the application.
                  </li>
                  <li>
                    The company may refuse membership in the following cases:
                    <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                      <li>
                        When it is not a real name or another person&apos;s information is stolen
                      </li>
                      <li>When false information is provided</li>
                      <li>When the user is under 14 years old</li>
                      <li>
                        When registering as a member is judged to be significantly hindered by the
                        company&apos;s technology
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 5 (Provision of Services)</h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    The company provides the following services:
                    <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                      <li>AI-based image analysis and tag generation</li>
                      <li>Automatic generation of image titles and descriptions</li>
                      <li>Keyword optimization and suggestions</li>
                      <li>Bulk metadata editing and export</li>
                    </ul>
                  </li>
                  <li>In principle, the service is provided 24 hours a day, 365 days a year.</li>
                  <li>
                    The company may temporarily suspend service provision for reasons such as system
                    inspection, maintenance, or replacement, and will announce this in advance.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 6 (Credits and Payment)</h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    Credits are required to use the service, and members can purchase credits for a
                    fee.
                  </li>
                  <li>
                    The validity period of credits is 1 year from the date of purchase, and they
                    will be automatically extinguished when the period expires.
                  </li>
                  <li>
                    Payment is conducted by methods set by the company, such as credit card or
                    account transfer.
                  </li>
                  <li>
                    Refund Policy:
                    <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                      <li>Unused credits can be fully refunded within 7 days of purchase.</li>
                      <li>
                        If partially used, a refund of the remaining amount excluding the used
                        credits is possible.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Article 7 (Copyright and Intellectual Property Rights)
                </h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    Copyright and intellectual property rights for the service, software, designs,
                    etc., provided by the company belong to the company.
                  </li>
                  <li>
                    The copyright for images uploaded by the member and generated metadata belongs
                    to the member.
                  </li>
                  <li>
                    The company may use anonymized data to improve services and train AI models.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 8 (Obligations of Members)</h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    Members must not engage in the following acts:
                    <ul className="mt-2 ml-4 list-inside list-disc space-y-1">
                      <li>Theft or unauthorized use of another person&apos;s information</li>
                      <li>Uploading illegal or obscene content</li>
                      <li>Acts that interfere with the normal operation of the service</li>
                      <li>Acts that infringe on the company&apos;s intellectual property rights</li>
                      <li>Other acts that violate relevant laws</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Article 9 (Restriction on Service Use)
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If a member violates these terms or interferes with the normal operation of the
                  service, the company may restrict the use of the service or terminate the contract
                  without prior notice.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">Article 10 (Disclaimer)</h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    The company is not responsible for service interruption due to force majeure
                    such as natural disasters, war, or suspension of service by telecommunications
                    providers.
                  </li>
                  <li>
                    The company does not guarantee the accuracy, reliability, or legality of content
                    generated by members.
                  </li>
                  <li>
                    The company is not obligated to intervene in disputes between members or between
                    members and third parties.
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Article 11 (Governing Law and Jurisdiction)
                </h2>
                <ol className="text-muted-foreground list-inside list-decimal space-y-2">
                  <li>
                    Republic of Korea laws apply to disputes regarding these terms and service use.
                  </li>
                  <li>
                    The court having jurisdiction over the location of the company&apos;s
                    headquarters shall be the exclusive jurisdictional court for disputes arising in
                    connection with service use.
                  </li>
                </ol>
              </div>

              <div className="bg-muted mt-8 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Addendum</strong>
                  <br />
                  These terms will take effect on January 13, 2026.
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
