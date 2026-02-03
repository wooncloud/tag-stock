import Image from 'next/image';
import Link from 'next/link';

import { type PostMeta } from '@/lib/blog';

import { CategoryBadge, PostMetaInfo, TagList } from './shared';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="border-border bg-card hover:border-primary/50 hover:shadow-primary/5 overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg">
          {post.coverImage && (
            <div className="bg-muted relative aspect-video w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="p-5">
            {post.category && <CategoryBadge category={post.category} size="sm" />}

            <h2 className="text-foreground group-hover:text-primary mt-3 text-xl font-semibold transition-colors">
              {post.title}
            </h2>

            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{post.description}</p>

            <div className="mt-4">
              <PostMetaInfo date={post.date} readingTime={post.readingTime} size="sm" />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3">
                <TagList tags={post.tags} maxVisible={3} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

interface PostListProps {
  posts: PostMeta[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
