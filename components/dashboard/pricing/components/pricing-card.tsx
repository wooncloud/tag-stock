'use client';

import { Check, Clock, Loader2, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isCurrentPlan: boolean;
  isPopular?: boolean;
  isLoading: boolean;
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  onAction: () => void;
  showBadge?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
}

export function PricingCard({
  title,
  description,
  price,
  period,
  features,
  isCurrentPlan,
  isPopular,
  isLoading,
  buttonText,
  buttonVariant = 'default',
  onAction,
  disabled,
  comingSoon,
}: PricingCardProps) {
  return (
    <Card
      className={`${isCurrentPlan ? 'border-primary' : isPopular ? 'border-primary border-2' : ''} ${disabled ? 'opacity-60' : ''}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isPopular && <Sparkles className="text-primary h-5 w-5" />}
            {title}
          </CardTitle>
          {comingSoon ? (
            <Badge variant="outline" className="text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              Coming Soon
            </Badge>
          ) : isCurrentPlan ? (
            <Badge>Current Plan</Badge>
          ) : isPopular ? (
            <Badge variant="secondary">Most Popular</Badge>
          ) : null}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-4xl font-bold">{price}</div>
          <p className="text-muted-foreground text-sm">{period}</p>
        </div>

        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full cursor-pointer"
          variant={buttonVariant}
          onClick={onAction}
          disabled={disabled || isLoading || (isCurrentPlan && buttonText === 'Current Plan')}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {isPopular && !isCurrentPlan && !disabled && <Sparkles className="mr-2 h-4 w-4" />}
              {buttonText}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
