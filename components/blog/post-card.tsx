import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag } from 'lucide-react';
import { type PostMeta, formatDate } from '@/lib/blog';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            {/* Category Badge */}
            {post.category && (
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h2 className="mt-3 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h2>

            {/* Description */}
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min read
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    +{post.tags.length - 3} more
                  </span>
                )}
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
