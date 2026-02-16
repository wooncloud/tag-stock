'use client';

import { useState } from 'react';

import type { UserPlan } from '@/types/database';

import { BillingCycleToggle } from './components/billing-cycle-toggle';
import { CreditPacks } from './components/credit-packs';
import { CreditPolicy } from './components/credit-policy';
import { PricingCard } from './components/pricing-card';
import { useBilling } from './hooks/use-billing';
import { getPlanAction } from './lib/plan-actions';
import { PLANS, getVariantId } from './lib/plans';

interface PricingCardsProps {
  currentPlan: UserPlan;
}

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { isLoading, handlePlanAction, handleCreditPackPurchase } = useBilling();

  return (
    <div className="space-y-6">
      <BillingCycleToggle
        billingCycle={billingCycle}
        onCycleChange={setBillingCycle}
        disabled={isLoading}
      />

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const action = getPlanAction(currentPlan, plan.plan);
          return (
            <PricingCard
              key={plan.plan}
              title={plan.title}
              description={plan.description}
              price={plan.plan === 'free' ? '$0' : plan.price[billingCycle]}
              period={
                plan.plan === 'free'
                  ? 'per month'
                  : `per ${billingCycle === 'monthly' ? 'month' : 'year'}`
              }
              features={plan.features}
              isCurrentPlan={currentPlan === plan.plan}
              isPopular={plan.isPopular}
              isLoading={isLoading}
              buttonText={action.text}
              buttonVariant={action.variant}
              disabled={action.disabled}
              onAction={() => handlePlanAction(action, getVariantId(plan.plan, billingCycle))}
            />
          );
        })}
      </div>

      <CreditPacks isLoading={isLoading} onPurchase={handleCreditPackPurchase} />
      <CreditPolicy />
    </div>
  );
}
