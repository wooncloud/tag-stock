import { cache } from 'react';

import { SupabaseClient } from '@supabase/supabase-js';

export const getProfile = cache(async (supabase: SupabaseClient, userId: string, email: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile || error) {
    // Attempt to create profile if missing
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        plan: 'free',
        credits_subscription: 10,
        credits_purchased: 0,
      })
      .select()
      .single();

    if (!insertError) {
      return newProfile;
    }

    // If inset fails, return a default object to prevent redirect loops
    return {
      id: userId,
      email: email,
      plan: 'free' as const,
      credits_subscription: 0,
      credits_purchased: 0,
    };
  }

  return profile;
});
