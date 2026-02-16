import { redirect } from 'next/navigation';

import { ensureAuthenticated } from '@/lib/supabase/auth';

import { Separator } from '@/components/ui/separator';

import { ChromeExtensionBanner } from '@/components/dashboard/chrome-extension-banner';
import { FeatureComparison } from '@/components/dashboard/feature-comparison';
import { PlanAlert } from '@/components/dashboard/plan-alert';
import { PricingCards } from '@/components/dashboard/pricing';
import { StatsCards } from '@/components/dashboard/stats/stats-cards';

export default async function DashboardPage() {
  let session;
  try {
    session = await ensureAuthenticated();
  } catch {
    redirect('/login');
  }

  const { profile } = session;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello! 👋</h1>
        <p className="text-muted-foreground mt-1">
          Automatically generate stock photo metadata with AI
        </p>
      </div>

      <div className="p-4">
        <StatsCards profile={profile} />
        <div className="mt-6">
          <PlanAlert plan={profile.plan} />
        </div>
      </div>
      <Separator />
      <div className="p-4">
        <ChromeExtensionBanner />
      </div>
      <Separator />
      <div className="p-4">
        <PricingCards currentPlan={profile.plan} />
        <div className="mt-6">
          <FeatureComparison />
        </div>
      </div>
    </div>
  );
}
