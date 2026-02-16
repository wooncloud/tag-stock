import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Chrome, Sparkles } from 'lucide-react';

import { ensureAuthenticated } from '@/lib/supabase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { StatsCards } from '@/components/dashboard/stats/stats-cards';

export default async function DashboardPage() {
  let session;
  try {
    session = await ensureAuthenticated();
  } catch {
    redirect('/login');
  }

  const { profile } = session;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello! 👋</h1>
        <p className="text-muted-foreground mt-1">
          Automatically generate stock photo metadata with AI
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards profile={profile} />

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get started with TagStock</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Button asChild variant="outline" className="h-auto p-6">
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2"
            >
              <Chrome className="h-8 w-8" />
              <span className="font-semibold">Chrome Extension</span>
              <span className="text-muted-foreground text-center text-xs">
                Install the extension to tag your stock photos
              </span>
            </a>
          </Button>

          <Button asChild variant="outline" className="h-auto p-6">
            <Link href="/dashboard/pricing" className="flex flex-col items-center gap-2">
              <Sparkles className="h-8 w-8" />
              <span className="font-semibold">Upgrade to Pro</span>
              <span className="text-muted-foreground text-center text-xs">
                Unlimited credits and IPTC metadata embedding
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
