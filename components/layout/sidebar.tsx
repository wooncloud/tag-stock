'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Upload,
  Image as ImageIcon,
  Settings,
  CreditCard,
} from 'lucide-react'

const sidebarItems = [
  {
    title: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '업로드',
    href: '/dashboard/upload',
    icon: Upload,
  },
  {
    title: '내 이미지',
    href: '/dashboard/images',
    icon: ImageIcon,
  },
  {
    title: '설정',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: '플랜',
    href: '/dashboard/plan',
    icon: CreditCard,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64 border-r bg-muted/40">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">TagStock</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'transparent'
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
  )
}
