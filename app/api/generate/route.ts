import { NextResponse } from 'next/server';

import { generateSiteMetadata } from '@/services/gemini';
import { type SiteType } from '@/services/prompts';

import { ApiAuthError, authenticateApiRequest } from '@/lib/supabase/api-auth';
import { decrementCredits, hasEnoughCredits } from '@/lib/supabase/credits';

interface GenerateRequestBody {
  imageBase64: string;
  siteType: SiteType;
}

export async function POST(request: Request) {
  try {
    // 1. 인증
    const { userId, profile, supabase } = await authenticateApiRequest(request);

    // 2. 요청 바디 파싱
    const body = (await request.json()) as GenerateRequestBody;

    if (!body.imageBase64 || !body.siteType) {
      return NextResponse.json({ error: 'Missing imageBase64 or siteType' }, { status: 400 });
    }

    if (body.siteType !== 'adobe' && body.siteType !== 'shutterstock') {
      return NextResponse.json({ error: 'Invalid siteType' }, { status: 400 });
    }

    // 3. 크레딧 확인
    if (!hasEnoughCredits(profile.credits_subscription, profile.credits_purchased)) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    // 4. Gemini AI 호출 (이미지는 메모리에서만 처리)
    const metadata = await generateSiteMetadata(body.imageBase64, body.siteType);

    // 5. 크레딧 차감 (성공 후)
    const { error: creditError } = await decrementCredits(supabase, userId, 1);

    if (creditError) {
      console.error('Credit deduction failed:', creditError);
    }

    // 6. 결과 반환
    return NextResponse.json(metadata);
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
