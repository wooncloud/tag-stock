import type { IPTCMetadata } from './types';

const JPEG_APP1 = 0xffe1;
const JPEG_SOS = 0xffda;
const XMP_HEADER = 'http://ns.adobe.com/xap/1.0/\0';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * JPEG 바이너리에서 XMP(APP1) 세그먼트 위치 찾기
 * @returns [segmentStart, segmentEnd, xmpDataStart] 또는 null
 */
function findXMPSegment(
  data: Uint8Array
): { segStart: number; segEnd: number; xmpStart: number } | null {
  let offset = 2; // SOI 이후

  while (offset + 3 < data.length) {
    if (data[offset] !== 0xff) break;

    const marker = (data[offset] << 8) | data[offset + 1];

    if (marker === JPEG_SOS) break;

    const segLength = (data[offset + 2] << 8) | data[offset + 3];

    if (marker === JPEG_APP1) {
      // XMP 헤더 확인 ("http://ns.adobe.com/xap/1.0/\0")
      const headerBytes = data.subarray(offset + 4, offset + 4 + XMP_HEADER.length);
      const headerStr = textDecoder.decode(headerBytes);

      if (headerStr === XMP_HEADER) {
        return {
          segStart: offset,
          segEnd: offset + 2 + segLength,
          xmpStart: offset + 4 + XMP_HEADER.length,
        };
      }
    }

    offset += 2 + segLength;
  }

  return null;
}

/**
 * XML 특수문자 이스케이프
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * dc:subject (keywords) RDF 블록 생성
 */
function buildSubjectBlock(keywords: string[]): string {
  if (keywords.length === 0) return '<dc:subject><rdf:Bag/></dc:subject>';

  const items = keywords
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => `<rdf:li>${escapeXml(k)}</rdf:li>`)
    .join('');

  return `<dc:subject><rdf:Bag>${items}</rdf:Bag></dc:subject>`;
}

/**
 * dc:title RDF 블록 생성
 */
function buildTitleBlock(title: string): string {
  return `<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(title)}</rdf:li></rdf:Alt></dc:title>`;
}

/**
 * dc:description RDF 블록 생성
 */
function buildDescriptionBlock(description: string): string {
  return `<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(description)}</rdf:li></rdf:Alt></dc:description>`;
}

/**
 * 기존 XMP XML 문자열에 메타데이터를 업데이트합니다.
 * 기존 dc:subject, dc:title, dc:description을 교체하고,
 * 없으면 rdf:Description 닫기 태그 앞에 삽입합니다.
 */
function updateXmpXml(existingXml: string, metadata: IPTCMetadata): string {
  let xml = existingXml;

  // dc 네임스페이스가 없으면 추가
  if (!xml.includes('xmlns:dc=')) {
    xml = xml.replace('rdf:about=""', 'rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"');
  }

  // dc:subject 교체/삽입
  const subjectBlock = buildSubjectBlock(metadata.keywords);
  const subjectRegex = /<dc:subject>[\s\S]*?<\/dc:subject>/;
  if (subjectRegex.test(xml)) {
    xml = xml.replace(subjectRegex, subjectBlock);
  } else {
    xml = xml.replace('</rdf:Description>', `${subjectBlock}</rdf:Description>`);
  }

  // dc:title 교체/삽입
  if (metadata.title) {
    const titleBlock = buildTitleBlock(metadata.title);
    const titleRegex = /<dc:title>[\s\S]*?<\/dc:title>/;
    if (titleRegex.test(xml)) {
      xml = xml.replace(titleRegex, titleBlock);
    } else {
      xml = xml.replace('</rdf:Description>', `${titleBlock}</rdf:Description>`);
    }
  }

  // dc:description 교체/삽입
  if (metadata.caption) {
    const descBlock = buildDescriptionBlock(metadata.caption);
    const descRegex = /<dc:description>[\s\S]*?<\/dc:description>/;
    if (descRegex.test(xml)) {
      xml = xml.replace(descRegex, descBlock);
    } else {
      xml = xml.replace('</rdf:Description>', `${descBlock}</rdf:Description>`);
    }
  }

  return xml;
}

/**
 * XMP 패킷을 재구성합니다.
 * xpacket 패딩을 적절히 조정합니다.
 */
function rebuildXmpPacket(updatedXml: string, originalPacketSize: number): Uint8Array {
  const header = '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>';
  const footer = '<?xpacket end="w"?>';

  const content = `${header}\n${updatedXml}\n`;
  const minSize = textEncoder.encode(content + footer).length;

  // 원본 패킷 크기에 맞추되, 더 커졌으면 새 크기 사용
  const targetSize = Math.max(originalPacketSize, minSize);
  const paddingNeeded = targetSize - minSize;

  // 공백으로 패딩 채우기
  const padding = paddingNeeded > 0 ? ' '.repeat(paddingNeeded - 1) + '\n' : '';

  const fullPacket = content + padding + footer;
  return textEncoder.encode(fullPacket);
}

/**
 * 새 XMP APP1 세그먼트를 생성합니다.
 */
function buildXmpApp1Segment(xmpPacket: Uint8Array): Uint8Array {
  const headerBytes = textEncoder.encode(XMP_HEADER);
  const dataLength = headerBytes.length + xmpPacket.length;
  const segLength = 2 + dataLength; // length 필드 자체 포함

  const segment = new Uint8Array(2 + segLength);
  let offset = 0;

  // APP1 marker
  segment[offset++] = 0xff;
  segment[offset++] = 0xe1;

  // Segment length
  segment[offset++] = (segLength >> 8) & 0xff;
  segment[offset++] = segLength & 0xff;

  // XMP header
  segment.set(headerBytes, offset);
  offset += headerBytes.length;

  // XMP data
  segment.set(xmpPacket, offset);

  return segment;
}

/**
 * JPEG 바이너리에 XMP 메타데이터를 삽입/업데이트합니다.
 */
export function embedXMP(jpegData: Uint8Array, metadata: IPTCMetadata): Uint8Array {
  const xmpLocation = findXMPSegment(jpegData);

  if (xmpLocation) {
    // 기존 XMP가 있으면 업데이트
    const { segStart, segEnd, xmpStart } = xmpLocation;
    const originalXmpBytes = jpegData.subarray(xmpStart, segEnd);
    const originalXml = textDecoder.decode(originalXmpBytes);

    // xpacket 내부의 XML 부분만 추출
    const xmpMetaMatch = originalXml.match(/<x:xmpmeta[\s\S]*<\/x:xmpmeta>/);
    if (!xmpMetaMatch) {
      console.warn('[TagStock] Could not parse existing XMP, creating new');
      return insertNewXmp(jpegData, metadata);
    }

    const updatedXml = updateXmpXml(xmpMetaMatch[0], metadata);
    const originalPacketSize = segEnd - xmpStart;
    const newPacket = rebuildXmpPacket(updatedXml, originalPacketSize);
    const newSegment = buildXmpApp1Segment(newPacket);

    // 기존 XMP 세그먼트를 새것으로 교체
    const result = new Uint8Array(jpegData.length - (segEnd - segStart) + newSegment.length);
    result.set(jpegData.subarray(0, segStart));
    result.set(newSegment, segStart);
    result.set(jpegData.subarray(segEnd), segStart + newSegment.length);
    return result;
  }

  // 기존 XMP가 없으면 새로 삽입
  return insertNewXmp(jpegData, metadata);
}

/**
 * 새 XMP를 JPEG에 삽입합니다.
 */
function insertNewXmp(jpegData: Uint8Array, metadata: IPTCMetadata): Uint8Array {
  const subjectBlock = buildSubjectBlock(metadata.keywords);
  const titleBlock = metadata.title ? buildTitleBlock(metadata.title) : '';
  const descBlock = metadata.caption ? buildDescriptionBlock(metadata.caption) : '';

  const xmpXml = `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="TagStock">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
   ${titleBlock}${subjectBlock}${descBlock}
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>`;

  const packet = rebuildXmpPacket(xmpXml, 2048);
  const segment = buildXmpApp1Segment(packet);

  // SOI 직후에 삽입
  const result = new Uint8Array(jpegData.length + segment.length);
  result.set(jpegData.subarray(0, 2)); // SOI
  result.set(segment, 2);
  result.set(jpegData.subarray(2), 2 + segment.length);
  return result;
}
