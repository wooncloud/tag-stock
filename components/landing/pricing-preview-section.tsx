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

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <PricingFeature text="10 credits/month" />
                <PricingFeature text="AI Auto-Tagging" />
                <PricingFeature text="Title & Description generation" />
                <PricingFeature text="CSV Export" />
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-purple-600">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-purple-600 px-3 py-1 text-sm font-semibold text-white">
                Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For professionals</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <PricingFeature text="Unlimited Credits" bold />
                <PricingFeature text="AI Auto-Tagging" />
                <PricingFeature text="Title & Description generation" />
                <PricingFeature text="CSV Export" />
                <PricingFeature text="IPTC Metadata Embedding" bold />
                <PricingFeature text="Chrome Extension Access" bold />
                <PricingFeature text="Priority Support" bold />
              </ul>
            </CardContent>
          </Card>
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
