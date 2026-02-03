import Link from 'next/link';

import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

import { formatDate } from '@/lib/blog';

import { Button } from '@/components/ui/button';

/**
 * Back navigation button - reused in BlogHeader and PostHeader
 */
interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href = '/blog',
  label = 'Back to Blog',
  className = '',
}: BackButtonProps) {
  return (
    <Button variant="ghost" size="sm" asChild className={`-ml-2 ${className}`}>
      <Link href={href} className="text-muted-foreground flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

/**
 * Category badge - reused in PostCard and PostHeader
 */
interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`bg-primary/10 text-primary inline-block rounded-full font-medium ${sizeClasses[size]}`}
    >
      {category}
    </span>
  );
}

/**
 * Post meta info (date and reading time) - reused in PostCard and PostHeader
 */
interface PostMetaInfoProps {
  date: string;
  readingTime: number;
  size?: 'sm' | 'md';
}

export function PostMetaInfo({ date, readingTime, size = 'md' }: PostMetaInfoProps) {
  const sizeClasses = {
    sm: 'text-xs gap-1.5',
    md: 'text-sm gap-2',
  };
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={`text-muted-foreground flex flex-wrap items-center gap-4 ${sizeClasses[size]}`}>
      <span className={`flex items-center ${sizeClasses[size]}`}>
        <Calendar className={iconSize} />
        {formatDate(date)}
      </span>
      <span className={`flex items-center ${sizeClasses[size]}`}>
        <Clock className={iconSize} />
        {readingTime} min read
      </span>
    </div>
  );
}

/**
 * Tag list - reused in PostCard and PostHeader
 */
interface TagListProps {
  tags: string[];
  maxVisible?: number;
  variant?: 'default' | 'pill';
}

export function TagList({ tags, maxVisible, variant = 'default' }: TagListProps) {
  if (tags.length === 0) return null;

  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const remainingCount = maxVisible ? tags.length - maxVisible : 0;

  const tagClasses = {
    default: 'rounded bg-muted px-2 py-1 text-xs',
    pill: 'rounded-full bg-muted px-3 py-1 text-sm',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className={`text-muted-foreground flex items-center gap-1 ${tagClasses[variant]}`}
        >
          <Tag className={variant === 'default' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={`text-muted-foreground ${tagClasses[variant]}`}>
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
