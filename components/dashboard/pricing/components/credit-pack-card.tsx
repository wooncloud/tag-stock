'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CreditPackCardProps {
  name: string;
  credits: number;
  price: string;
  variantId: string;
  isLoading: boolean;
  onPurchase: (variantId: string) => void;
}

export function CreditPackCard({
  name,
  credits,
  price,
  variantId,
  isLoading,
  onPurchase,
}: CreditPackCardProps) {
  const isDisabled = isLoading || !variantId;

  return (
    <Card>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-bold">
            {name} ({credits.toLocaleString()})
          </h4>
          <div className="text-xl font-bold">{price}</div>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">One-time purchase credits</p>
        <Button className="w-full" disabled={isDisabled} onClick={() => onPurchase(variantId)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Buy Now'
          )}
        </Button>
      </div>
    </Card>
  );
}
