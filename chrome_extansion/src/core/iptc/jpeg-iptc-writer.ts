import type { IPTCMetadata } from './types';

// JPEG markers
const JPEG_SOI = 0xffd8;
const JPEG_APP13 = 0xffed;
const JPEG_SOS = 0xffda;

// IPTC-IIM constants
const IPTC_TAG_MARKER = 0x1c;
const IPTC_RECORD = 0x02;

// Dataset numbers (Record 2)
const DATASET_HEADLINE = 0x05; // 2:05 Headline (Title)
const DATASET_KEYWORDS = 0x19; // 2:25 Keywords
const DATASET_CAPTION = 0x78; // 2:120 Caption-Abstract

// Photoshop 3.0 / 8BIM constants
const PHOTOSHOP_HEADER = 'Photoshop 3.0';
const PHOTOSHOP_8BIM = '8BIM';
const PHOTOSHOP_IPTC_RESOURCE_ID = 0x0404;

const textEncoder = new TextEncoder();

/**
 * IPTC-IIM 단일 데이터셋 생성
 * Format: 0x1C + Record(1B) + Dataset(1B) + Size(2B BE) + Data
 */
function createIPTCDataset(dataset: number, value: string): Uint8Array {
  const encoded = textEncoder.encode(value);
  const length = encoded.length;

  // Extended dataset for data > 32767 bytes (unlikely but safe)
  if (length > 32767) {
    throw new Error(`IPTC dataset value too long: ${length} bytes`);
  }

  const result = new Uint8Array(5 + length);
  result[0] = IPTC_TAG_MARKER;
  result[1] = IPTC_RECORD;
  result[2] = dataset;
  result[3] = (length >> 8) & 0xff;
  result[4] = length & 0xff;
  result.set(encoded, 5);

  return result;
}

/**
 * Encoding marker dataset (1:90) — UTF-8 지정
 * Format: 0x1C 0x01 0x5A + Size(2B) + ESC %G (UTF-8 escape sequence)
 */
function createEncodingDataset(): Uint8Array {
  // ESC sequence for UTF-8: 0x1B 0x25 0x47
  const escSequence = new Uint8Array([0x1b, 0x25, 0x47]);
  const result = new Uint8Array(5 + escSequence.length);
  result[0] = IPTC_TAG_MARKER;
  result[1] = 0x01; // Record 1
  result[2] = 0x5a; // Dataset 90 (Coded Character Set)
  result[3] = 0x00;
  result[4] = escSequence.length;
  result.set(escSequence, 5);
  return result;
}

/**
 * 전체 IPTC-IIM 바이너리 블록 생성
 */
function buildIPTCBlock(metadata: IPTCMetadata): Uint8Array {
  const datasets: Uint8Array[] = [];

  // UTF-8 encoding marker
  datasets.push(createEncodingDataset());

  // Title → Headline (2:05)
  if (metadata.title) {
    datasets.push(createIPTCDataset(DATASET_HEADLINE, metadata.title));
  }

  // Keywords (2:25) — 각 키워드마다 별도 데이터셋
  for (const keyword of metadata.keywords) {
    const trimmed = keyword.trim();
    if (trimmed) {
      datasets.push(createIPTCDataset(DATASET_KEYWORDS, trimmed));
    }
  }

  // Caption (2:120)
  if (metadata.caption) {
    datasets.push(createIPTCDataset(DATASET_CAPTION, metadata.caption));
  }

  // 전체 크기 계산 후 병합
  const totalLength = datasets.reduce((sum, d) => sum + d.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const d of datasets) {
    result.set(d, offset);
    offset += d.length;
  }

  return result;
}

/**
 * Photoshop 8BIM 리소스로 IPTC 블록 래핑
 * Format: "8BIM" + ResourceID(2B) + PascalString(padding) + Size(4B) + Data + (padding)
 */
function wrapIn8BIMResource(iptcBlock: Uint8Array): Uint8Array {
  const bim = textEncoder.encode(PHOTOSHOP_8BIM);
  // Pascal string: 단일 null byte (이름 없음)
  const pascalString = new Uint8Array([0x00, 0x00]); // length 0 + padding

  const dataSize = iptcBlock.length;
  const paddedDataSize = dataSize + (dataSize % 2); // 짝수 패딩

  // 8BIM(4) + ResourceID(2) + PascalString(2) + Size(4) + Data + Padding
  const totalSize = 4 + 2 + 2 + 4 + paddedDataSize;
  const result = new Uint8Array(totalSize);
  let offset = 0;

  // "8BIM"
  result.set(bim, offset);
  offset += 4;

  // Resource ID: 0x0404 (IPTC-NAA)
  result[offset++] = (PHOTOSHOP_IPTC_RESOURCE_ID >> 8) & 0xff;
  result[offset++] = PHOTOSHOP_IPTC_RESOURCE_ID & 0xff;

  // Pascal string (empty name)
  result.set(pascalString, offset);
  offset += 2;

  // Data size (4 bytes, big-endian)
  result[offset++] = (dataSize >> 24) & 0xff;
  result[offset++] = (dataSize >> 16) & 0xff;
  result[offset++] = (dataSize >> 8) & 0xff;
  result[offset++] = dataSize & 0xff;

  // IPTC data
  result.set(iptcBlock, offset);

  return result;
}

/**
 * APP13 세그먼트 생성
 * Format: 0xFF 0xED + Length(2B) + "Photoshop 3.0\0" + 8BIM resources
 */
function buildAPP13Segment(metadata: IPTCMetadata): Uint8Array {
  const iptcBlock = buildIPTCBlock(metadata);
  const resource = wrapIn8BIMResource(iptcBlock);

  const photoshopHeader = textEncoder.encode(PHOTOSHOP_HEADER);
  // "Photoshop 3.0" + null terminator
  const headerWithNull = new Uint8Array(photoshopHeader.length + 1);
  headerWithNull.set(photoshopHeader);
  headerWithNull[photoshopHeader.length] = 0x00;

  // Segment length = 2(length field) + header + resource
  const segmentDataLength = headerWithNull.length + resource.length;
  const segmentLength = 2 + segmentDataLength; // Length field includes itself

  const segment = new Uint8Array(2 + segmentLength); // Marker(2) + Length(2) + Data
  let offset = 0;

  // APP13 marker
  segment[offset++] = 0xff;
  segment[offset++] = 0xed;

  // Segment length (big-endian, includes the 2 length bytes)
  segment[offset++] = (segmentLength >> 8) & 0xff;
  segment[offset++] = segmentLength & 0xff;

  // "Photoshop 3.0\0"
  segment.set(headerWithNull, offset);
  offset += headerWithNull.length;

  // 8BIM resource with IPTC data
  segment.set(resource, offset);

  return segment;
}

/**
 * JPEG 바이너리에서 기존 APP13 세그먼트 위치 찾기
 * @returns [start, end] 또는 null
 */
function findAPP13(data: Uint8Array): [number, number] | null {
  let offset = 2; // SOI 이후부터
  while (offset + 3 < data.length) {
    if (data[offset] !== 0xff) break;

    const marker = (data[offset] << 8) | data[offset + 1];

    // SOS 이후는 스캔 데이터 — 탐색 중단
    if (marker === JPEG_SOS) break;

    const segLength = (data[offset + 2] << 8) | data[offset + 3];

    if (marker === JPEG_APP13) {
      return [offset, offset + 2 + segLength];
    }

    offset += 2 + segLength;
  }
  return null;
}

/**
 * APP13 삽입 위치 결정 (SOI 직후, 기존 APP 마커 뒤)
 */
function findInsertPosition(data: Uint8Array): number {
  let offset = 2; // SOI 이후
  while (offset + 3 < data.length) {
    if (data[offset] !== 0xff) break;

    const marker = (data[offset] << 8) | data[offset + 1];

    // APP0~APP15 (0xFFE0~0xFFEF) 뒤에 삽입
    if (marker >= 0xffe0 && marker <= 0xffef) {
      const segLength = (data[offset + 2] << 8) | data[offset + 3];
      offset += 2 + segLength;
      continue;
    }

    // APP 마커가 아니면 여기에 삽입
    break;
  }
  return offset;
}

/**
 * JPEG 바이너리에 IPTC 메타데이터 삽입
 * 기존 APP13이 있으면 교체, 없으면 새로 삽입
 */
export function embedIPTC(jpegData: Uint8Array, metadata: IPTCMetadata): Uint8Array {
  // JPEG SOI 확인
  if (jpegData.length < 2 || ((jpegData[0] << 8) | jpegData[1]) !== JPEG_SOI) {
    throw new Error('Invalid JPEG: missing SOI marker');
  }

  const app13Segment = buildAPP13Segment(metadata);
  const existingAPP13 = findAPP13(jpegData);

  if (existingAPP13) {
    // 기존 APP13 교체
    const [start, end] = existingAPP13;
    const result = new Uint8Array(jpegData.length - (end - start) + app13Segment.length);
    result.set(jpegData.subarray(0, start));
    result.set(app13Segment, start);
    result.set(jpegData.subarray(end), start + app13Segment.length);
    return result;
  }

  // 새로 삽입
  const insertPos = findInsertPosition(jpegData);
  const result = new Uint8Array(jpegData.length + app13Segment.length);
  result.set(jpegData.subarray(0, insertPos));
  result.set(app13Segment, insertPos);
  result.set(jpegData.subarray(insertPos), insertPos + app13Segment.length);
  return result;
}
