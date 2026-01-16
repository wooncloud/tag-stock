import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from '@/components/dashboard/image-gallery';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { getProfile } from '@/lib/supabase/profile';

export default async function ImagesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const profile = await getProfile(supabase, user.id, user.email!);

  const { data: images } = await supabase
    .from('images')
    .select(`
      *,
      metadata (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 이미지용 Signed URL 생성
  let imagesWithUrls = images || [];
  if (images && images.length > 0) {
    const { data: signedUrls } = await supabase.storage
      .from('user-images')
      .createSignedUrls(
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
        <ImageGallery images={imagesWithUrls as any[]} isPro={profile?.plan === 'pro'} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Upload your first image to get started with AI-powered metadata generation
            </p>
            <Button asChild>
              <Link href="/dashboard/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Image
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
