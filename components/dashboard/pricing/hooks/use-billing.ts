'use client';

import { useState } from 'react';

import {
  createCreditPackCheckout,
  createSubscriptionCheckout,
  manageBilling,
} from '@/app/actions/lemonsqueezy';

import type { PlanAction } from '../lib/plan-actions';

async function redirectTo(fn: () => Promise<string>, onError: (error: unknown) => void) {
  try {
    const url = await fn();
    window.location.href = url;
  } catch (error) {
    onError(error);
  }
}

export function useBilling() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (variantId: string) => {
    if (!variantId) {
      alert('Variant ID not configured for Lemon Squeezy');
      return;
    }
    setIsLoading(true);
    await redirectTo(
      () => createSubscriptionCheckout(variantId),
      (error) => {
        console.error('Subscription error:', error);
        alert('Failed to start checkout. Please try again.');
        setIsLoading(false);
      }
    );
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    await redirectTo(
      () => manageBilling(),
      (error) => {
        console.error('Billing management error:', error);
        alert('Failed to open billing portal. Please try again.');
        setIsLoading(false);
      }
    );
  };

  const handleCreditPackPurchase = async (variantId: string) => {
    if (!variantId) {
      alert('Credit pack not configured yet');
      return;
    }
    setIsLoading(true);
    await redirectTo(
      () => createCreditPackCheckout(variantId),
      (error) => {
        console.error('Credit pack purchase error:', error);
        alert('Failed to start checkout. Please try again.');
        setIsLoading(false);
      }
    );
  };

  const handlePlanAction = (action: PlanAction, variantId?: string) => {
    if (action.action === 'manage') return handleManageBilling();
    if (action.action === 'checkout' && variantId) return handleSubscribe(variantId);
  };

  return { isLoading, handlePlanAction, handleCreditPackPurchase };
}
