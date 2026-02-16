import { CheckCircle2 } from 'lucide-react';

import { UserPlan } from '@/types/database';

import { Alert, AlertDescription } from '@/components/ui/alert';

const PLAN_ALERTS: Partial<Record<UserPlan, string>> = {
  pro: "You're currently on the Pro plan with 500 monthly credits and access to all premium features.",
  max: "You're currently on the Max plan with 2,000 monthly credits and priority support.",
};

interface PlanAlertProps {
  plan: UserPlan;
}

export function PlanAlert({ plan }: PlanAlertProps) {
  const message = PLAN_ALERTS[plan];
  if (!message) return null;

  return (
    <Alert>
      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
