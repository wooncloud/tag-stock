'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BillingCycleToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onCycleChange: (cycle: 'monthly' | 'yearly') => void;
  disabled: boolean;
}

export function BillingCycleToggle({
  billingCycle,
  onCycleChange,
  disabled,
}: BillingCycleToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant={billingCycle === 'monthly' ? 'default' : 'outline'}
        onClick={() => onCycleChange('monthly')}
        disabled={disabled}
        className="cursor-pointer"
      >
        Monthly
      </Button>
      <Button
        variant={billingCycle === 'yearly' ? 'default' : 'outline'}
        onClick={() => onCycleChange('yearly')}
        disabled={disabled}
        className="cursor-pointer"
      >
        Yearly
        <Badge variant="secondary" className="ml-2">
          Save 17%
        </Badge>
      </Button>
    </div>
  );
}
