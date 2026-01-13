import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OAuthButtonsWrapper } from '@/components/auth/oauth-buttons-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome to TagStock.ai</CardTitle>
              <CardDescription className="mt-2">
                Sign in to start generating AI-powered metadata for your stock photos
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <OAuthButtonsWrapper />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                By signing in, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
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
