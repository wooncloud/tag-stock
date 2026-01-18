import { Metadata } from '@/types/database';

/**
 * 이미지 파일에 IPTC 메타데이터를 임베딩합니다.
 * Pro 전용 기능입니다.
 *
 * 참고: 이는 Phase 2용 단순 구현입니다.
 * 정식 IPTC 임베딩은 Phase 3에서 적절한 ExifTool 연동과 함께 구현될 예정입니다.
 * 현재는 데이터베이스에 저장된 메타데이터와 함께 원본 버퍼를 반환합니다.
 */
export async function embedMetadata(
  imageBuffer: Buffer,
  metadata: Metadata,
  _originalFilename: string
): Promise<Buffer> {
  try {
    // Phase 2에서는 원본 버퍼를 반환합니다.
    // 메타데이터는 이미 데이터베이스에 저장되어 있으며 내보낼 수 있습니다.
    // 정식 IPTC 임베딩은 Phase 3에 추가될 예정입니다.
    console.log('Metadata embedding placeholder - metadata stored in database:', {
      title: metadata.title,
      keywords: metadata.keywords?.length,
      tags: metadata.tags?.length,
    });

    // 원본 버퍼 반환
    return imageBuffer;
  } catch (error) {
    console.error('Metadata embedding error:', error);
    throw new Error('Failed to embed metadata');
  }
}

/**
 * 이미지 파일에서 메타데이터를 추출합니다.
 * Phase 3를 위한 플레이스홀더입니다.
 */
export async function extractMetadata(imageBuffer: Buffer): Promise<Record<string, unknown>> {
  try {
    // 플레이스홀더 - 현재는 빈 객체 반환
    return {};
  } catch (error) {
    console.error('Metadata extraction error:', error);
    throw new Error('Failed to extract metadata');
  }
}

/**
 * 정리(Cleanup) - 종료 시 호출합니다.
 * Phase 3를 위한 플레이스홀더입니다.
 */
export async function closeExifTool() {
  // No-op for now
}
