import { redirect } from 'next/navigation';

import { CheckCircle2 } from 'lucide-react';

import { ensureAuthenticated } from '@/lib/supabase/auth';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { PricingCards } from '@/components/dashboard/pricing';

export default async function PricingPage() {
  let session;
  try {
    session = await ensureAuthenticated();
  } catch {
    redirect('/');
  }

  const { profile } = session;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground mt-1">Choose the plan that works best for you</p>
      </div>

      {profile.plan === 'pro' && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <AlertDescription>
            You&apos;re currently on the <strong>Pro</strong> plan with 500 monthly credits and
            access to all premium features.
          </AlertDescription>
        </Alert>
      )}

      <PricingCards currentPlan={profile.plan} />

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>See what&apos;s included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Feature</th>
                  <th className="px-4 py-3 text-center">Free</th>
                  <th className="bg-primary/5 px-4 py-3 text-center font-bold">Pro</th>
                  <th className="text-muted-foreground px-4 py-3 text-center">Max</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">Price</td>
                  <td className="px-4 py-3 text-center">$0</td>
                  <td className="bg-primary/5 px-4 py-3 text-center font-medium">$5/mo</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">$19/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Credits per month</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="bg-primary/5 px-4 py-3 text-center font-medium">500</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">2,000</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">AI-powered tagging</td>
                  <td className="px-4 py-3 text-center">✓</td>
                  <td className="bg-primary/5 px-4 py-3 text-center">✓</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Image quality</td>
                  <td className="px-4 py-3 text-center">Compressed</td>
                  <td className="bg-primary/5 px-4 py-3 text-center font-medium">Original</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">Original</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">IPTC/XMP metadata embedding</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="bg-primary/5 px-4 py-3 text-center">✓</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Multi-upload (up to 10)</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="bg-primary/5 px-4 py-3 text-center">✓</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Credit rollover</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="bg-primary/5 px-4 py-3 text-center">-</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">Up to 1,000</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Priority support</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="bg-primary/5 px-4 py-3 text-center">-</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
