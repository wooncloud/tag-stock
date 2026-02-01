import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type PostMeta, formatDate } from '@/lib/blog';

interface BlogHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function BlogHeader({
  title = 'Blog',
  description,
  showBackButton = false,
  backHref = '/blog',
  backLabel = 'Back to Blog',
}: BlogHeaderProps) {
  return (
    <div className="mb-8 border-b border-border pb-8">
      {showBackButton && (
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href={backHref} className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}

interface PostHeaderProps {
  post: PostMeta;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8 border-b border-border pb-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/blog" className="flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      {/* Category */}
      {post.category && (
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {post.category}
        </span>
      )}

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      {/* Description */}
      <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>

      {/* Meta Info */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {formatDate(post.date)}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {post.readingTime} min read
        </span>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
            >
              <Tag className="h-3.5 w-3.5" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
