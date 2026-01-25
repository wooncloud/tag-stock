import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Upload } from 'lucide-react';

import { ImageWithMetadata } from '@/types/image';

import { ensureAuthenticated } from '@/lib/supabase/auth';
import { getSignedUrls } from '@/lib/supabase/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { ImageGallery } from '@/components/dashboard/image-gallery';
import { EmptyState } from '@/components/dashboard/shared/empty-state';

export default async function ImagesPage() {
  let session;
  try {
    session = await ensureAuthenticated();
  } catch {
    redirect('/');
  }

  const { user, profile, supabase } = session;

  const { data: images } = await supabase
    .from('images')
    .select(
      `
      *,
      metadata (*)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const imagesWithUrls = await getSignedUrls(supabase, images);

  const hasImages = imagesWithUrls && imagesWithUrls.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Images</h1>
          <p className="text-muted-foreground mt-1">
            Manage your uploaded images and their metadata
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Link>
        </Button>
      </div>

      {hasImages ? (
        <ImageGallery
          images={imagesWithUrls as ImageWithMetadata[]}
          isPro={profile?.plan === 'pro'}
        />
      ) : (
        <Card>
          <CardContent className="py-16">
            <EmptyState />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
