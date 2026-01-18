'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-xl font-bold">TagStock</div>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="#features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="#extension" className="text-sm font-medium hover:underline">
            Extension
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
