import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Upload className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">아직 이미지가 없습니다</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        첫 이미지를 업로드하고 AI로 자동 태깅을 시작하세요
      </p>
      <Button size="lg" asChild>
        <Link href="/dashboard/upload">첫 이미지 업로드하기</Link>
      </Button>
    </div>
  )
}
