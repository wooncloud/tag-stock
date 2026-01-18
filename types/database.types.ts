export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          plan: 'free' | 'pro';
          credits_remaining: number;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          plan?: 'free' | 'pro';
          credits_remaining?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan?: 'free' | 'pro';
          credits_remaining?: number;
          created_at?: string;
        };
      };
      images: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          storage_path?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          created_at?: string;
        };
      };
      metadata: {
        Row: {
          id: string;
          image_id: string;
          tags: Json;
          title: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_id: string;
          tags?: Json;
          title?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_id?: string;
          tags?: Json;
          title?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
