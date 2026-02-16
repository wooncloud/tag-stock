export type UserPlan = 'free' | 'pro' | 'max';

export interface Profile {
  id: string;
  email: string;
  plan: UserPlan;
  credits_subscription: number;
  credits_purchased: number;
  lemon_squeezy_subscription_id?: string;
  subscription_management_url?: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

export interface AIGeneratedMetadata {
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  category: string;
  confidence: number;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action: 'generate' | 'embed' | 'download';
  site_type: string | null;
  credits_used: number;
  created_at: string;
}
