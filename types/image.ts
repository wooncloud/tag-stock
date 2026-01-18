export interface ImageWithMetadata {
  id: string;
  storage_path: string;
  original_filename: string;
  status: string;
  url?: string;
  created_at: string;
  metadata: Array<{
    id: string;
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
    category: string;
    embedded: boolean;
  }>;
}
