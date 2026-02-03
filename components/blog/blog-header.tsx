import { type PostMeta } from '@/lib/blog';

import { BackButton, CategoryBadge, PostMetaInfo, TagList } from './shared';

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
    <div className="border-border mb-8 border-b pb-8">
      {showBackButton && <BackButton href={backHref} label={backLabel} className="mb-4" />}
      <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="text-muted-foreground mt-3 text-lg">{description}</p>}
    </div>
  );
}

interface PostHeaderProps {
  post: PostMeta;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="border-border mb-8 border-b pb-8">
      <BackButton className="mb-6" />

      {post.category && <CategoryBadge category={post.category} />}

      <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p className="text-muted-foreground mt-4 text-lg">{post.description}</p>

      <div className="mt-6">
        <PostMetaInfo date={post.date} readingTime={post.readingTime} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          <TagList tags={post.tags} variant="pill" />
        </div>
      )}
    </header>
  );
}
