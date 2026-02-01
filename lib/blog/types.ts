export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}
