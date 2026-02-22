'use client';

import { Check } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CREDIT_PACKS, PLANS } from '@/components/dashboard/pricing/lib/plans';

export function PricingPreviewSection() {
  return (
    <section id="pricing" className="border-t">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">Simple Pricing</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Choose the plan that fits your project scale
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.plan}
              className={`flex flex-col ${plan.isPopular ? 'border-primary relative scale-105 border-2 shadow-lg' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <PricingFeature
                      key={feature}
                      text={feature}
                      bold={plan.isPopular && i < 2}
                    />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit Packs */}
        <div className="mt-16 text-center">
          <h3 className="mb-6 text-2xl font-bold">Need more credits?</h3>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {CREDIT_PACKS.map((pack) => (
              <Card key={pack.name}>
                <CardHeader>
                  <CardTitle className="text-xl">{pack.name}</CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                  <div className="mt-2 text-2xl font-bold">{pack.price}</div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Credit Policy */}
        <div className="bg-muted/50 mt-16 rounded-2xl p-8">
          <h3 className="mb-6 text-center text-2xl font-bold">Credit Policy</h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-primary mb-3 font-semibold">Monthly Grants & Resets</h4>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                Every month, your subscription credits are refreshed. Unused subscription credits
                reset to zero at the end of the billing cycle. This helps us maintain high-speed
                processing for all active users.
              </p>
            </div>
            <div>
              <h4 className="text-primary mb-3 font-semibold">Priority Consumption</h4>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                When you generate tags, we always consume your <strong>Subscription Credits</strong>{' '}
                first. <strong>Purchased Credits</strong> (from Credit Packs) are only used once
                your monthly subscription credits are fully exhausted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingFeature({ text, bold }: { text: string; bold?: boolean }) {
  return (
    <li className="flex items-center">
      <Check className="mr-2 h-5 w-5 shrink-0 text-green-600" />
      <span className={bold ? 'font-semibold' : ''}>{text}</span>
    </li>
  );
}
