import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Profile } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export interface ApiAuthSession {
  userId: string;
  profile: Profile;
  supabase: SupabaseClient;
}

/**
 * API 라우트에서 Bearer 토큰 기반 인증을 수행합니다.
 * 크롬 익스텐션은 쿠키가 아닌 Supabase access_token을 사용합니다.
 */
export async function authenticateApiRequest(request: Request): Promise<ApiAuthSession> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiAuthError('Missing or invalid Authorization header', 401);
  }

  const token = authHeader.substring(7);

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // 토큰으로 사용자 검증
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    throw new ApiAuthError('Invalid or expired token', 401);
  }

  // 프로필 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new ApiAuthError('Profile not found', 404);
  }

  return { userId: user.id, profile: profile as Profile, supabase };
}

export class ApiAuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiAuthError';
  }
}
