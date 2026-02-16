import { CreditCard, Sparkles } from 'lucide-react';

import { Profile } from '@/types/database';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <div className="text-2xl font-bold">{profile?.plan === 'pro' ? 'Pro' : 'Free'}</div>
          <p className="text-muted-foreground text-xs">
            {profile?.plan === 'pro' ? 'Unlimited Credits' : '10 Credits/Month'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
