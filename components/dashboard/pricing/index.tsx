'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { createSubscriptionCheckout, manageBilling } from '@/app/actions/stripe';

import { PricingCard } from './pricing-card';

interface PricingCardsProps {
  currentPlan: 'free' | 'pro';
  hasCustomerId: boolean;
}

const PRICE_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_monthly',
  pro_yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || 'price_yearly',
};

export function PricingCards({ currentPlan, hasCustomerId }: PricingCardsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (priceId: string) => {
    setIsLoading(true);
    try {
      await createSubscriptionCheckout(priceId);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      await manageBilling();
    } catch (error) {
      console.error('Billing management error:', error);
      alert('Failed to open billing portal. Please try again.');
      setIsLoading(false);
    }
  };

  const currentPriceId = billingCycle === 'monthly' ? PRICE_IDS.pro_monthly : PRICE_IDS.pro_yearly;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={billingCycle === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('monthly')}
          disabled={isLoading}
          className="cursor-pointer"
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('yearly')}
          disabled={isLoading}
          className="cursor-pointer"
        >
          Yearly
          <Badge variant="secondary" className="ml-2">
            Save 17%
          </Badge>
        </Button>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <PricingCard
          title="Free"
          description="Perfect for trying out TagStock"
          price="$0"
          period="per month"
          features={[
            '10 credits per month',
            'AI-powered tagging',
            'Adobe Stock/Shutterstock optimization',
            'Export metadata',
          ]}
          isCurrentPlan={currentPlan === 'free'}
          isLoading={isLoading}
          buttonText={currentPlan === 'free' ? 'Current Plan' : 'Select Free'}
          buttonVariant="outline"
          onAction={() => {}}
        />

        <PricingCard
          title="Pro"
          description="For professional stock photographers"
          price={billingCycle === 'monthly' ? '$19' : '$190'}
          period={`per ${billingCycle === 'monthly' ? 'month' : 'year'}`}
          features={[
            'Unlimited credits',
            'IPTC/XMP metadata embedding',
            'Batch processing',
            'Priority processing',
            'Email support',
            'All Free features',
          ]}
          isCurrentPlan={currentPlan === 'pro'}
          isPopular={true}
          isLoading={isLoading}
          buttonText={currentPlan === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
          onAction={() =>
            currentPlan === 'pro' ? handleManageBilling() : handleSubscribe(currentPriceId)
          }
        />
      </div>
    </div>
  );
}
