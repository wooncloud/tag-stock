'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ThemeToggle } from '@/components/theme-toggle';

import { signOut } from '@/app/actions/auth';

interface DashboardHeaderProps {
  userEmail: string;
  userInitial: string;
  creditsRemaining: number;
  plan: string;
}

export function DashboardHeader({
  userEmail,
  userInitial,
  creditsRemaining,
  plan,
}: DashboardHeaderProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-background border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-muted-foreground text-sm">
            <span className="font-medium">Credits:</span>{' '}
            <span className="text-foreground font-bold">{creditsRemaining}</span>
          </div>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userEmail}</p>
                  <p className="text-muted-foreground text-xs">
                    {plan === 'pro' ? 'Pro' : 'Free'} Plan
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onSelect={handleSignOut}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
