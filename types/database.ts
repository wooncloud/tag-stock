export type UserPlan = 'free' | 'pro';

export type ImageStatus = 'uploading' | 'processing' | 'completed' | 'failed';

export interface Profile {
  id: string;
  email: string;
  plan: UserPlan;
  credits_remaining: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  user_id: string;
  storage_path: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  status: ImageStatus;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface Metadata {
  id: string;
  image_id: string;
  tags: string[];
  title?: string;
  description?: string;
  keywords?: string[];
  category?: string;
  ai_confidence?: number;
  embedded: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImageWithMetadata extends Image {
  metadata?: Metadata;
}

export interface AIGeneratedMetadata {
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  category: string;
  confidence: number;
}
