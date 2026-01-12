import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: images, count } = await supabase
    .from('images')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const hasImages = images && images.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">안녕하세요! 👋</h1>
        <p className="text-muted-foreground mt-1">
          AI로 스톡 사진 메타데이터를 자동 생성하세요
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">남은 크레딧</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.credits_remaining || 0}</div>
            <p className="text-xs text-muted-foreground">
              {profile?.plan === 'pro' ? '무제한' : '이번 달'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 이미지</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count || 0}</div>
            <p className="text-xs text-muted-foreground">
              전체 업로드된 이미지
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">플랜</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.plan === 'pro' ? 'Pro' : 'Free'}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.plan === 'pro' ? '무제한 크레딧' : '10 크레딧/월'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Images or Empty State */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>최근 이미지</CardTitle>
              <CardDescription>
                최근에 업로드한 이미지 목록
              </CardDescription>
            </div>
            {hasImages && (
              <Button asChild>
                <Link href="/dashboard/images">전체 보기</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasImages ? (
            <div className="space-y-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {image.storage_path.split('/').pop()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(image.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        image.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : image.status === 'processing'
                          ? 'bg-blue-100 text-blue-700'
                          : image.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {image.status === 'completed'
                        ? '완료'
                        : image.status === 'processing'
                        ? '처리 중'
                        : image.status === 'failed'
                        ? '실패'
                        : '대기 중'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!hasImages && (
        <Card>
          <CardHeader>
            <CardTitle>빠른 시작</CardTitle>
            <CardDescription>
              TagStock.ai로 첫 걸음을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto p-6">
              <Link href="/dashboard/upload" className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8" />
                <span className="font-semibold">이미지 업로드</span>
                <span className="text-xs text-muted-foreground text-center">
                  첫 이미지를 업로드하고 AI 태깅을 시작하세요
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-6">
              <Link href="/dashboard/plan" className="flex flex-col items-center gap-2">
                <Sparkles className="h-8 w-8" />
                <span className="font-semibold">Pro로 업그레이드</span>
                <span className="text-xs text-muted-foreground text-center">
                  무제한 크레딧과 IPTC 메타데이터 임베딩
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
