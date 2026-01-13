'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { createSubscriptionCheckout, manageBilling } from '@/app/actions/stripe';
import { toast } from 'sonner';

interface PricingCardsProps {
  currentPlan: 'free' | 'pro';
  hasCustomerId: boolean;
}

// 이 정보는 실제 Stripe 가격 ID와 일치해야 합니다.
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
      toast.error('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      await manageBilling();
    } catch (error) {
      console.error('Billing management error:', error);
      toast.error('Failed to open billing portal. Please try again.');
      setIsLoading(false);
    }
  };

  const priceId =
    billingCycle === 'monthly' ? PRICE_IDS.pro_monthly : PRICE_IDS.pro_yearly;

  return (
    <div className="space-y-6">
      {/* 빌링 주기 토글 */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={billingCycle === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('monthly')}
          disabled={isLoading}
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('yearly')}
          disabled={isLoading}
        >
          Yearly
          <Badge variant="secondary" className="ml-2">
            Save 17%
          </Badge>
        </Button>
      </div>

      {/* 요금제 카드 */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* 무료 플랜 */}
        <Card className={currentPlan === 'free' ? 'border-primary' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              {currentPlan === 'free' && (
                <Badge>Current Plan</Badge>
              )}
            </div>
            <CardDescription>Perfect for trying out TagStock</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">10 credits per month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">AI-powered tagging</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Adobe Stock/Shutterstock optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Export metadata</span>
              </li>
            </ul>

            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Pro 플랜 */}
        <Card className={currentPlan === 'pro' ? 'border-primary' : 'border-primary border-2'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Pro
              </CardTitle>
              {currentPlan === 'pro' ? (
                <Badge>Current Plan</Badge>
              ) : (
                <Badge variant="secondary">Most Popular</Badge>
              )}
            </div>
            <CardDescription>For professional stock photographers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-bold">
                ${billingCycle === 'monthly' ? '19' : '190'}
              </div>
              <p className="text-sm text-muted-foreground">
                per {billingCycle === 'monthly' ? 'month' : 'year'}
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-primary font-medium">Save $38/year</p>
              )}
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Unlimited credits</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">IPTC/XMP metadata embedding</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Batch processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Email support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">All Free features</span>
              </li>
            </ul>

            {currentPlan === 'pro' ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleManageBilling}
                disabled={isLoading || !hasCustomerId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Manage Subscription'
                )}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleSubscribe(priceId)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
