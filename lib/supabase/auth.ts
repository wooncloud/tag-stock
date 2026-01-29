import { cookies } from 'next/headers';

import { SupabaseClient, User } from '@supabase/supabase-js';

import { Profile } from '@/types/database';

import { getProfile } from './profile';
import { createClient } from './server';

export interface AuthenticatedSession {
  user: User;
  profile: Profile;
  supabase: SupabaseClient;
}

/**
 * Lightweight auth check for checkout operations (no profile fetch)
 */
export interface LightAuthSession {
  user: User;
  supabase: SupabaseClient;
}

export async function ensureAuthenticatedLight(): Promise<LightAuthSession> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  return { user, supabase };
}

export async function ensureAuthenticated(): Promise<AuthenticatedSession> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const profile = await getProfile(supabase, user.id, user.email!);

  if (!profile) {
    throw new Error('Profile not found');
  }

  return { user, profile, supabase };
}
