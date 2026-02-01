import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { BlogHeader, PostList } from '@/components/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Tips, tutorials, and insights for stock photographers. Learn how to improve your workflow, optimize metadata, and maximize your earnings.',
  openGraph: {
    title: 'Blog | TagStock',
    description:
      'Tips, tutorials, and insights for stock photographers. Learn how to improve your workflow and maximize your earnings.',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <BlogHeader
        title="Blog"
        description="Tips, tutorials, and insights for stock photographers"
      />
      <PostList posts={posts} />
    </div>
  );
}
