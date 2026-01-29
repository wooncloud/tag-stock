'use client';

import { Check } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out TagStock</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <PricingFeature text="10 credits per month" />
                <PricingFeature text="AI-powered tagging" />
                <PricingFeature text="Compressed image storage" />
                <PricingFeature text="Export metadata" />
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-primary relative flex scale-105 flex-col border-2 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold">
                Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For professional photographers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <PricingFeature text="500 credits per month" bold />
                <PricingFeature text="Original quality preserved" />
                <PricingFeature text="IPTC/XMP metadata embedding" bold />
                <PricingFeature text="Up to 10 images at once" />
                <PricingFeature text="All Free features" />
              </ul>
            </CardContent>
          </Card>

          {/* Max Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Max</CardTitle>
              <CardDescription>For high-volume creators</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <PricingFeature text="2,000 credits per month" />
                <PricingFeature text="Priority support" />
                <PricingFeature text="Early access to new features" />
                <PricingFeature text="All Pro features" />
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Credit Packs */}
        <div className="mt-16 text-center">
          <h3 className="mb-6 text-2xl font-bold">Need more credits?</h3>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Credit Pack S</CardTitle>
                <CardDescription>100 credits for one-time use</CardDescription>
                <div className="mt-2 text-2xl font-bold">$2</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Credit Pack L</CardTitle>
                <CardDescription>1,000 credits for one-time use</CardDescription>
                <div className="mt-2 text-2xl font-bold">$15</div>
              </CardHeader>
            </Card>
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
