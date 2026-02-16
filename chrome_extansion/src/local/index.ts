import { createClient } from '../lib/supabase/client';
import { getTotalCredits } from '../lib/supabase/credits';
import type { UserProfile } from '../shared/types';
import { setupEventListeners } from './event-listeners';
import './local.css';
import { setCurrentProfile } from './state';

function updateCreditDisplay(profile: UserProfile): void {
  const el = document.getElementById('creditDisplay');
  if (el) {
    el.textContent = getTotalCredits(profile).toString();
  }
}

async function init(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    document.body.innerHTML =
      '<div class="flex h-screen items-center justify-center"><p class="text-muted-foreground">Please sign in via the TagStock side panel first.</p></div>';
    return;
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (profile) {
    setCurrentProfile(profile as UserProfile);
    updateCreditDisplay(profile as UserProfile);
  }

  setupEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
