import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Decrements user credits using the database RPC function
 * The RPC function handles the priority: subscription credits first, then purchased credits
 */
export async function decrementCredits(
  supabase: SupabaseClient,
  userId: string,
  amount: number = 1
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.rpc('decrement_user_credits', {
    user_uuid: userId,
    amount,
  });

  if (error) {
    console.error('Failed to decrement credits:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Checks if user has sufficient credits
 */
export function hasEnoughCredits(
  subscriptionCredits: number | null,
  purchasedCredits: number | null,
  required: number = 1
): boolean {
  const total = (subscriptionCredits || 0) + (purchasedCredits || 0);
  return total >= required;
}

/**
 * Gets total available credits for a user
 */
export function getTotalCredits(
  subscriptionCredits: number | null,
  purchasedCredits: number | null
): number {
  return (subscriptionCredits || 0) + (purchasedCredits || 0);
}
