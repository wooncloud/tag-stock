import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AlertCircle, Crown, Sparkles } from 'lucide-react';

import type { UserPlan } from '@/types/database';

import { isPaidPlan, PLAN_LIMITS } from '@/lib/plan-limits';
import { ensureAuthenticated } from '@/lib/supabase/auth';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { UploadWorkflow } from '@/components/dashboard/upload';

export default async function UploadPage() {
  let session;
  try {
    session = await ensureAuthenticated();
  } catch {
    redirect('/');
  }

  const { profile } = session;
  const userPlan = (profile.plan as UserPlan) || 'free';
  const planLimit = PLAN_LIMITS[userPlan];
  const isPro = isPaidPlan(userPlan);

  const isOutOfCredits = profile.credits_remaining <= 0 && profile.plan === 'free';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Images</h1>
        <p className="text-muted-foreground mt-1">
          Upload your images and let AI generate optimized metadata
        </p>
      </div>

      {/* Credit Alerts */}
      {isOutOfCredits ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You&apos;re out of credits. Upgrade to Pro for unlimited AI tagging.</span>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            {profile.plan === 'pro' ? (
              <span>You have unlimited credits as a Pro user.</span>
            ) : (
              <span>
                You have <strong>{profile.credits_remaining}</strong> credits remaining. Each image
                upload uses 1 credit.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Workflow */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Upload Your Images
              {isPro && (
                <Badge
                  variant="default"
                  className="border-none bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Pro
                </Badge>
              )}
            </CardTitle>
          </div>
          <CardDescription>
            Supported formats: JPEG, PNG, WebP, TIFF.
            <br />
            {isPro ? (
              <span className="font-medium text-emerald-500">
                Original quality preserved (max {planLimit.maxFileSizeMB}MB per file)
              </span>
            ) : (
              <span className="font-medium text-amber-500">
                Images are compressed to {planLimit.compressionOptions?.maxWidthOrHeight}px for
                storage.{' '}
                <Link
                  href="/dashboard/pricing"
                  className="text-primary underline hover:no-underline"
                >
                  Upgrade to Pro
                </Link>{' '}
                for original quality.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadWorkflow disabled={isOutOfCredits} userPlan={userPlan} />
        </CardContent>
      </Card>
    </div>
  );
}
