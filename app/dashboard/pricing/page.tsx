import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CheckCircle2 } from 'lucide-react';

import { getProfile } from '@/lib/supabase/profile';
import { createClient } from '@/lib/supabase/server';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { PricingCards } from '@/components/dashboard/pricing';

export default async function PricingPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const profile = await getProfile(supabase, user.id, user.email!);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground mt-1">Choose the plan that works best for you</p>
      </div>

      {profile.plan === 'pro' && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            You&apos;re currently on the <strong>Pro</strong> plan. You have unlimited credits and
            access to all premium features.
          </AlertDescription>
        </Alert>
      )}

      <PricingCards currentPlan={profile.plan} hasCustomerId={!!profile.stripe_customer_id} />

      {/* 요금제별 기능 비교 */}
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
                  <th className="px-4 py-3 text-center">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">AI-powered tagging</td>
                  <td className="px-4 py-3 text-center">✓</td>
                  <td className="px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Credits per month</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Adobe Stock/Shutterstock optimization</td>
                  <td className="px-4 py-3 text-center">✓</td>
                  <td className="px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">IPTC/XMP metadata embedding</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Batch processing</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Priority processing</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Email support</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
