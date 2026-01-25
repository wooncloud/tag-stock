import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.1?target=deno';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// 플랜별 월간 크레딧 할당량
const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  pro: 500,
  max: 2000,
};

// Max 플랜 이월 최대치
const MAX_CARRYOVER = 1000;

interface Profile {
  id: string;
  plan: string;
  credits_remaining: number;
  subscription_status: string | null;
}

interface ResetResult {
  userId: string;
  oldCredits: number;
  newCredits: number;
}

Deno.serve(async (req) => {
  // Cron 인증 확인
  const authHeader = req.headers.get('Authorization');
  const cronSecret = Deno.env.get('CRON_SECRET');

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 모든 사용자 프로필 조회
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, plan, credits_remaining, subscription_status');

    if (error) {
      throw error;
    }

    let processed = 0;
    const results: ResetResult[] = [];
    const errors: Array<{ userId: string; error: string }> = [];

    for (const profile of (profiles as Profile[]) || []) {
      try {
        let newCredits: number;
        const oldCredits = profile.credits_remaining;
        const planCredits = PLAN_CREDITS[profile.plan] || PLAN_CREDITS.free;

        if (profile.plan === 'max' && profile.subscription_status === 'active') {
          // Max 플랜: 이월 가능 (최대 1,000)
          const carryover = Math.min(profile.credits_remaining, MAX_CARRYOVER);
          newCredits = carryover + planCredits;
        } else if (profile.plan === 'pro' && profile.subscription_status === 'active') {
          // Pro 플랜: 이월 없음
          newCredits = planCredits;
        } else {
          // Free 플랜 또는 구독 비활성화
          newCredits = PLAN_CREDITS.free;
        }

        // 크레딧 업데이트
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            credits_remaining: newCredits,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          errors.push({ userId: profile.id, error: updateError.message });
          continue;
        }

        // credit_transactions 테이블이 있으면 거래 내역 기록
        const transactionResult = await supabase.from('credit_transactions').insert({
          user_id: profile.id,
          type: 'monthly_grant',
          amount: newCredits - oldCredits,
          balance_after: newCredits,
          description: `Monthly ${profile.plan} plan credit grant`,
        });

        // credit_transactions 테이블이 없어도 에러 무시 (선택적 기능)
        if (
          transactionResult.error &&
          !transactionResult.error.message.includes('does not exist')
        ) {
          console.warn(`Transaction log failed for user ${profile.id}:`, transactionResult.error);
        }

        results.push({
          userId: profile.id,
          oldCredits,
          newCredits,
        });
        processed++;
      } catch (userError) {
        const errorMessage = userError instanceof Error ? userError.message : 'Unknown error';
        errors.push({ userId: profile.id, error: errorMessage });
        console.error(`Failed to process user ${profile.id}:`, userError);
      }
    }

    console.log(
      `Monthly credit reset completed. Processed: ${processed} users, Errors: ${errors.length}`
    );

    // Discord 알림 (실패가 있는 경우)
    if (errors.length > 0) {
      await sendDiscordAlert(
        `⚠️ Monthly Credit Reset: ${processed} succeeded, ${errors.length} failed`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        errorCount: errors.length,
        timestamp: new Date().toISOString(),
        results: results.slice(0, 10), // 처음 10개만 반환
        errors: errors.slice(0, 5), // 에러도 처음 5개만
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Monthly credit reset failed:', error);

    // 심각한 오류 시 Discord 알림
    await sendDiscordAlert(`🚨 Monthly Credit Reset FAILED: ${errorMessage}`);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Discord 알림 함수
async function sendDiscordAlert(message: string) {
  const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `**[TagStock Edge Function]** ${message}`,
        username: 'TagStock Bot',
      }),
    });
  } catch (error) {
    console.error('Failed to send Discord alert:', error);
  }
}
