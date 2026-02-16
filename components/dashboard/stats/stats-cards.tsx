import { CreditCard, Sparkles } from 'lucide-react';

import { Profile, UserPlan } from '@/types/database';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLAN_LABELS: Record<UserPlan, string> = {
  max: 'Max',
  pro: 'Pro',
  free: 'Free',
};

const PLAN_CREDITS: Record<UserPlan, string> = {
  max: '2,000 Credits/Month',
  pro: '500 Credits/Month',
  free: '10 Credits/Month',
};

interface StatsCardsProps {
  profile: Profile | null;
}

export function StatsCards({ profile }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
          <Sparkles className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(profile?.credits_subscription || 0) + (profile?.credits_purchased || 0)}
          </div>
          <p className="text-muted-foreground text-xs">
            Sub: {profile?.credits_subscription || 0} / Add: {profile?.credits_purchased || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plan</CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{PLAN_LABELS[profile?.plan ?? 'free']}</div>
          <p className="text-muted-foreground text-xs">{PLAN_CREDITS[profile?.plan ?? 'free']}</p>
        </CardContent>
      </Card>
    </div>
  );
}
