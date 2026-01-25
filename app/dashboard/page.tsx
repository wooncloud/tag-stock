import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Sparkles, Upload } from 'lucide-react';

import { ensureAuthenticated } from '@/lib/supabase/auth';
import { getSignedUrls } from '@/lib/supabase/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { EmptyState } from '@/components/dashboard/shared/empty-state';
import { RecentImagesList } from '@/components/dashboard/shared/recent-images-list';
import { StatsCards } from '@/components/dashboard/stats/stats-cards';

export default async function DashboardPage() {
  let session;
  try {
    session = await ensureAuthenticated();
  } catch {
    redirect('/login');
  }

  const { user, profile, supabase } = session;

  const { data: images, count } = await supabase
    .from('images')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const imagesWithUrls = await getSignedUrls(supabase, images);

  const hasImages = imagesWithUrls && imagesWithUrls.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hello! 👋</h1>
        <p className="text-muted-foreground mt-1">
          Automatically generate stock photo metadata with AI
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards profile={profile} imageCount={count || 0} />

      {/* Recent Images or Empty State */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Images</CardTitle>
              <CardDescription>List of recently uploaded images</CardDescription>
            </div>
            {hasImages && (
              <Button asChild>
                <Link href="/dashboard/images">View All</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasImages ? <RecentImagesList images={imagesWithUrls} /> : <EmptyState />}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!hasImages && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Take your first step with TagStock</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto p-6">
              <Link href="/dashboard/upload" className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8" />
                <span className="font-semibold">Upload Image</span>
                <span className="text-muted-foreground text-center text-xs">
                  Upload your first image and start AI tagging
                </span>
              </Link>
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
      )}
    </div>
  );
}
