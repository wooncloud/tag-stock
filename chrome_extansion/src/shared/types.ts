/**
 * 지원되는 스톡 사진 사이트
 */
export type SiteType = 'adobe' | 'shutterstock' | 'local' | 'unknown';

/**
 * 활동 로깅을 위한 로그 레벨
 */
export type LogLevel = 'info' | 'success' | 'error';

/**
 * 사이트별 설정
 */
export interface SiteConfig {
  name: string;
  supportsBilingual: boolean;
  maxTitleLength: number;
  keywordSeparator: string;
  urlPatterns: string[];
  selectors: {
    titleField: string;
    keywordField: string;
    saveButton: string;
    [key: string]: string;
  };
}

/**
 * AI가 생성한 메타데이터 결과
 */
export interface AIMetadataResult {
  title: string;
  keyword?: string[];
  keywords?: string;
}

/**
 * 폼 채우기에 준비된 처리된 메타데이터
 */
export interface ProcessedMetadata {
  title: string;
  keywords: string;
}

/**
 * 크롬 메시지 유형
 */
export type MessageAction =
  | 'generateMetadata'
  | 'generateAllMetadata'
  | 'checkStatus'
  | 'openSidePanel';

export type MessageType = 'log' | 'status' | 'fillAllProgress';

/**
 * 콘텐츠 스크립트에서 사이드패널로 보내는 메시지
 */
export interface ContentToSidepanelMessage {
  type: MessageType;
  text?: string;
  level?: LogLevel;
  connected?: boolean;
  site?: string;
  info?: string;
}

/**
 * Fill All Metadata 진행 상황 메시지
 */
export interface FillAllProgressMessage {
  type: 'fillAllProgress';
  current: number;
  total: number;
  status: 'processing' | 'completed' | 'error';
  title?: string;
  error?: string;
}

/**
 * 사이드패널에서 콘텐츠 스크립트로 보내는 메시지
 */
export interface SidepanelToContentMessage {
  action: MessageAction;
  siteType?: SiteType;
}

/**
 * 콘텐츠 스크립트의 응답
 */
export interface ContentScriptResponse {
  success: boolean;
  title?: string;
  keywords?: string;
  error?: string;
  connected?: boolean;
  siteType?: SiteType;
  siteName?: string;
  totalProcessed?: number;
  totalImages?: number;
  errors?: string[];
}

/**
 * 데이터베이스의 사용자 프로필
 */
export interface UserProfile {
  id: string;
  email: string;
  plan: string;
  credits_subscription: number;
  credits_purchased: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 로컬 파일 처리 상태
 */
export type ImageProcessingStatus =
  | 'pending'
  | 'analyzing'
  | 'ready'
  | 'embedding'
  | 'completed'
  | 'error';

/**
 * 사용자가 편집한 메타데이터
 */
export interface EditedMetadata {
  title: string;
  keywords: string[];
  caption?: string;
}

/**
 * 로컬 파일 처리용 이미지
 */
export interface LocalImageFile {
  id: string;
  file: File;
  thumbnailDataUrl: string;
  originalBase64?: string;
  metadata?: AIMetadataResult;
  editedMetadata?: EditedMetadata;
  status: ImageProcessingStatus;
  error?: string;
}

/**
 * 인증 상태
 */
export interface AuthState {
  user: import('@supabase/supabase-js').User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
