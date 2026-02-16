import { getUser } from '../lib/supabase/user';
import { refreshCredits } from './credit-display';
import { setupEventListeners } from './event-listeners';
import './local.css';

async function init(): Promise<void> {
  const user = await getUser();

  if (!user) {
    document.body.innerHTML =
      '<div class="flex h-screen items-center justify-center"><p class="text-muted-foreground">Please sign in via the TagStock side panel first.</p></div>';
    return;
  }

  await refreshCredits();
  setupEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
