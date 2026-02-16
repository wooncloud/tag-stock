import { createClient } from '../../lib/supabase/client';
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
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Not authenticated. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
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
