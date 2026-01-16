import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadWorkflow } from '@/components/dashboard/upload-workflow';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { getProfile } from '@/lib/supabase/profile';

export default async function UploadPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const profile = await getProfile(supabase, user.id, user.email!);

  const isOutOfCredits = profile.credits_remaining <= 0 && profile.plan === 'free';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Images</h1>
        <p className="text-muted-foreground mt-1">
          Upload your images and let AI generate optimized metadata
        </p>
      </div>

      {/* 크레딧 경고 */}
      {isOutOfCredits && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              You're out of credits. Upgrade to Pro for unlimited AI tagging.
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 크레딧 정보 */}
      {!isOutOfCredits && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            {profile.plan === 'pro' ? (
              <span>You have unlimited credits as a Pro user.</span>
            ) : (
              <span>
                You have <strong>{profile.credits_remaining}</strong> credits remaining.
                Each image upload uses 1 credit.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* 업로드 컴포넌트 */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Images</CardTitle>
          <CardDescription>
            Supported formats: JPEG, PNG, WebP, TIFF (max 50MB per file)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadWorkflow disabled={isOutOfCredits} />
        </CardContent>
      </Card>
    </div>
  );
}
