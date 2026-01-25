/**
 * IPTC 메타데이터 유틸리티 함수
 * Pro 사용자 전용 기능
 */

export interface MetadataInput {
  title?: string;
  description?: string;
  keywords?: string[];
  tags?: string[];
}

export interface IPTCData {
  Headline: string;
  'Caption-Abstract': string;
  Keywords: string[];
}

/**
 * TagStock 메타데이터를 IPTC 형식으로 매핑
 * @param metadata - TagStock에서 생성된 메타데이터
 * @returns IPTC 형식의 메타데이터
 */
export function mapToIPTC(metadata: MetadataInput): IPTCData {
  const keywords = metadata.keywords || [];
  const tags = metadata.tags || [];

  // Keywords를 앞에, Tags를 뒤에 배치 (SEO 최적화)
  // 최대 50개로 제한
  const combinedKeywords = [...keywords, ...tags].slice(0, 50);

  return {
    Headline: metadata.title || '',
    'Caption-Abstract': metadata.description || '',
    Keywords: combinedKeywords,
  };
}

/**
 * IPTC 메타데이터가 유효한지 검증
 * @param iptc - IPTC 메타데이터
 * @returns 유효성 여부
 */
export function validateIPTC(iptc: IPTCData): boolean {
  // 최소한 title 또는 keywords가 있어야 함
  const hasHeadline = iptc['Headline'].length > 0;
  const hasKeywords = iptc['Keywords'].length > 0;

  return hasHeadline || hasKeywords;
}

/**
 * 키워드 배열을 정리 (중복 제거, 공백 제거, 소문자 변환)
 * @param keywords - 원본 키워드 배열
 * @returns 정리된 키워드 배열
 */
export function sanitizeKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  return keywords
    .map((k) => k.trim())
    .filter((k) => {
      if (k.length === 0) return false;
      const lower = k.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
}
