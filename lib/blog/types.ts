/**
 * Blog post frontmatter - YAML metadata at the top of MDX files
 */
export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
}

/**
 * Post metadata - frontmatter plus computed fields
 */
export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: number;
}

/**
 * Full post - metadata plus content
 */
export interface Post extends PostMeta {
  content: string;
}
