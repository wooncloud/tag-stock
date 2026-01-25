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
