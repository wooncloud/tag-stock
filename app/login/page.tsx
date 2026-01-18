import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Sparkles } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { OAuthButtonsWrapper } from '@/components/auth/oauth-buttons-wrapper';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-linear-to-br from-purple-600 to-pink-600 p-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome to TagStock</CardTitle>
              <CardDescription className="mt-2">
                Sign in to start generating AI-powered metadata for your stock photos
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <OAuthButtonsWrapper />

            <div className="text-muted-foreground mt-6 text-center text-sm">
              <p>
                By signing in, you agree to our{' '}
                <Link href="/terms" className="hover:text-primary underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="hover:text-primary underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
