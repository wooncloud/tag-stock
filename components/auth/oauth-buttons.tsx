'use client';

import Image from 'next/image';

import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';

export function OAuthButtons() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleAppleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleTwitterLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="text-foreground hover:bg-accent w-full"
        size="lg"
      >
        <Image
          src="/icons/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="mr-2 dark:invert"
        />
        Continue with Google
      </Button>

      <Button
        onClick={handleAppleLogin}
        variant="outline"
        className="text-foreground hover:bg-accent w-full"
        size="lg"
        disabled
      >
        <Image
          src="/icons/apple.svg"
          alt="Apple"
          width={20}
          height={20}
          className="mr-2 opacity-50 dark:invert"
        />
        Continue with Apple (Coming Soon)
      </Button>

      <Button
        onClick={handleTwitterLogin}
        variant="outline"
        className="text-foreground hover:bg-accent w-full"
        size="lg"
        disabled
      >
        <Image
          src="/icons/x.svg"
          alt="X"
          width={20}
          height={20}
          className="mr-2 opacity-50 dark:invert"
        />
        Continue with X (Coming Soon)
      </Button>
    </div>
  );
}
