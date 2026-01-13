'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">TagStock.ai</div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium hover:underline">
            기능
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline">
            가격
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:underline">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
