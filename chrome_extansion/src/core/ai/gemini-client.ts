import { getAccessToken, getUser } from '../../lib/supabase/user';
import { LINKS } from '../../shared/constants';
import type { AIMetadataResult, SiteType } from '../../shared/types';

const API_BASE_URL = LINKS.HOME;

/**
 * 서버 프록시를 통해 AI 메타데이터를 생성합니다.
 * Gemini API 키는 서버에만 존재하며, 익스텐션은 Supabase access token으로 인증합니다.
 */
export async function generateMetadata(
  siteType: SiteType,
  imageBase64: string
): Promise<AIMetadataResult> {
  try {
    // getUser()를 먼저 호출하여 만료된 토큰을 자동 갱신
    const user = await getUser();
    if (!user) {
      throw new Error('Not authenticated. Please login first.');
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Session expired. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ imageBase64, siteType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (errorData as { error?: string }).error || `Server error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return (await response.json()) as AIMetadataResult;
  } catch (error) {
    console.error('Error during AI generation:', error);
    throw error;
  }
}
