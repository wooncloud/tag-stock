'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CreditCard, LayoutDashboard, Mail, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Pricing',
    href: '/dashboard/pricing',
    icon: CreditCard,
  },
  {
    title: 'Contact',
    href: '/contact',
    icon: Mail,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-muted/40 w-64 border-r pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">TagStock</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'hover:bg-accent hover:text-accent-foreground flex items-center rounded-lg px-3 py-2 text-sm font-medium',
                  pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
