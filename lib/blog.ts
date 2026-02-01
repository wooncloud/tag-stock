import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

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

/**
 * Calculate estimated reading time based on word count
 * Average reading speed: ~200 words per minute
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Get all MDX files from the blog directory
 */
function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }
  return fs.readdirSync(BLOG_DIRECTORY).filter((file) => file.endsWith('.mdx'));
}

/**
 * Parse a single MDX file and return its metadata and content
 */
function parsePost(fileName: string): Post | null {
  const slug = fileName.replace(/\.mdx$/, '');
  const filePath = path.join(BLOG_DIRECTORY, fileName);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontmatter = data as PostFrontmatter;

    // Validate required fields
    if (!frontmatter.title || !frontmatter.date || !frontmatter.description) {
      console.warn(`Post "${slug}" is missing required frontmatter fields`);
      return null;
    }

    return {
      slug,
      content,
      readingTime: calculateReadingTime(content),
      ...frontmatter,
    };
  } catch (error) {
    console.error(`Error parsing post "${slug}":`, error);
    return null;
  }
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts(): PostMeta[] {
  const files = getMdxFiles();

  const posts = files
    .map((fileName) => {
      const post = parsePost(fileName);
      if (!post) return null;

      // Return metadata only (exclude content for list view)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...meta } = post;
      return meta;
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  const fileName = `${slug}.mdx`;
  const filePath = path.join(BLOG_DIRECTORY, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parsePost(fileName);
}

/**
 * Get all unique categories from posts
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();

  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  return Array.from(categories).sort();
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(
    (post) => post.category?.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
