import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { OAuthButtonsWrapper } from '@/components/auth/oauth-buttons-wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles, Zap, FileImage, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* 히어로 섹션 */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  AI로 스톡 사진 메타데이터를 자동 생성하세요
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Adobe Stock, Shutterstock을 위한 완벽한 태깅 솔루션.
                  Google Gemini AI가 수백 개의 정확한 키워드와 설명을 몇 초 만에 생성합니다.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              강력한 기능
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              전문 포토그래퍼를 위한 AI 기반 메타데이터 생성 도구
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 mb-2 text-purple-600" />
                <CardTitle>AI 자동 태깅</CardTitle>
                <CardDescription>
                  Google Gemini 3.0 Flash를 사용하여 정확한 키워드 생성
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileImage className="h-10 w-10 mb-2 text-blue-600" />
                <CardTitle>IPTC 메타데이터</CardTitle>
                <CardDescription>
                  Pro 플랜으로 메타데이터를 이미지에 직접 임베딩
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 mb-2 text-yellow-600" />
                <CardTitle>멀티 이미지</CardTitle>
                <CardDescription>
                  한 번에 여러 이미지를 업로드하고 일괄 처리
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 mb-2 text-green-600" />
                <CardTitle>SEO 최적화</CardTitle>
                <CardDescription>
                  검색 엔진에 최적화된 제목과 설명 자동 생성
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section id="pricing" className="border-t">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              간단한 가격
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              프로젝트 규모에 맞는 플랜을 선택하세요
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* 무료 플랜 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>시작하기에 완벽</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/월</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>10 크레딧/월</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>AI 자동 태깅</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>제목 및 설명 생성</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>CSV 내보내기</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 프로 플랜 */}
            <Card className="border-purple-600 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  인기
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>전문가를 위한</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="text-muted-foreground">/월</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span className="font-semibold">무제한 크레딧</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>AI 자동 태깅</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>제목 및 설명 생성</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span>CSV 내보내기</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span className="font-semibold">IPTC 메타데이터 임베딩</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <span className="font-semibold">우선 지원</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="border-t bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 py-24 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
            지금 시작하세요
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            몇 초 만에 가입하고 AI 자동 태깅을 무료로 체험하세요
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-2">
              <OAuthButtonsWrapper />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
