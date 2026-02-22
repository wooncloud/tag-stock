import { getAccessToken, getUser } from '../../lib/supabase/user';
import { LINKS } from '../../shared/constants';
import { sendToBackground } from '../../shared/messenger';
import type { AIMetadataResult, SiteType } from '../../shared/types';

const API_BASE_URL = LINKS.HOME;

/**
 * 서버 프록시를 통해 AI 메타데이터를 생성합니다.
 * Gemini API 키는 서버에만 존재하며, 익스텐션은 Supabase access token으로 인증합니다.
 */
export async function generateMetadata(
  siteType: SiteType,
  imageBase64: string,
  token?: string
): Promise<AIMetadataResult> {
  try {
    // 사이드패널에서 전달된 토큰 우선 사용, 없으면 로컬 세션에서 가져오기
    let accessToken = token;

    if (!accessToken) {
      const user = await getUser();
      if (!user) {
        throw new Error('Not authenticated. Please login first.');
      }

      accessToken = (await getAccessToken()) ?? undefined;
      if (!accessToken) {
        throw new Error('Session expired. Please login again.');
      }
    }

    // Background 서비스 워커를 통해 API 호출 (content script CSP 우회)
    return await sendToBackground<AIMetadataResult>({
      action: 'proxyFetch',
      url: `${API_BASE_URL}api/generate`,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ imageBase64, siteType }),
      },
    });
  } catch (error) {
    console.error('Error during AI generation:', error);
    throw error;
  }
}
