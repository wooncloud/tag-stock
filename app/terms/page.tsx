import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
    title: '이용약관 | TagStock',
    description: 'TagStock 서비스 이용약관을 확인하세요.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">이용약관</h1>
                    <p className="text-muted-foreground">
                        최종 업데이트: 2026년 1월 13일
                    </p>
                </div>

                {/* Content */}
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>TagStock 서비스 이용약관</CardTitle>
                        <CardDescription>
                            본 약관은 TagStock가 제공하는 서비스의 이용 조건 및 절차, 권리와 의무 등을 규정합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                        <section className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    본 약관은 TagStock(이하 "회사")가 제공하는 AI 기반 스톡 사진 메타데이터 생성 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제2조 (용어의 정의)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>"서비스"라 함은 회사가 제공하는 AI 기반 이미지 분석 및 메타데이터 생성 서비스를 의미합니다.</li>
                                    <li>"회원"이라 함은 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</li>
                                    <li>"크레딧"이라 함은 서비스를 이용하기 위한 가상의 화폐 단위를 말합니다.</li>
                                    <li>"콘텐츠"라 함은 회원이 서비스를 이용하여 생성하거나 업로드한 모든 자료를 말합니다.</li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.</li>
                                    <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.</li>
                                    <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지합니다.</li>
                                    <li>회원이 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제4조 (회원가입)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회원가입은 서비스 이용자가 본 약관에 동의하고 회사가 정한 가입 양식에 따라 정보를 기입한 후 회원가입 신청을 하여 회사가 이를 승낙함으로써 체결됩니다.</li>
                                    <li>회사는 다음 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다:
                                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                            <li>실명이 아니거나 타인의 정보를 도용한 경우</li>
                                            <li>허위 정보를 기재한 경우</li>
                                            <li>만 14세 미만인 경우</li>
                                            <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제5조 (서비스의 제공)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사는 다음과 같은 서비스를 제공합니다:
                                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                            <li>AI 기반 이미지 분석 및 태그 생성</li>
                                            <li>이미지 제목 및 설명 자동 생성</li>
                                            <li>키워드 최적화 및 제안</li>
                                            <li>메타데이터 일괄 편집 및 내보내기</li>
                                        </ul>
                                    </li>
                                    <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
                                    <li>회사는 시스템 점검, 보수, 교체 등의 사유로 서비스 제공을 일시적으로 중단할 수 있으며, 사전에 공지합니다.</li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제6조 (크레딧 및 결제)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>서비스 이용을 위해서는 크레딧이 필요하며, 회원은 유료로 크레딧을 구매할 수 있습니다.</li>
                                    <li>크레딧의 유효기간은 구매일로부터 1년이며, 기간 만료 시 자동 소멸됩니다.</li>
                                    <li>결제는 신용카드, 계좌이체 등 회사가 정한 방법으로 진행됩니다.</li>
                                    <li>환불 정책:
                                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                            <li>사용하지 않은 크레딧은 구매 후 7일 이내 100% 환불 가능합니다.</li>
                                            <li>일부 사용한 경우, 사용한 크레딧을 제외한 나머지 금액의 환불이 가능합니다.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제7조 (저작권 및 지적재산권)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사가 제공하는 서비스, 소프트웨어, 디자인 등에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.</li>
                                    <li>회원이 업로드한 이미지 및 생성된 메타데이터에 대한 저작권은 회원에게 있습니다.</li>
                                    <li>회사는 서비스 개선 및 AI 모델 학습을 위해 익명화된 데이터를 사용할 수 있습니다.</li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제8조 (회원의 의무)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회원은 다음 행위를 하여서는 안 됩니다:
                                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                            <li>타인의 정보 도용 또는 부정 사용</li>
                                            <li>불법적이거나 음란한 콘텐츠 업로드</li>
                                            <li>서비스의 정상적인 운영을 방해하는 행위</li>
                                            <li>회사의 지적재산권을 침해하는 행위</li>
                                            <li>기타 관련 법령에 위배되는 행위</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제9조 (서비스 이용 제한)</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    회사는 회원이 본 약관을 위반하거나 서비스의 정상적인 운영을 방해한 경우, 사전 통지 없이 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제10조 (면책조항)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
                                    <li>회사는 회원이 생성한 콘텐츠의 정확성, 신뢰성, 적법성에 대해 보증하지 않습니다.</li>
                                    <li>회사는 회원 간 또는 회원과 제3자 간에 발생한 분쟁에 대해 개입할 의무가 없습니다.</li>
                                </ol>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">제11조 (준거법 및 관할법원)</h2>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>본 약관과 서비스 이용에 관한 분쟁에는 대한민국 법령을 적용합니다.</li>
                                    <li>서비스 이용과 관련하여 발생한 분쟁에 대해서는 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</li>
                                </ol>
                            </div>

                            <div className="mt-8 p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>부칙</strong><br />
                                    본 약관은 2026년 1월 13일부터 시행됩니다.
                                </p>
                            </div>
                        </section>
                    </CardContent>
                </Card>

                {/* Back to Home */}
                <div className="text-center mt-12">
                    <Link href="/">
                        <Button variant="ghost">
                            ← 홈으로 돌아가기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
