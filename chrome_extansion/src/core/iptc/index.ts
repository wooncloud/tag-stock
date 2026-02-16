import { embedIPTC } from './jpeg-iptc-writer';
import type { IPTCMetadata } from './types';
import { embedXMP } from './xmp-writer';

export type { IPTCMetadata } from './types';
export { embedIPTC } from './jpeg-iptc-writer';

/**
 * Base64 JPEG 이미지에 IPTC + XMP 메타데이터 삽입
 * @param base64 - 순수 Base64 문자열 (data: prefix 없음)
 * @param metadata - 삽입할 메타데이터
 * @returns 메타데이터가 삽입된 Base64 문자열
 */
export function embedIPTCToJpeg(base64: string, metadata: IPTCMetadata): string {
  // Base64 → Uint8Array
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // IPTC 삽입
  let result = embedIPTC(bytes, metadata);

  // XMP 삽입 (Adobe Stock 등에서 XMP를 우선 읽음)
  result = embedXMP(result, metadata);

  // Uint8Array → Base64
  let binary = '';
  for (let i = 0; i < result.length; i++) {
    binary += String.fromCharCode(result[i]);
  }
  return btoa(binary);
}
