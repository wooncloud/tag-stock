'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
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
          <Link href="/blog" className="text-sm font-medium hover:underline">
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button className="bg-purple-600 text-white hover:bg-purple-700" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
