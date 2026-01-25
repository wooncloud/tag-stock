'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { createSubscriptionCheckout, manageBilling } from '@/app/actions/lemonsqueezy';

import { PricingCard } from './pricing-card';

interface PricingCardsProps {
  currentPlan: 'free' | 'pro' | 'max';
}

const VARIANT_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID || '',
  pro_yearly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID || '',
  max_monthly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID || '',
  max_yearly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID || '',
};

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (variantId: string) => {
    if (!variantId) {
      alert('Variant ID not configured for Lemon Squeezy');
      return;
    }
    setIsLoading(true);
    try {
      await createSubscriptionCheckout(variantId);
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

  const currentVariantId =
    billingCycle === 'monthly' ? VARIANT_IDS.pro_monthly : VARIANT_IDS.pro_yearly;
  const maxVariantId =
    billingCycle === 'monthly' ? VARIANT_IDS.max_monthly : VARIANT_IDS.max_yearly;

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

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        <PricingCard
          title="Free"
          description="Perfect for trying out TagStock"
          price="$0"
          period="per month"
          features={[
            '10 credits per month',
            'AI-powered tagging',
            'Compressed image storage',
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
          description="For professional photographers"
          price={billingCycle === 'monthly' ? '$5' : '$50'}
          period={`per ${billingCycle === 'monthly' ? 'month' : 'year'}`}
          features={[
            '500 credits per month',
            'Original quality preserved',
            'IPTC/XMP metadata embedding',
            'Up to 10 images at once',
            'All Free features',
          ]}
          isCurrentPlan={currentPlan === 'pro'}
          isPopular={true}
          isLoading={isLoading}
          buttonText={currentPlan === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
          onAction={() =>
            currentPlan === 'pro' ? handleManageBilling() : handleSubscribe(currentVariantId)
          }
        />

        <PricingCard
          title="Max"
          description="For high-volume creators"
          price={billingCycle === 'monthly' ? '$19' : '$190'}
          period={`per ${billingCycle === 'monthly' ? 'month' : 'year'}`}
          features={[
            '2,000 credits per month',
            'Credit rollover (up to 1,000)',
            'Priority support',
            'Early access to new features',
            'All Pro features',
          ]}
          isCurrentPlan={currentPlan === 'max'}
          isLoading={isLoading}
          buttonText={currentPlan === 'max' ? 'Manage Subscription' : 'Upgrade to Max'}
          onAction={() =>
            currentPlan === 'max' ? handleManageBilling() : handleSubscribe(maxVariantId)
          }
        />
      </div>
    </div>
  );
}
