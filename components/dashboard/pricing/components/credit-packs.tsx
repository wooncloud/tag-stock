'use client';

import { VARIANT_IDS } from '../lib/plans';
import { CreditPackCard } from './credit-pack-card';

interface CreditPacksProps {
  isLoading: boolean;
  onPurchase: (variantId: string) => void;
}

const CREDIT_PACKS = [
  { name: 'Credit Pack S', credits: 100, price: '$2', variantId: VARIANT_IDS.credit_pack_s },
  { name: 'Credit Pack L', credits: 1000, price: '$15', variantId: VARIANT_IDS.credit_pack_l },
];

export function CreditPacks({ isLoading, onPurchase }: CreditPacksProps) {
  return (
    <div className="pt-8">
      <h3 className="mb-6 text-center text-xl font-bold">Additional Credit Packs</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {CREDIT_PACKS.map((pack) => (
          <CreditPackCard
            key={pack.name}
            name={pack.name}
            credits={pack.credits}
            price={pack.price}
            variantId={pack.variantId}
            isLoading={isLoading}
            onPurchase={onPurchase}
          />
        ))}
      </div>
    </div>
  );
}
