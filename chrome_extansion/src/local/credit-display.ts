import { getTotalCredits } from '../lib/supabase/credits';
import { getProfile, getUser } from '../lib/supabase/user';
import { setCurrentProfile } from './state';

export async function refreshCredits(): Promise<void> {
  const user = await getUser();
  if (!user) return;

  const profile = await getProfile(user.id);
  if (profile) {
    setCurrentProfile(profile);
    const el = document.getElementById('creditDisplay');
    if (el) {
      el.textContent = getTotalCredits(profile).toString();
    }
    const planBadge = document.getElementById('planBadge');
    if (planBadge) {
      planBadge.textContent = profile.plan;
    }
  }
}
