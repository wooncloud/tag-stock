import { NextResponse } from 'next/server';

import { ApiAuthError, authenticateApiRequest } from '@/lib/supabase/api-auth';
import { getTotalCredits } from '@/lib/supabase/credits';

export async function GET(request: Request) {
  try {
    const { profile } = await authenticateApiRequest(request);

    return NextResponse.json({
      credits_subscription: profile.credits_subscription,
      credits_purchased: profile.credits_purchased,
      total: getTotalCredits(profile.credits_subscription, profile.credits_purchased),
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error('Credits API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
