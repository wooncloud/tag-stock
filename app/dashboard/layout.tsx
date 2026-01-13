import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          userEmail={user.email || ''}
          userInitial={userInitial}
          creditsRemaining={profile?.credits_remaining || 0}
          plan={profile?.plan || 'free'}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/40 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
