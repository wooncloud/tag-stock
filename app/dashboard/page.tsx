import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { CreditCard, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';

import { getProfile } from '@/lib/supabase/profile';
import { createClient } from '@/lib/supabase/server';
import { getDisplayName } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { EmptyState } from '@/components/dashboard/shared/empty-state';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile(supabase, user.id, user.email!);

  const { data: images, count } = await supabase
    .from('images')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Generate Signed URLs for images
  let imagesWithUrls = images || [];
  if (images && images.length > 0) {
    const { data: signedUrls } = await supabase.storage.from('user-images').createSignedUrls(
      images.map((img) => img.storage_path),
      3600
    );

    if (signedUrls) {
      imagesWithUrls = images.map((img, index) => ({
        ...img,
        url: signedUrls[index]?.signedUrl,
      }));
    }
  }

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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <Sparkles className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.credits_remaining || 0}</div>
            <p className="text-muted-foreground text-xs">
              {profile?.plan === 'pro' ? 'Unlimited' : 'This Month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count || 0}</div>
            <p className="text-muted-foreground text-xs">Total uploaded images</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.plan === 'pro' ? 'Pro' : 'Free'}</div>
            <p className="text-muted-foreground text-xs">
              {profile?.plan === 'pro' ? 'Unlimited Credits' : '10 Credits/Month'}
            </p>
          </CardContent>
        </Card>
      </div>

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
          {hasImages ? (
            <div className="space-y-4">
              {imagesWithUrls.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted relative flex h-12 w-12 items-center justify-center overflow-hidden rounded border">
                      {image.url ? (
                        <Image
                          src={image.url}
                          alt={image.original_filename}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-muted-foreground h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {getDisplayName(image.original_filename)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        image.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : image.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : image.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {image.status === 'completed'
                        ? 'Completed'
                        : image.status === 'processing'
                          ? 'Processing'
                          : image.status === 'failed'
                            ? 'Failed'
                            : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
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
