'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';

import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-xl font-bold">TagStock</div>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="/#extension" className="text-sm font-medium hover:underline">
            Extension
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:underline">
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {isLoggedIn !== null && (
            <Button className="bg-purple-600 text-white hover:bg-purple-700" asChild>
              <Link href={isLoggedIn ? '/dashboard' : '/login'}>
                {isLoggedIn ? 'Dashboard' : 'Login'}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
