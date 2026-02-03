import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import type { Post, PostFrontmatter, PostMeta } from './types';
import { calculateReadingTime } from './utils';

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

// Cache for posts - improves performance in development
let postsCache: PostMeta[] | null = null;
let postsCacheTime = 0;
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 5000 : Infinity; // 5s in dev, forever in prod

/**
 * Clear the posts cache (useful for testing or forced refresh)
 */
export function clearPostsCache(): void {
  postsCache = null;
  postsCacheTime = 0;
}

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
  return postsCache !== null && Date.now() - postsCacheTime < CACHE_TTL;
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
  // Return cached posts if valid
  if (isCacheValid()) {
    return postsCache!;
  }

  const files = getMdxFiles();

  const posts = files
    .map((fileName) => {
      const post = parsePost(fileName);
      if (!post) return null;

      // Return metadata only (exclude content for list view)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Update cache
  postsCache = posts;
  postsCacheTime = Date.now();

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
  return getAllPosts().filter((post) => post.category?.toLowerCase() === category.toLowerCase());
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}
