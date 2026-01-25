import { ExifTool } from 'exiftool-vendored';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { Metadata } from '@/types/database';

import { mapToIPTC, sanitizeKeywords, validateIPTC } from '@/lib/iptc';

// ExifTool 싱글톤 인스턴스
let exifToolInstance: ExifTool | null = null;

/**
 * ExifTool 인스턴스를 가져옵니다.
 * 싱글톤 패턴으로 하나의 인스턴스만 유지합니다.
 */
function getExifTool(): ExifTool {
  if (!exifToolInstance) {
    exifToolInstance = new ExifTool({
      taskTimeoutMillis: 30000,
    });
  }
  return exifToolInstance;
}

/**
 * 이미지 파일에 IPTC 메타데이터를 임베딩합니다.
 * Pro 전용 기능입니다.
 *
 * @param imageBuffer - 원본 이미지 버퍼
 * @param metadata - 삽입할 메타데이터
 * @param originalFilename - 원본 파일명
 * @returns IPTC가 삽입된 이미지 버퍼
 */
export async function embedMetadata(
  imageBuffer: Buffer,
  metadata: Metadata,
  originalFilename: string
): Promise<Buffer> {
  const exiftool = getExifTool();

  // 임시 디렉토리에 파일 저장
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tagstock-'));
  const tempFilePath = path.join(tempDir, originalFilename);

  try {
    // 이미지 버퍼를 임시 파일로 저장
    await fs.writeFile(tempFilePath, imageBuffer);

    // IPTC 데이터 매핑
    const iptcData = mapToIPTC({
      title: metadata.title,
      description: metadata.description,
      keywords: sanitizeKeywords(metadata.keywords || []),
      tags: sanitizeKeywords(metadata.tags || []),
    });

    // IPTC 데이터 유효성 검사
    if (!validateIPTC(iptcData)) {
      console.warn('Invalid IPTC data, returning original buffer');
      return imageBuffer;
    }

    console.log('Embedding IPTC metadata:', {
      headline: iptcData['Headline'],
      captionAbstract: iptcData['Caption-Abstract'].substring(0, 50) + '...',
      keywordsCount: iptcData['Keywords'].length,
    });

    // IPTC/XMP 메타데이터 태그 구성
    // exiftool-vendored의 WriteTags 타입은 하이픈이 포함된 IPTC 키를 직접 지원하지 않으므로
    // 객체 리터럴로 구성합니다.
    const tags = {
      // IPTC 메타데이터 (표준 스톡 사이트 필드)
      Headline: iptcData['Headline'],
      'Caption-Abstract': iptcData['Caption-Abstract'],
      Keywords: iptcData['Keywords'],
      // XMP 메타데이터 (Title/Description만 - Keywords는 IPTC만 사용하여 중복 방지)
      Title: iptcData['Headline'],
      Description: iptcData['Caption-Abstract'],
    };

    // ExifTool을 사용하여 메타데이터 삽입
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await exiftool.write(tempFilePath, tags as any, ['-overwrite_original']);

    // 임베딩된 이미지 버퍼 읽기
    const embeddedBuffer = await fs.readFile(tempFilePath);

    console.log('IPTC metadata embedded successfully');

    return embeddedBuffer;
  } catch (error) {
    console.error('Metadata embedding error:', error);
    throw new Error('Failed to embed metadata');
  } finally {
    // 임시 파일 정리
    try {
      await fs.unlink(tempFilePath);
      await fs.rmdir(tempDir);
    } catch {
      // 정리 실패는 무시
    }
  }
}

/**
 * 이미지 파일에서 메타데이터를 추출합니다.
 *
 * @param imageBuffer - 이미지 버퍼
 * @returns 추출된 메타데이터
 */
export async function extractMetadata(imageBuffer: Buffer): Promise<Record<string, unknown>> {
  const exiftool = getExifTool();

  // 임시 디렉토리에 파일 저장
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tagstock-extract-'));
  const tempFilePath = path.join(tempDir, 'temp-image.jpg');

  try {
    await fs.writeFile(tempFilePath, imageBuffer);

    // ExifTool을 사용하여 메타데이터 읽기
    const tags = await exiftool.read(tempFilePath);

    return {
      headline: tags.Headline,
      caption: tags['Caption-Abstract'],
      keywords: tags.Keywords,
      title: tags.Title,
      description: tags.Description,
      subject: tags.Subject,
    };
  } catch (error) {
    console.error('Metadata extraction error:', error);
    throw new Error('Failed to extract metadata');
  } finally {
    // 임시 파일 정리
    try {
      await fs.unlink(tempFilePath);
      await fs.rmdir(tempDir);
    } catch {
      // 정리 실패는 무시
    }
  }
}

/**
 * ExifTool 인스턴스를 종료합니다.
 * 애플리케이션 종료 시 호출해야 합니다.
 */
export async function closeExifTool() {
  if (exifToolInstance) {
    await exifToolInstance.end();
    exifToolInstance = null;
    console.log('ExifTool closed');
  }
}
