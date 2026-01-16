import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageSquare, Phone } from 'lucide-react'

export const metadata: Metadata = {
    title: '문의 | TagStock',
    description: 'TagStock에 대한 문의사항을 남겨주세요. 빠른 시일 내에 답변드리겠습니다.',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">문의하기</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        궁금한 점이 있으시거나 도움이 필요하신가요?<br />
                        언제든지 문의해 주세요. 빠르게 답변드리겠습니다.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>메시지 보내기</CardTitle>
                            <CardDescription>
                                아래 양식을 작성해주시면 빠른 시일 내에 답변드리겠습니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">이름</Label>
                                    <Input
                                        id="name"
                                        placeholder="홍길동"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">이메일</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">제목</Label>
                                    <Input
                                        id="subject"
                                        placeholder="문의 제목을 입력해주세요"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">메시지</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="문의 내용을 상세히 작성해주세요..."
                                        rows={6}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    문의하기
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>연락처 정보</CardTitle>
                                <CardDescription>
                                    다양한 방법으로 연락하실 수 있습니다.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">이메일</h3>
                                        <p className="text-sm text-muted-foreground">support@tagstock</p>
                                        <p className="text-sm text-muted-foreground">평일 09:00 - 18:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">전화</h3>
                                        <p className="text-sm text-muted-foreground">02-1234-5678</p>
                                        <p className="text-sm text-muted-foreground">평일 09:00 - 18:00 (점심시간 12:00-13:00)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>자주 묻는 질문</CardTitle>
                                <CardDescription>
                                    문의하기 전에 FAQ를 확인해보세요.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Q. 무료 체험이 가능한가요?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            네, 회원가입 시 무료 크레딧이 제공되어 서비스를 체험하실 수 있습니다.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Q. 환불 정책은 어떻게 되나요?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            사용하지 않은 크레딧은 구매 후 7일 이내 100% 환불 가능합니다.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Q. 대량 구매 할인이 있나요?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            기업 고객을 위한 별도 할인 플랜이 있습니다. 이메일로 문의해주세요.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

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
