import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getProfile } from '@/lib/supabase/profile';
import { createClient } from '@/lib/supabase/server';

import { DashboardHeader } from '@/components/dashboard/layout/header';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const profile = await getProfile(supabase, user.id, user.email!);

  const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        userEmail={user.email || ''}
        userInitial={userInitial}
        creditsRemaining={(profile?.credits_subscription || 0) + (profile?.credits_purchased || 0)}
        plan={profile?.plan || 'free'}
      />

      <main className="bg-muted/40 flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
