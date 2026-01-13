import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
    title: '개인정보처리방침 | TagStock.ai',
    description: 'TagStock.ai의 개인정보 수집 및 처리 방침을 확인하세요.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">개인정보처리방침</h1>
                    <p className="text-muted-foreground">
                        최종 업데이트: 2026년 1월 13일
                    </p>
                </div>

                {/* Content */}
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>TagStock.ai 개인정보처리방침</CardTitle>
                        <CardDescription>
                            TagStock.ai(이하 "회사")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하고 관련된 고충을 신속하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                        <section className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">1. 개인정보의 수집 항목 및 방법</h2>

                                <h3 className="text-xl font-semibold mb-3 mt-4">1.1 수집하는 개인정보 항목</h3>
                                <p className="text-muted-foreground mb-3">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>

                                <div className="ml-4 space-y-3">
                                    <div>
                                        <p className="font-semibold">필수 항목:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>이메일 주소</li>
                                            <li>비밀번호 (암호화하여 저장)</li>
                                            <li>이름 또는 닉네임</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">선택 항목:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>프로필 사진</li>
                                            <li>전화번호</li>
                                            <li>회사명 (기업 회원의 경우)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">자동 수집 항목:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>IP 주소</li>
                                            <li>쿠키</li>
                                            <li>서비스 이용 기록</li>
                                            <li>접속 로그</li>
                                            <li>기기 정보 (브라우저 종류, OS 등)</li>
                                        </ul>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-3 mt-4">1.2 개인정보 수집 방법</h3>
                                <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                    <li>회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</li>
                                    <li>생성 정보 수집 툴을 통한 자동 수집</li>
                                    <li>고객센터를 통한 상담 과정에서 수집</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">2. 개인정보의 수집 및 이용 목적</h2>
                                <p className="text-muted-foreground mb-3">회사는 수집한 개인정보를 다음의 목적으로 이용합니다:</p>

                                <div className="ml-4 space-y-3">
                                    <div>
                                        <p className="font-semibold">서비스 제공:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>AI 기반 이미지 분석 및 메타데이터 생성</li>
                                            <li>회원 맞춤형 서비스 제공</li>
                                            <li>콘텐츠 제공 및 관리</li>
                                            <li>크레딧 관리 및 결제 처리</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">회원 관리:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>본인 확인 및 회원 식별</li>
                                            <li>부정 이용 방지 및 비인가 사용 방지</li>
                                            <li>가입 의사 확인</li>
                                            <li>분쟁 조정을 위한 기록 보존</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">서비스 개선 및 마케팅:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                                            <li>서비스 이용에 대한 통계</li>
                                            <li>이벤트 및 광고성 정보 제공 (동의한 회원에 한함)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">3. 개인정보의 보유 및 이용 기간</h2>
                                <p className="text-muted-foreground mb-3">
                                    회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
                                </p>

                                <div className="ml-4 space-y-3">
                                    <div>
                                        <p className="font-semibold">회원 탈퇴 시:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>탈퇴 즉시 개인정보 파기</li>
                                            <li>단, 부정 이용 방지를 위해 이메일 주소는 해시화하여 1년간 보관</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">관련 법령에 따른 보존:</p>
                                        <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                                            <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                                            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                                            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                                            <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">4. 개인정보의 파기 절차 및 방법</h2>

                                <div className="ml-4 space-y-3">
                                    <div>
                                        <p className="font-semibold">파기 절차:</p>
                                        <p className="text-muted-foreground ml-4">
                                            이용자가 입력한 정보는 목적이 달성된 후 내부 방침 및 관련 법령에 따라 일정 기간 저장된 후 파기됩니다. 동 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로 이용되지 않습니다.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold">파기 방법:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>전자적 파일 형태: 복구 및 재생되지 않도록 안전하게 삭제</li>
                                            <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">5. 개인정보의 제3자 제공</h2>
                                <p className="text-muted-foreground">
                                    회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
                                </p>
                                <ul className="list-disc list-inside ml-4 text-muted-foreground mt-3">
                                    <li>이용자가 사전에 동의한 경우</li>
                                    <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                                </ul>

                                <div className="mt-4 ml-4">
                                    <p className="font-semibold mb-2">결제 서비스:</p>
                                    <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                        <li>제공받는 자: 결제 대행 업체 (예: 토스페이먼츠, 나이스페이)</li>
                                        <li>제공 목적: 결제 처리 및 본인 확인</li>
                                        <li>제공 항목: 이름, 이메일, 결제 정보</li>
                                        <li>보유 및 이용 기간: 거래 종료 후 5년</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">6. 개인정보 처리 위탁</h2>
                                <p className="text-muted-foreground mb-3">
                                    회사는 서비스 향상을 위해 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다:
                                </p>

                                <div className="ml-4 space-y-2 text-muted-foreground">
                                    <p>• 카카오: 알림톡 발송</p>
                                    <p>• Amazon Web Services (AWS): 클라우드 서버 호스팅</p>
                                    <p>• Google Cloud Platform: AI 모델 서비스</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">7. 이용자 및 법정대리인의 권리와 행사 방법</h2>
                                <p className="text-muted-foreground mb-3">이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
                                <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                    <li>개인정보 열람 요구</li>
                                    <li>개인정보 오류 정정 요구</li>
                                    <li>개인정보 삭제 요구</li>
                                    <li>개인정보 처리 정지 요구</li>
                                </ul>
                                <p className="text-muted-foreground mt-3 ml-4">
                                    권리 행사는 개인정보보호법 시행규칙 별지 제8호 서식에 따라 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">8. 개인정보 보호를 위한 기술적·관리적 대책</h2>

                                <div className="ml-4 space-y-3">
                                    <div>
                                        <p className="font-semibold">기술적 대책:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>개인정보의 암호화 (비밀번호, 민감정보 등)</li>
                                            <li>해킹이나 컴퓨터 바이러스로부터 보호하기 위한 보안 프로그램 설치</li>
                                            <li>주기적인 보안 업데이트 및 점검</li>
                                            <li>SSL/TLS를 통한 암호화 통신</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">관리적 대책:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>개인정보 취급 직원의 최소화 및 정기 교육</li>
                                            <li>개인정보 보호 전담 부서 운영</li>
                                            <li>접근 권한 관리 및 접속 기록 보관</li>
                                            <li>내부 관리계획 수립 및 시행</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">9. 쿠키(Cookie)의 운용</h2>
                                <p className="text-muted-foreground mb-3">
                                    회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키를 사용합니다.
                                </p>

                                <div className="ml-4 space-y-3">
                                    <div>
                                        <p className="font-semibold">쿠키의 사용 목적:</p>
                                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                                            <li>로그인 상태 유지</li>
                                            <li>이용자 맞춤형 서비스 제공</li>
                                            <li>서비스 이용 통계 분석</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-semibold">쿠키 설정 거부 방법:</p>
                                        <p className="text-muted-foreground ml-4">
                                            브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">10. 개인정보 보호책임자</h2>
                                <p className="text-muted-foreground mb-3">
                                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
                                </p>

                                <div className="ml-4 p-4 bg-muted rounded-lg">
                                    <p className="font-semibold mb-2">개인정보 보호책임자</p>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li>성명: 김태그</li>
                                        <li>직책: 개인정보보호팀장</li>
                                        <li>이메일: privacy@tagstock.ai</li>
                                        <li>전화: 02-1234-5678</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">11. 개인정보 처리방침의 변경</h2>
                                <p className="text-muted-foreground">
                                    이 개인정보 처리방침은 2026년 1월 13일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                                </p>
                            </div>

                            <div className="mt-8 p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>공고일자:</strong> 2026년 1월 13일<br />
                                    <strong>시행일자:</strong> 2026년 1월 13일
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
